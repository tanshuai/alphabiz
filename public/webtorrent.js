const WebTorrent = require('webtorrent')
const wtVersion = require('webtorrent/package.json').version
const { ipcRenderer } = require('electron')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { setSecure } = require('webtorrent/lib/peer')
// const diskusage = require('diskusage')
const FSChunkStore = require('fs-chunk-store')
const is = require('electron-is')
const { utimes } = require('utimes')

import { useAlphabizProtocol, useClientEvents } from './wt-extention.js'
import preloader from './webtorrent-preload.js'
import utils from './webtorrent-utils.js'

const isMac = is.macOS()
const { setAttributeSync, removeAttributeSync, listAttributesSync } = isMac ? require('fs-xattr') : {
  setAttributeSync () {},
  removeAttributeSync () {},
  listAttributesSync () {}
}

const setUtimes = (file) => {
  if (!isMac) return
  if (fs.existsSync(file.path)) {
    const createdTime = Date.now()
    const onDone = () => {
      setTimeout(() => {
        utimes(file.path, {
          btime: createdTime
        })
        const attrs = listAttributesSync(file.path)
        if (attrs && attrs.includes('com.apple.progress.fractionCompleted')) {
          console.log(`[Done] Set file progress to 1. ${file.path}`)
          // Reset created time
          removeAttributeSync(file.path, 'com.apple.progress.fractionCompleted')
        }
      }, 200)
    }
    if (file.progress === 1) {
      onDone()
      return console.log(`${file.path} is finished. Skip adding progress.`)
    }
    file.on('done', onDone)
    /**
     * DO NOT TOUCH!
     * The number is a magic code used by macOS. If the create time of file
     * is not set to this value, the download progress pie will not shown
     * in finder. This is the timestamp of `1984-01-24 08:00:00 +0000`.
     */
    utimes(file.path, {
      btime: 443779200000
    })
    setAttributeSync(file.path, 'com.apple.progress.fractionCompleted', '0.01')
  } else {
    setTimeout(() => setUtimes(file), 100)
  }
}

/**
 * @typedef { import('../src/types').TrackerStatus } TrackerStatus
 */
/**
 * @class TrackerMap
 * @extends { Map<string, TrackerStatus> }
 */
class TrackerMap extends Map {
  /**
   * @method set
   * @param { string } key
   * @param { TrackerStatus } value
   */
  set (key, value) {
    if (typeof value !== 'object') return console.error('Not an object', value)
    super.set(key, Object.assign(
      { url: key },
      value,
      { timestamp: Date.now() }
    ))
  }
}

let info = () => {} // console.log
let verbose = () => {} // console.log
// Use this to keep logger with correct caller line
Object.defineProperty(global, 'log', {
  set (v) {
    if (v) info = console.log
    else info = () => {}
    console.log('Toggle log', v)
  }
})
Object.defineProperty(global, 'verb', {
  set (v) {
    if (v) verbose = console.log
    else verbose = () => {}
    console.log('Toggle verb', v)
  }
})
const warn = console.error
if (process.env.NODE_ENV === 'development') {
  // global.log = true
  // global.verb = true
}
let startServerInfoHash
const infoHashes = []
const shouldDelete = []
/**
 * @typedef { import('../src/types').TorrentInfo } TorrentInfo
 * @typedef { import('webtorrent/lib/torrent') } RawTorrent
 * @typedef { RawTorrent & TorrentInfo } Torrent
 */
// The lib `speedometer` webtorrent dependents performed bad.
// Use customized speeder instead.
const speeder = new Map()
let prevTime = Date.now()
let deltaTime = 1000
/**
 * @method torrentToJson
 * @param { Torrent } tr
 * @param { boolean } isUpload
 * @returns { Partial<Torrent> }
 */
const torrentToJson = (tr) => {
  return utils.torrentToJson(tr, deltaTime, speeder)
}
/** @param { number } speed */
const speedLimit = speed => {
  if (typeof speed !== 'number') return -1
  return speed > 0 ? parseInt(speed) : -1
}
/** @param { string[] } paths */
const getPublicPath = (paths) => {
  if (!paths || paths.length === 0) return ''
  let dir = path.dirname(paths[0])
  for (let i = 1; i < paths.length; i++) {
    while (!paths[i].includes(dir) && dir.length > 1) {
      dir = path.dirname(dir)
    }
  }
  return dir
}

const locked = new Set()

/**
 * @typedef { import('src/types').TorrentInfo } TorrentInfo
 * @typedef { import('webtorrent/lib/torrent') } RawTorrent
 * @typedef { RawTorrent & TorrentInfo } Torrent
 */

window.WEBTORRENT_ANNOUCEMENT = require('create-torrent').announceList
  .map(arr => arr[0])

const VERSION_STR = wtVersion
  .replace(/\d*./g, v => `0${v % 100}`.slice(-2))
  .slice(0, 4)
const peerId = Buffer.from(`-WW${VERSION_STR}-${crypto.randomBytes(9).toString('base64')}`)

/** @type { WebTorrent.Instance } */
let client = null
const initClient = (retries = 0) => {
  if (retries > 10) return
  if (client) {
    if (client.torrents.length) return info('Client is not idle, keep it alive')
  }

  const conf = {
    peerId,
    maxConns: 20
  }
  const dhtPort = parseInt(localStorage.getItem('dhtPort'))
  const torrentPort = parseInt(localStorage.getItem('torrentPort'))
  if (!isNaN(dhtPort)) conf.dhtPort = dhtPort
  if (!isNaN(torrentPort)) conf.torrentPort = torrentPort
  const maxConns = parseInt(localStorage.getItem('maximumConnectionsNum'))
  if (!isNaN(maxConns)) conf.maxConns = maxConns
  const downloadSpeed = parseInt(localStorage.getItem('downloadSpeed'))
  const uploadSpeed = parseInt(localStorage.getItem('uploadSpeed'))
  const payedUserShareRate = Number(localStorage.getItem('payedUserShareRate'))
  // block local IP
  conf.blocklist = utils.getLocalIPList() || []

  // Secure setting
  // conf.secure = true
  const secureOption = localStorage.getItem('webtorrent-secure') || 'auto'
  if (['auto', 'enable', 'disable'].includes(secureOption)) {
    setSecure(secureOption)
  } else {
    setSecure('auto')
    localStorage.setItem('webtorrent-secure', 'auto')
  }

  info('init client', conf)
  client = new WebTorrent(conf)
  if (!isNaN(downloadSpeed)) client.throttleDownload(downloadSpeed)
  if (!isNaN(uploadSpeed) && !isNaN(payedUserShareRate)) client.throttleUpload(uploadSpeed, payedUserShareRate)
  client.on('error', e => {
    warn(e)
    if (dhtPort && torrentPort) {
      retries += 1
      info('try use difference port')
      localStorage.setItem('dhtPort', dhtPort + retries)
      localStorage.setItem('torrentPort', torrentPort + retries)
      initClient(retries)
    }
    ipcRenderer.send('webtorrent-client-error', e.message)
  })
  client.on('warning', e => {
    warn(e)
    ipcRenderer.send('webtorrent-client-warn', e.message)
  })
  client.on('ready', () => {
    console.log('initted')
    ipcRenderer.send('webtorrent-initted')
  })
  window.client = client
  useClientEvents(client)
}
setInterval(() => {
  if (!client) return
  client.torrents.forEach(torrent => {
    if (torrent.paused) return
    if (!torrent.discovery || !torrent.discovery.tracker) return
    torrent.discovery.tracker.update()
  })
}, 10_000)

/**
 * @param { string | Torrent } infoHash
 * @param { string } url
 */
const addTracker = (infoHash, _url) => {
  const url = _url && _url.trim()
  /** @type { Torrent } */
  const tr = typeof infoHash === 'string' ? client.get(infoHash) : infoHash
  if (!tr || !tr.trackerMap) return
  if (tr.trackerMap.has(url)) return
  console.log('add tracker', infoHash, url, tr.trackerMap.get(url), tr.trackerMap.size)
  tr.trackerMap.set(url, { status: 'connecting' })
  utils.addTracker(tr, url)
}
/**
 * @param { string | Torrent } infoHash
 * @param { string } url
 */
const removeTracker = (infoHash, url) => {
  /** @type { Torrent } */
  const tr = typeof infoHash === 'string' ? client.get(infoHash) : infoHash
  if (!tr || !tr.trackerMap) return
  utils.removeTracker(tr, url, () => {
    tr.trackerMap.delete(url)
  })
}
global.addTracker = addTracker
global.removeTracker = removeTracker

let sendPreloadTasks = localStorage.getItem('send-preload-tasks') === '1' ? true : false
/**
 * `setTimeout` cannot be triggered if client is busy.
 * Here we use rAF to ensure out callback runs as fast as posible
 */
const queueTimeout = (cb, timeout) => {
  const start = Date.now()
  const run = () => {
    if (Date.now() - start >= timeout) cb()
    else requestAnimationFrame(run)
  }
  requestAnimationFrame(run)
}
let shouldSendInfo = true
const updateTorrent = (once = false) => {
  // console.time('torrent status')
  if (!shouldSendInfo && !once) {
    queueTimeout(updateTorrent, 1000)
    return info('skip send')
  } else {
    verbose('update torrent')
  }
  const curTime = Date.now()
  deltaTime = (curTime - prevTime) / 1000
  prevTime = curTime
  let totalDownloadSpeed = 0
  let totalUploadSpeed = 0
  if (client.torrents.length) {
    const allTorrents = client.torrents.filter(i => {
      if (shouldDelete.includes(i.infoHash)) return false
      if (i.isAutoUpload && !i.ready && !i.verifyStatus) return false
      return true
    })
    const torrents = allTorrents.map(tr => {
      if (!tr.done && typeof tr.usedTime === 'number') tr.usedTime += 1000
      const t = torrentToJson(tr)
      if (!speeder.has(t.infoHash) || !tr.ready) {
        t.downloadSpeed = 0
        t.uploadSpeed = 0
        speeder.set(t.infoHash, {
          downloaded: 0,
          uploaded: 0
        })
      } else {
        const prev = speeder.get(t.infoHash)
        if (prev.downloaded === 0) t.downloadSpeed = 0
        else t.downloadSpeed = Math.floor((tr.downloaded - prev.downloaded) / deltaTime)
        if (prev.uploaded === 0) t.uploadSpeed = 0
        else t.uploadSpeed = Math.floor((tr.uploaded - prev.uploaded) / deltaTime)
        // if (!t.upload) info(prev.downloaded, tr.downloaded, t.downloadSpeed, deltaTime)
        if (t.downloadSpeed < 0) t.downloadSpeed = 0
        if (t.uploadSpeed < 0) t.uploadSpeed = 0
        totalDownloadSpeed += t.downloadSpeed
        totalUploadSpeed += t.uploadSpeed
        speeder.set(t.infoHash, {
          downloaded: tr.downloaded,
          uploaded: tr.uploaded
        })
      }
      return t
    })
    if (isMac) {
      // TODO: update download progress for finder
      torrents.forEach(tr => {
        if (tr.upload || tr.progress === 1 || tr.isSeeding) return
        // console.log('update progress for', tr)
        const files = tr.files
        files.forEach(f => {
          if (('path' in f) && ('progress' in f) && fs.existsSync(f.path)) {
            // The min value is '0.01'
            if (f.progress < 0.01) return
            // Set file progress
            // console.log(`[Progress] Set file progress to ${f.progress}. ${f.path}`)
            setAttributeSync(f.path, 'com.apple.progress.fractionCompleted', f.progress.toFixed(2))
          }
        })
      })
    }
    verbose('send torrents', torrents)
    // window._torrents = torrents
    // torrents.forEach(tr => ipcRenderer.send('webtorrent-data', tr))
    ipcRenderer.send('webtorrent-torrents', torrents)
  } else if (client.ready) {
    ipcRenderer.send('webtorrent-torrents', [])
  }
  ipcRenderer.send('webtorrent-client-info', {
    downloadSpeed: totalDownloadSpeed < 0 ? 0 : totalDownloadSpeed,
    uploadSpeed: totalUploadSpeed < 0 ? 0 : totalUploadSpeed,
    progress: client.progress,
    taskNum: client.torrents.length
  })
  // console.timeEnd('torrent status')
  // if there are too many torrents in the client
  // send info every seconds may cause performance issue
  if (client.torrents.length > 50) {
    client.maxConns = Math.min(client.maxConns, 10)
  }
  if (once) return
  if (sendPreloadTasks) {
    const preloadTasks = []
    for (const [abUrl, values] of preloader.preloadTasks.entries()) {
      const { torrentPath, downloadPath, torrent } = values
      if (!torrent) continue
      preloadTasks.push({ abUrl, torrentPath, downloadPath, torrent, postTitle: torrent.postTitle || '' })
    }
    for (const task of preloader.taskQueue) {
      if (preloadTasks.find(t => t.abUrl === task.url)) continue
      preloadTasks.push({
        abUrl: task.origin,
        torrentPath: null,
        downloadPath: null,
        torrent: null,
        postTitle: task.postTitle
      })
    }
    for (const task of preloader.failures) {
      if (preloadTasks.find(t => t.abUrl === task.url)) continue
      preloadTasks.push({
        abUrl: task.origin,
        torrentPath: null,
        downloadPath: null,
        torrent: null,
        postTitle: task.postTitle,
        failed: true
      })
    }
    // console.log('send preload tasks', preloadTasks)
    ipcRenderer.send('webtorrent-preload', preloadTasks)
  } else {
    ipcRenderer.send('webtorrent-preload', [])
  }
  if (client.torrents.length > 100) {
    client.maxConns = Math.min(client.maxConns, 5)
    queueTimeout(updateTorrent, 2000)
  } else queueTimeout(updateTorrent, 1000)
}
queueTimeout(updateTorrent, 1000)

let queueUpdate = null
const forceUpdateTorrent = () => {
  if (queueUpdate) {
    clearTimeout(queueUpdate)
    queueUpdate = setTimeout(() => {
      queueUpdate = null
      updateTorrent(true)
    }, 100)
  }
}

const onDone = (tr) => {
  setTimeout(() => {
    if (isMac && tr.files && tr.files.length) {
      tr.files.forEach(file => {
        const attrs = listAttributesSync(file.path)
        if (attrs && attrs.includes('com.apple.progress.fractionCompleted')) {
          console.log(`[Done] Set file progress to 1. ${file.path}`)
          removeAttributeSync(file.path, 'com.apple.progress.fractionCompleted', '1')
        }
      })
    }
  }, 1000)
  if (tr.upload) return console.log('skip upload')
  tr.isSeeding = true
  const json = torrentToJson(tr)
  if (!tr.completedTime) tr.completedTime = Date.now()
  ipcRenderer.send('webtorrent-done', json)
  ipcRenderer.send('webtorrent-finish-all-payments', json)
}
/** @param { RawTorrent } tr */
const onReady = (tr) => {
  tr.files.forEach(/** @param { import('webtorrent/lib/file') } f */f => {
    // BitComet 0.85+ uses these files itself but will never seed them,
    // We just ignore them since we can do nothing to them.
    if (f.name.match(/^_____padding_file_(.*)____$/)) {
      info('deselect', f.name)
    }
    if (isMac && f.path) {
      setUtimes(f)
    }
  })
  const json = torrentToJson(tr)
  info('ready', json)
  ipcRenderer.send('webtorrent-ready', json)
  if (startServerInfoHash === json.infoHash) {
    startServer(json.infoHash, json)
    startServerInfoHash = ''
  }
  // diskusage.check(tr.path, (err, result) => {
  //   if (err) warn(err)
  //   else {
  //     const { free } = result
  //     if (tr.length - tr.downloaded > free + 100_000_000) {
  //       ipcRenderer.send('webtorrent-no-space', json)
  //       stopTorrent(tr.infoHash)
  //     }
  //   }
  // })
  if (client.torrents.filter(i => !i.ready).length === 0) {
    info('All torrents are ready')
  }
}
const onMetadata = (tr, conf) => {
  // info('metadata', torrentToJson({ ...conf, ...tr }))
  ipcRenderer.send('webtorrent-metadata', tr.infoHash)
  ipcRenderer.send('webtorrent-data', torrentToJson(tr))
}
const onWire = (wire, tr, abProtocol) => {
  wire.use(abProtocol)
  if (wire.type === 'webrtc') {
    // info('onwire', wire.remoteAddress, wire.peerId)
    const setAddress = () => {
      if (wire.remoteAddress) return
      const peer = tr._peers[wire.peerId]
      if (!peer) return setTimeout(setAddress, 1000)
      const address = peer.conn?._pc?.currentRemoteDescription?.sdp?.match(/c=IN\sIP\d\s(.*)/)?.[1]
      if (!address) return setTimeout(setAddress, 1000)
      wire.remoteAddress = address
    }
    setAddress()
  }
}
const onInfoHash = (infoHash, tr, conf, isSeeding) => {
  info('infoHash', infoHash)
  if (shouldDelete.includes(infoHash)) {
    shouldDelete.splice(shouldDelete.indexOf(infoHash), 1)
  }
  if (infoHashes.includes(infoHash)) {
    if (client.get(infoHash) !== tr) {
      info('Destroy tr')
      ipcRenderer.send('webtorrent-existed', infoHash)
      tr.destroy()
    } else {
      ipcRenderer.send('webtorrent-infohash', infoHash, { ...conf, isSeeding })
    }
  } else ipcRenderer.send('webtorrent-infohash', infoHash, { ...conf, isSeeding })
  infoHashes.push(infoHash)
  forceUpdateTorrent()
}
/**
 * @function addListeners
 * @param { Torrent } tr
 * @param { TorrentInfo } conf
 * @param { boolean } isSeeding
 */
const addListeners = (tr, conf = {}, isSeeding = false) => {
  if (!conf) conf = {}
  tr.pending = false
  tr.removeAllListeners()
  tr.setMaxListeners(0)
  info(`Add listeners to torrent ${tr.infoHash || tr.token || tr.origin}`)
  // tr.on('download', throttle(() => {
  //   ipcRenderer.send('webtorrent-data', torrentToJson(tr))
  // }))
  tr.on('done', () => onDone(tr))
  tr.on('ready', () => onReady(tr))
  tr.on('metadata', () => onMetadata(tr, conf))
  tr.on('infoHash', infoHash => {
    onInfoHash(infoHash, tr, conf, isSeeding)
  })
  tr.on('warning', () => {})
  tr.on('error', e => {
    console.log('Torrent error', e, conf)
    ipcRenderer.send('webtorrent-error', torrentToJson(tr), e.message)
  })
  const abProtocol = useAlphabizProtocol(client, tr)
  tr.on('wire', wire => onWire(wire, tr, abProtocol))
  tr.on('discovery', () => {
    if (tr.discovery) {
      info('start discovery')
      tr.trackerMap = new TrackerMap()
      // init map
      tr.discovery._announce.forEach(url => {
        verbose('Discovered', url)
        tr.trackerMap.set(url, { status: 'connecting' })
        if (!url.startsWith('ws')) {
          if (url.match(/(\d{1,3}\.){3}\d{1,3}/)) {
            // ipv4 only
            return
          }
          tr.trackerMap.set(url + '@6', { status: 'connecting' })
        }
      })
      tr.discovery.tracker.on('warning', (error, url, family) => {
        verbose('tracker warning', url, error.message, family)
        if (!url) return console.warn('No emitted url', error)
        if (family === 6) {
          // info('ipv6 tracker error', url)
          url = url + '@6'
        }
        tr.trackerMap.set(url, {
          status: 'error',
          message: utils.parseTrackerWarning(error.message)
        })
      })
      // tr.discovery.tracker.on('peer', (...args) => {
      //   info('tracker peer', args)
      // })
      tr.discovery.tracker.on('update', (info, url, family) => {
        verbose('tracker update', url, info)
        if (!url) return console.warn('No emitted url', info)
        if (family === 6) {
          // info('ipv6 tracker', url)
          url = url + '@6'
        }
        tr.trackerMap.set(url, {
          status: 'updated',
          info
        })
      })
      // tr.discovery.tracker.on('scrape', (...args) => {
      //   info('tracker scrape', args)
      // })
      // tr.addTracker = url => utils.addTracker(tr, url)
      // tr.removeTracker = url => utils.removeTracker(tr, url)
      if (conf.customTrackers) {
        for (const tracker of conf.customTrackers) {
          addTracker(tr, tracker)
        }
      }
    } else {
      info('no discovery')
    }
  })
}
/**
 * @param { string } token
 * @param { TorrentInfo } conf
 * @param { Function } [cb]
 */
const addTorrent = (token, conf, cb) => {
  verbose('Add torrent', token, conf)
  if (conf.isSeeding && conf.progress === 1) return seedTorrent(token, conf.file, conf)
  if (conf.infoHash) {
    const matched = conf.infoHash.match(/btih:([^&]*)/)
    const _hash = (matched && matched[1]) || conf.infoHash
    if (_hash && client.get(_hash)) {
      info('exist', client.get(_hash))
      return ipcRenderer.send('webtorrent-existed', _hash)
    }
  }
  if (conf.origin) {
    if (locked.has(conf.origin)) {
      info('origin lock', conf.origin)
      return locked.delete(conf.origin)
    } else {
      locked.add(conf.origin)
    }
  }
  if (conf.token !== conf.origin) {
    if (locked.has(conf.token)) {
      info('token lock', conf.token)
      info(locked)
      return locked.delete(conf.token)
    } else {
      locked.add(conf.token)
    }
  }
  const add = () => {
    const torrentId = (conf.torrentPath && fs.existsSync(conf.torrentPath))
      ? conf.torrentPath
      : fs.existsSync(conf.token || conf.origin)
        ? conf.token || conf.origin
        : conf.infoHash
    info(torrentId)
    const tr = client.add(torrentId, {
      path: conf.path || conf.downloadDirectory,
      store: FSChunkStore,
      storeOpts: {
        postTitle: conf.postTitle || ''
      },
      storeCacheSlots: 1,
      strategy: 'sequential',
      maxWebConns: client.maxConns,
      // skipVerify: true,
      announce: [...(conf.trackers || []), ...WEBTORRENT_ANNOUCEMENT]
    })
    tr.token = token
    tr.origin = conf.infoHash || conf.token || conf.origin
    tr.createdTime = conf.createdTime || Date.now()
    tr.usedTime = conf.usedTime || 0
    if (conf.fromPost) tr.fromPost = conf.fromPost
    if (conf.postTitle) tr.postTitle = conf.postTitle
    if (conf.name) tr.name = conf.name
    if (conf.subtitleList && conf.subtitleList.length) tr.subtitleList = conf.subtitleList
    verbose('Torrent conf', tr)
    addListeners(tr, conf)
    verbose('Listener added')
    tr.once('infoHash', () => {
      locked.delete(conf.origin)
      locked.delete(tr.infoHash)
      locked.delete(conf.token)
      if (cb) cb(tr)
    })
    if (conf.verifiedPieces) {
      tr.once('metadata', () => {
        // If torrent is larger than 200MB, skip verifying downloaded
        // pieces. This makes webtorrent init much more faster.
        // It is dangerous, but useful if we add so many torrents.
        if (tr.length < 200_000_000) return
        let ctr = 0
        // Defaultly verify 20% of downloaded pieces
        let rate = 0.2
        // 10% if larger than 5G
        if (tr.length > 5_000_000_000) rate = 0.1
        // 5% if larger than 20G
        if (tr.length > 20_000_000_000) rate = 0.05
        if (tr.length > 50_000_000_000) rate = 0.01
        if (tr.length > 100_000_000_000) rate = 0.005
        conf.verifiedPieces.forEach(range => {
          // tr._markVerified(index)
          // If range is an array of [start, end]
          if (Array.isArray(range)) {
            const [start, end] = range
            // The first and last pieces are verified. But for security
            // reason, we skip these pieces in range.
            for (let i = start + 1; i < end - 1; i++) {
              // Randomly verify parts of downloaded pieces
              // if (Math.random() > rate) tr._markVerified(i)
              tr._markVerified(i)
              ctr++
            }
          } else {
            if (!isNaN(range)) {
              tr._markVerified(range)
              ctr++
            }
          }
        })
        info('mark verified', conf.verifiedPieces, ctr)
      })
    }
  }
  if (client.get(conf.infoHash)) {
    client.remove(conf.infoHash, add)
  } else if (client.torrents.some(torrent => torrent.token === token)) {
    const tr = client.torrents.find(torrent => torrent.token === token)
    if (tr) {
      if (tr.infoHash) return cb && cb(tr)
      tr.once('infoHash', () => cb && cb(tr))
    } else {
      return add()
    }
  } else add()
}
/** @param { string } infoHash */
const stopTorrent = infoHash => {
  if (locked.has(infoHash)) return
  else locked.add(infoHash)
  if (server && serverInfoHash === infoHash) {
    server.destroy()
    server = null
    serverInfoHash = ''
  }
  const tr = client.get(infoHash)
  if (tr && (tr.isSeeding || tr.done)) {
    tr.completed = true
  }
  if (tr) {
    tr.destroy(() => {
      locked.delete(infoHash)
      ipcRenderer.send('webtorrent-stop', infoHash, tr.completed)
    })
  } else {
    locked.delete(infoHash)
    if (infoHash) {
      const _tr = client.torrents.find(tr => tr.token === infoHash)
      if (_tr) {
        _tr.destroy(() => {
          locked.delete(infoHash)
          ipcRenderer.send('webtorrent-stop', infoHash, _tr.completed)
        })
      }
    } else {
      ipcRenderer.send('webtorrent-notfound', infoHash)
    }
  }
  if (infoHashes.includes(infoHash)) {
    infoHashes.splice(infoHashes.indexOf(infoHash), 1)
  }
  forceUpdateTorrent()
}
/**
 * @param { string } infoHash
 * @param { boolean } destroyStore
 * @param { () => void } onDeleted
 */
const deleteTorrent = (infoHash, destroyStore, onDeleted) => {
  if (locked.has(infoHash)) return
  else locked.add(infoHash)
  shouldDelete.push(infoHash)
  if (server && serverInfoHash === infoHash) {
    server.destroy()
    server = null
    serverInfoHash = ''
  }
  const tr = client.get(infoHash) || client.torrents.find(t => t.token === infoHash)
  info('delete', infoHash, tr, destroyStore)
  if (tr) {
    tr.emit('deleted')
    info('emit', tr.emit)
    const filePaths = tr.files.length ? tr.files.map(i => i.path) : tr.file || []
    const publicPath = getPublicPath(filePaths)
    tr.destroy({ destroyStore }, () => {
      if (typeof onDeleted === 'function') onDeleted()
      if (destroyStore) {
        ipcRenderer.send('webtorrent-delete', tr.infoHash || infoHash, publicPath, filePaths)
      } else {
        ipcRenderer.send('webtorrent-delete', tr.infoHash || infoHash)
      }
      locked.delete(infoHash)
      try {
        client.remove(tr.infoHash)
      } catch (_) { }
    })
  } else {
    locked.delete(infoHash)
    ipcRenderer.send('webtorrent-notfound', infoHash)
  }
  while (infoHashes.includes(infoHash)) {
    infoHashes.splice(infoHashes.indexOf(infoHash), 1)
  }
  forceUpdateTorrent()
}
/**
 * @param { string } token
 * @param { string[] } files
 * @param { TorrentInfo } options
 * @param { boolean } isAutoUpload
 * @param { function } callback
 */
const seedTorrent = (token, files, options, isAutoUpload = false, callback = null) => {
  if (options.infoHash && client.get(options.infoHash)) return info('skip existed', options.infoHash)
  const _torrentId = options.infoHash || options.token || options.origin || (Array.isArray(files) ? files[0] : files)
  if (_torrentId) {
    if (locked.has(_torrentId)) return
    else locked.add(_torrentId)
  }
  let tr = null
  const announce = [...(options.trackers || []), ...WEBTORRENT_ANNOUCEMENT]
  const seedOpts = {
    ...options,
    store: FSChunkStore,
    storeOpts: {
      postTitle: options.postTitle || ''
    },
    storeCacheSlots: 1,
    strategy: 'sequential',
    maxWebConns: client.maxConns,
    announce
  }
  if (options.infoHash && !options.upload && options.files.length) {
    info('[seed] add torrent with token')
    info(options)
    tr = client.add(options.infoHash || options.token || options.origin, Object.assign(seedOpts, {
      path: options.path || options.downloadDirectory,
      skipVerify: options.progress === 1
    }))
  } else if (options.isSeeding && options.torrentPath && fs.existsSync(options.torrentPath)) {
    info('[seed] add torrent with torrentPath')
    tr = client.add(options.torrentPath, Object.assign(seedOpts, {
      path: options.path || options.downloadDirectory,
      skipVerify: true
    }))
  } else if (options.isSeeding && options.magnetURI && !options.isUploadByFiles) {
    info('[seed] add torrent with magnetURI')
    tr = client.add(options.magnetURI, Object.assign(seedOpts, {
      path: options.path || options.downloadDirectory,
      skipVerify: true
    }))
    tr.upload = true
    tr.isSeeding = true
  } else {
    info('[seed] Seed torrent with files', !!options.infoHash, options)
    const uploadTasks = client.torrents.filter(tr => tr.progress === 1)
    const uploadingFiles = uploadTasks.reduce((all, tr) => {
      const files = tr.files.map(f => f.path)
      all.push(...files)
      return all
    }, [])
    if (files.some(file => {
      return uploadingFiles.includes(file)
    })) {
      ipcRenderer.send('webtorrent-seed-error', 'task_exists')
    }
    tr = client.seed(files, Object.assign(seedOpts, {
      skipVerify: !!options.infoHash,
      onProgress (current, total) {
        // info('onprogress', current, total, current / total)
        tr.verifyStatus = { current, total }
      }
    }))
    tr.isUploadByFiles = true
  }
  info('seedTorrent', options, tr, files)
  if (options.name) tr.name = options.name
  tr.isAutoUpload = isAutoUpload
  tr.token = token
  tr.isSeeding = true
  tr.upload = true
  tr.paused = false
  tr.file = files
  tr.createdTime = options.createdTime || Date.now()
  addListeners(tr, options, true)
  tr.once('infoHash', () => {
    locked.delete(_torrentId)
    if (callback) callback()
  })
  tr.once('metadata', () => {
    ipcRenderer.send('webtorrent-seed', torrentToJson(tr))
  })
  // The torrent to seed may computing hashes after torrent deleted
  tr.once('deleted', () => {
    // info('torrent deleted')
    if (seedOpts.onProgress) {
      seedOpts.onProgress._destroyed = true
    }
  })
  return tr
}

const getTorrent = () => {
  const torrents = client.torrents.map(i => torrentToJson(i))
  info(torrents)
  return ipcRenderer.send('webtorrent-list', torrents)
}

/**
 * @param { Object } conf
 * @param { 'low'|'mid'|'high' } conf.level
 */
const setThrottleGroup = ({ infoHash, peerId, subId, level }) => {
  const tr = client.get(infoHash)
  if (!tr) {
    info('not found', infoHash)
    ipcRenderer.send('webtorrent-set-throttle', {
      code: -1,
      message: 'Torrent Not Found'
    })
    return null
  }
  let peer = null, error = null
  for (const wire of tr.wires) {
    if (subId ? wire.remoteSub === subId : wire.peerId === peerId) {
      peer = wire
      try {
        wire._setThrottleGroup(level)
      } catch (e) {
        error = { code: -1, message: e.message }
      }
      break
    }
  }
  if (!peer) {
    ipcRenderer.send('webtorrent-set-throttle', {
      code: -1,
      message: 'Peer Not Found'
    })
  } else if (error) ipcRenderer.send('webtorrent-set-throttle', error)
  else {
    ipcRenderer.send('webtorrent-set-throttle', {
      code: 0,
      message: 'success'
    })
  }
  return peer
}
const saveTorrentFile = (infoHash, dir) => {
  const channel = 'webtorrent-save-torrent'
  const tr = client.get(infoHash)
  if (!tr) return
  if (!tr.torrentFile || !tr.name) {
    return ipcRenderer.send(channel, {
      code: -1,
      message: 'Torrent Not Ready'
    })
  }
  const torrentPath = path.resolve(dir, `${tr.name}.torrent`)
  if (fs.existsSync(torrentPath)) {
    return ipcRenderer.send(channel, {
      code: 0,
      message: 'success',
      infoHash,
      torrentPath
    })
  }
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(torrentPath, tr.torrentFile)
  ipcRenderer.send(channel, {
    code: 0,
    message: 'success',
    infoHash,
    torrentPath
  })
}

/** @type { ReturnType<import('webtorrent/lib/server')>} */
let server = null
let serverInfoHash = ''
/** @param { Torrent } tr */
const startTorrentServer = tr => {
  info('Start server', tr)
  startServerInfoHash = ''
  if (server) {
    // should stop old server and start a new one
    if (serverInfoHash === tr.infoHash) {
      return ipcRenderer.send('webtorrent-server-ready', tr.infoHash, {
        token: tr.token,
        port: server.address().port
      })
    } else {
      server.destroy()
      server = null
      serverInfoHash = ''
    }
  }
  info('Create server', tr)
  server = tr.createServer()
  server.listen(0, () => {
    const port = server.address().port
    const info = {
      token: tr.token,
      port
    }
    ipcRenderer.send('webtorrent-server-ready', tr.infoHash, info)
    const sendProgress = () => {
      const progress = tr.files.map(f => {
        const prog = []
        for (let i = f._startPiece; i < f._endPiece; i++) {
          prog.push(tr.pieces[i] === null ? 1 : 0)
        }
        return {
          name: f.name,
          path: f.path,
          progress: prog
        }
      })
      ipcRenderer.send('webtorrent-server-progress', tr.infoHash, progress)
    }
    setTimeout(sendProgress, 1000)
    // We don't need to update progress very frequently, 5s is enough
    const inter = setInterval(sendProgress, 5000)
    server.once('close', () => clearInterval(inter))
  })
}
const startServer = (infoHash, conf) => {
  info('start server', infoHash, conf)
  startServerInfoHash = infoHash
  const tr = client.get(infoHash)
  if (!tr) {
    return addTorrent(conf.token || conf.infoHash, conf, () => {
      return startServer(infoHash, conf)
    })
  }
  if (tr.ready) {
    info('tr ready. start server')
    startTorrentServer(tr, conf)
  } else {
    tr.once('ready', () => startTorrentServer(tr, conf))
  }
}
const stopServer = () => {
  if (!server) return
  server.destroy()
  server = null
  serverInfoHash = ''
  info('Destroy server')
}

(function init () {
  ipcRenderer.once('redirect-log', (e, logPath) => {
    console.log('Write webtorrent logs to', logPath)
    utils.useRedirectLogs(logPath)
  })
  ipcRenderer.on('add-torrent', (e, token, torrentInfo) => {
    if (torrentInfo.magnetURI && !torrentInfo.torrentPath) {
      const preloaded = preloader.loadCache(torrentInfo.magnetURI, torrentInfo.path)
      if (preloaded) {
        console.log('[Preload] Load cached task', preloaded)
        torrentInfo.torrentPath = preloaded
      } else {
        console.log('Cannot find preloaded task for', torrentInfo)
      }
    }
    return addTorrent(token, torrentInfo)
  })
  ipcRenderer.on('stop-torrent', (e, infoHash) => {
    console.log('got stop', infoHash)
    return stopTorrent(infoHash)
  })
  ipcRenderer.on('stop-all-uploading', (e, torrents) => {
    torrents.forEach(tr => {
      const t = client.torrents.find(i => {
        if (i.infoHash && i.infoHash === tr.infoHash) return true
        if (i.token && i.token === tr.token) return true
        return false
      })
      if (t) t.destroy()
    })
  })
  ipcRenderer.on('delete-all', (e, type, destroyStore, deleteAutoUpload) => {
    shouldSendInfo = false
    info('Delete all', type, destroyStore, deleteAutoUpload)
    const toDeletes = client.torrents.filter(tr => {
      if (type === 'all') return true
      const isUpload = tr.upload || tr.progress === 1 || tr.isSeeding
      if (type === 'upload') {
        if (!deleteAutoUpload && tr.isAutoUpload) return false
        return isUpload
      }
      return !isUpload
    })
    if (!toDeletes.length) {
      shouldSendInfo = true
      return
    }
    // ensure all torrents are deleted
    let end = 0
    toDeletes.forEach(tr => {
      end++
      info(tr.infoHash)
      shouldDelete.push(tr.infoHash)
      tr.removeAllListeners()
      try {
        deleteTorrent(tr.infoHash, destroyStore, () => {
          if (shouldDelete.includes(tr.infoHash)) {
            shouldDelete.splice(shouldDelete.indexOf(tr.infoHash), 1)
          }
          end--
          if (end === 0) shouldSendInfo = true
        })
      } catch (e) { }
    })
    // avoid something go wrong
    setTimeout(() => {
      shouldSendInfo = true
    }, 2000)
  })
  ipcRenderer.on('seed-torrent', (e, torrentInfo) => {
    let { file, token, ...options } = torrentInfo
    // for downloaded torrents
    if (!file) file = torrentInfo.files.map(i => i.path)
    console.log(torrentInfo)
    if (!file.length) return ipcRenderer.send('seed-error')
    if (!token) token = Math.random().toString().substr(2)
    return seedTorrent(token, file, options)
  })
  ipcRenderer.on('seed-torrents', (e, confs) => {
    info(`Seed ${confs.length} torrents`)
    confs.forEach(conf => {
      let { file, token, ...options } = conf
      if (!file) file = conf.files.map(i => i.path)
      if (!token) token = Math.random().toString().substring(2)
      seedTorrent(token, file, { ...conf })
    })
  })
  ipcRenderer.on('autoupload-files', async (e, files) => {
    info('autoupload files', files)
    Promise.all(files.map(file => {
      info('Auto upload', file)
      // if file is already uploaded, ignore it
      if (client.torrents.some(/** @param { Torrent } tr */tr => {
        return tr.files.some(f => {
          return f.path === file
        }) || (tr.file && tr.file.some && tr.file.some(f => f === file)) || tr.file === file
      })) {
        info(`${file} is already uploaded, skipped`)
        return
      }
      return new Promise(resolve => {
        seedTorrent(
          'autoupload-' + path.basename(file),
          [file],
          { path: path.dirname(file) },
          true,
          resolve
        )
      })
    })).then(() => {
      info('autoupload complete')
      ipcRenderer.send('autoupload-complete')
    }).catch((error) => {
      ipcRenderer.send('autoupload-complete', error.message || error)
    })
    // Call tr#destroy in torrents.forEach may cause undefined behavior
    // since tr#destory will remove it from torrents
    // Save references before destroy them
    const toDestroy = []
    client.torrents.forEach(/** @param { Torrent } tr */ tr => {
      if (tr.isAutoUpload && tr.ready) {
        if (!tr.files.some(f => files.includes(f.path))) {
          // remove deleted file
          info(`${tr.infoHash} has been deleted. Destroy`, tr.files.map(i => i.path))
          // tr.destroy(() => {
          //   ipcRenderer.send('webtorrent-delete', tr.infoHash)
          // })
          toDestroy.push(tr)
        } else {
          info(`${tr.infoHash} is kept alive`)
        }
      }
    })
    toDestroy.forEach(tr => {
      tr.destroy(() => {
        ipcRenderer.send('webtorrent-delete', tr.infoHash)
      })
    })
  })
  ipcRenderer.on('start-server', (e, { infoHash, conf }) => {
    info('start server', infoHash, conf)
    return startServer(infoHash, conf)
  })
  ipcRenderer.on('stop-server', () => stopServer())
  ipcRenderer.on('delete-torrent', (e, infoHash, destroyStore) => {
    return deleteTorrent(infoHash, destroyStore)
  })
  ipcRenderer.on('pend-torrent', (e, conf) => {
    const tr = client.get(conf.infoHash)
    if (infoHashes.includes(conf.infoHash)) {
      infoHashes.splice(infoHashes.indexOf(conf.infoHash), 1)
    }
    info('Pend', conf.infoHash, tr)
    if (tr) {
      tr.removeAllListeners()
      tr.destroy()
      tr.pending = true
      ipcRenderer.send('webtorrent-pending', torrentToJson(tr))
    }
  })
  ipcRenderer.on('set-throttle-group', (e, { infoHash, peerId, subId, level }) => {
    info(infoHash, peerId, subId, level)
    setThrottleGroup({ infoHash, peerId, subId, level })
  })
  ipcRenderer.on('save-torrent-file', (e, infoHash, dir) => saveTorrentFile(infoHash, dir))
  ipcRenderer.on('update-settings', (e, {
    uploadSpeed,
    downloadSpeed,
    maximumConnectionsNum,
    DHTlistenPort,
    BTlistenPort,
    payedUserShareRate,
    secureOption,
    libraryPreload,
    showPreload
  }) => {
    // old versions use string, but now number
    const dhtPort = parseInt(DHTlistenPort)
    const torrentPort = parseInt(BTlistenPort)
    info('Set client', {
      uploadSpeed,
      downloadSpeed,
      maximumConnectionsNum,
      dhtPort,
      torrentPort,
      payedUserShareRate,
      secureOption,
      libraryPreload,
      showPreload
    })
    if (payedUserShareRate) {
      const shareRate = Number(payedUserShareRate) || 0.7
      localStorage.setItem('payedUserShareRate', shareRate.toString())
    }
    if (uploadSpeed) {
      const limit = speedLimit(uploadSpeed)
      localStorage.setItem('uploadSpeed', limit.toString())
    }
    const shareRate = Number(localStorage.getItem('payedUserShareRate')) || 0.7
    const limit = parseInt(localStorage.getItem('uploadSpeed'))
    if (!isNaN(shareRate) && !isNaN(limit)) {
      if (limit === -1) client.throttleUpload(-1)
      else client.throttleUpload(limit, shareRate)
    }
    if (downloadSpeed) {
      const limit = speedLimit(downloadSpeed)
      client.throttleDownload(limit)
      localStorage.setItem('downloadSpeed', limit.toString())
    }
    if (maximumConnectionsNum) {
      client.maxConns = maximumConnectionsNum
      localStorage.setItem('maximumConnectionsNum', maximumConnectionsNum.toString())
    }
    let shouldRestart = false
    if (dhtPort && dhtPort !== parseInt(localStorage.getItem('dhtPort'))) {
      shouldRestart = true
      localStorage.setItem('dhtPort', dhtPort.toString())
    }
    if (torrentPort && torrentPort !== parseInt(localStorage.getItem('torrentPort'))) {
      shouldRestart = true
      localStorage.setItem('torrentPort', torrentPort.toString())
    }
    if (typeof secureOption === 'string') {
      localStorage.setItem('webtorrent-secure', secureOption)
      setSecure(secureOption)
      info('set secure', secureOption)
    }
    if (shouldRestart) {
      // process.exit(0)
      // process.exit makes devtools unaccessable, use reload instead
      location.reload()
    }
    // Preload config
    // `libraryPreload` may be `undefined` if user did not change it at this time
    if (libraryPreload === true) preloader.enable()
    else if (libraryPreload === false) preloader.disable()
    // `showPreload` may be `undefined` that should not update `sendPreloadTasks`
    if (showPreload === true) {
      sendPreloadTasks = true
      localStorage.setItem('send-preload-tasks', '1')
    } else if (showPreload === false) {
      sendPreloadTasks = false
      localStorage.setItem('send-preload-tasks', '0')
    }
  })
  ipcRenderer.on('reset-torrent', () => {
    info('reset')
    shouldSendInfo = false
    Promise.all(client.torrents.map(tr => new Promise(resolve => {
      tr.removeAllListeners()
      tr.destroy({ destroyStore: true }, resolve)
    })))
      .then(() => ipcRenderer.send('webtorrent-reset'))
      .catch(() => ipcRenderer.send('webtorrent-reset-error'))
      .finally(() => {
        info('resetted')
        client.torrents.length = 0
        shouldSendInfo = true
      })
  })
  ipcRenderer.on('add-tracker', (e, { infoHash, url }) => {
    info('add-tracker', infoHash, url)
    addTracker(infoHash, url)
  })
  ipcRenderer.on('remove-tracker', (e, { infoHash, url }) => {
    info('remove-tracker', infoHash, url)
    removeTracker(infoHash, url)
  })
  ipcRenderer.on('force-exit', () => process.exit(0))
  setInterval(() => {
    if (process.memoryUsage().rss / 1_000_000_000 > 3.5) {
      info('exit for memory reason')
      process.exit(0)
    }
  }, 60000)

  initClient(0)
  // ipcRenderer.send('webtorrent-initted')
  window.addEventListener('error', e => {
    info(e.message || e)
    // ipcRenderer.send('webtorrent-window-error', e.error && e.error.message || e.message)
    return true
  })
})()
