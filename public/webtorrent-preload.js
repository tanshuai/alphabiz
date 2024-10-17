const { ipcRenderer } = require('electron')
const { existsSync, writeFileSync, readFileSync, mkdirSync, cpSync, statSync, rmSync } = require('fs')
const { resolve, dirname } = require('path')
const WebTorrent = require('webtorrent')
import utils from './webtorrent-utils.js'
const { torrentToJson } = utils

/**
 * @typedef { import('webtorrent/lib/torrent') } Torrent
 */

// Currently up to download 30MB for a task
const downloadThreshold = 30_000_000
// Wait a torrent for 10 mins to ready
const maxWaitTime = 60_000
// Only allow downloading `maxTask` tasks at same time
const maxTask = 5

// If tasks count is larger than this, remove oldest task from disk
// Set to 0 and call `removeOldIfNeeded` will remove all preload tasks
let maxPreload = 20
// Load config from local storage when launched
if (typeof localStorage.getItem('library-max-preload') === 'string') {
  const n = Number(localStorage.getItem('library-max-preload'))
  if (!isNaN(n)) maxPreload = n
}
// Store path
let storePath = ''
const preloadClient = new WebTorrent({
  maxConns: 5,
  downloadLimit: 3000_000,
  uploadLimit: 300_000
})

/**
 * @typedef PreloadTask
 * @property { string } torrentPath
 * @property { string } downloadPath
 * @property { string } origin
 * @property { Torrent } torrent
 */
/** @type { Map<string, PreloadTask> } a map of all added tasks */
const preloadTasks = new Map()
/** @type { { url: string, path: string, origin: string, postTitle: string, torrent: Torrent }[] } a queue of current downloading urls */
const taskQueue = []
/** @type { { url: string, path: string, origin: string, postTitle: string }[] } */
const previous = []
/** @type { { url: string, path: string, origin: string, postTitle: string, torrent: Torrent }[] } a queue of current downloading urls */
const failures = []

// For debug
global.preload = {
  client: preloadClient,
  tasks: preloadTasks,
  queue: taskQueue
}
// Save preloaded tasks
const saveTasks = () => {
  if (!storePath) return
  if (!existsSync(dirname(storePath))) mkdirSync(dirname(storePath), { recursive: true })
  const tasks = []
  for (const [url, task] of preloadTasks.entries()) {
    tasks.push({
      url,
      ...task
    })
  }
  writeFileSync(storePath, JSON.stringify(tasks, null, 2))
}
const removeOldIfNeeded = () => {
  if (!storePath) return
  let overStack = preloadTasks.size - maxPreload
  if (overStack <= 0) return
  // Use [...entries] to avoid errors when we delete entry from map
  for (const [url, task] of [...preloadTasks.entries()]) {
    preloadTasks.delete(url)
    ;[task.torrentPath, task.downloadPath].forEach(p => {
      if (typeof p === 'string' && existsSync(p)) rmSync(p, { recursive: true })
    })
    console.log('[Preload] Remove old task', url)
    overStack--
    // Save result
    if (overStack <= 0) return saveTasks()
  }
}


/**
 * @function queueTask
 * @param { object } conf
 * @param { string } conf.url magnet url
 * @param { string } conf.path preload directory
 * @param { string } conf.origin origin alphabiz-url
 * @param { string } conf.postTitle post title
 * @returns { Torrent }
 */
const queueTask = ({ url, path, origin, postTitle }) => {
  if (maxPreload <= 0) return
  if (taskQueue.find(i => i.url === url)) return console.log('[Preload] Skip existed', url)
  if (taskQueue.length >= maxTask) {
    // Destroy oldest one
    const task = taskQueue.shift()
    if (task) {
      const { url, path, origin, postTitle, torrent } = task
      console.log('[Preload] Remove first old task from queue', url)
      /**
       * If torrent is not ready, all downloaded pieces are not able to be reused.
       * So we have to remove them all for saving disk space.
       */
      if (!preloadTasks.has(url)) {
        torrent.destroy({ destroyStore: true }, () => {
          // If anyone of other tasks is completed, we can try restore old tasks from here
          previous.push({ url, path, origin, postTitle })
        })
      } else {
        torrent.destroy(() => {})
      }
    }
  }
  let destroying = false
  const torrent = preloadClient.add(url, {
    path,
    storeOpts: {
      postTitle: postTitle || ''
    },
    postTitle,
    strategy: 'sequential'
  })
  taskQueue.push({ url, path, origin, postTitle, torrent })
  const timer = setTimeout(() => {
    if (!torrent.ready && !torrent.destroyed) {
      console.log('[Preload] Failed to load task', origin)
      // The origin ab-url is used to disable download-and-play button in main process
      ipcRenderer.send('preload-failed', origin)
      // Torrent is still pending after a long time. Remove it
      torrent.destroy(() => {
        const index = taskQueue.findIndex(i => i.url === url)
        if (index !== -1) {
          const [task] = taskQueue.splice(index, 1)
          if (!failures.find(f => f.origin === task.origin)) failures.push(task)
        }
      })
    }
  }, maxWaitTime)
  torrent.on('ready', () => {
    clearTimeout(timer)
    if (!torrent.torrentFile || !torrent.infoHash) return
    const torrentPath = resolve(dirname(path), `../torrents/${torrent.infoHash}.torrent`)
    if (!existsSync(dirname(torrentPath))) mkdirSync(dirname(torrentPath), { recursive: true })
    if (!existsSync(torrentPath)) {
      writeFileSync(torrentPath, torrent.torrentFile)
    }
    if (!preloadTasks.has(url)) {
      preloadTasks.set(url, {
        downloadPath: path,
        torrentPath,
        origin,
        torrent: Object.assign(
          torrentToJson(torrent),
          /**
           * Preload status
           * (0) - not a preload task
           * 1 - downloading
           * 2 - downloaded
           */
          { preloadStatus: 1 }
        )
      })
      saveTasks()
    }
  })
  torrent.on('download', () => {
    if (destroying) return
    // Avoid trigger twice
    if (torrent.downloaded > downloadThreshold) {
      destroying = true
      torrent.destroy(() => {
        console.log('[Preload] Finish preloading', origin)
        removeOldIfNeeded()
        ipcRenderer.emit('preload-done', origin)
        const index = taskQueue.findIndex(i => i.url === url)
        const old = preloadTasks.get(url)
        if (old) {
          // Only update preload status after downloaded
          old.torrent = Object.assign(
            torrentToJson(torrent),
            { preloadStatus: 2 }
          )
          saveTasks()
        }
        if (index !== -1) {
          taskQueue.splice(index, 1)
          if (taskQueue.length < maxTask && previous.length) {
            const { url, path, origin, postTitle } = previous.shift()
            queueTask({ url, path, origin, postTitle })
          }
        }
      })
    }
  })
  return torrent
}

// Restore saved tasks after relaunch
ipcRenderer.on('preload-restore', (e, path) => {
  console.log('[Preload] Restore', path)
  try {
    const p = resolve(path, 'preload-tasks.json')
    const now = new Date()
    now.setDate(now.getDate() - 7)
    const oneWeekAgo = now.valueOf()
    if (existsSync(p)) {
      const tasks = JSON.parse(readFileSync(p))
      for (const task of tasks) {
        if (!existsSync(task.torrentPath) || !existsSync(task.downloadPath)) {
          if (existsSync(task.torrentPath)) rmSync(task.torrentPath)
          if (existsSync(task.downloadPath)) rmSync(task.downloadPath, { recursive: true })
          continue
        }
        if (task.removed) continue
        const { mtimeMs } = statSync(task.torrentPath)
        // Remove old caches
        if (mtimeMs < oneWeekAgo) {
          rmSync(task.torrentPath)
          if (existsSync(task.downloadPath)) rmSync(task.downloadPath, { recursive: true })
          continue
        }
        if (task.torrent && task.torrent.downloaded < downloadThreshold) {
          // This task was not loaded before
          queueTask({
            url: task.url,
            origin: task.origin,
            path: task.downloadPath,
            postTitle: task.torrent.postTitle || task.torrent.name
          })
          console.log('[Preload] Restart', task.url)
        } else {
          console.log('[Preload] Restore', task.url)
          preloadTasks.set(task.url, task)
        }
      }
      console.log(`[Preload] Restore ${tasks.length} tasks`)
    }
    storePath = p
  } catch (e) {
    console.log(`Failed to load preloads from ${path}`, e)
  }
})
ipcRenderer.on('preload-task', (e, { url, path, origin, postTitle }) => {
  if (!preloadTasks.has(url)) {
    console.log('[Preload] Receive task', { url, path, origin, postTitle })
    queueTask({ url, path, origin, postTitle })
  }
})

export default {
  /**
   * @function loadCache
   * @param { string } url Torrent url to download
   * @param { string } downloadDirectory Directory to save downloaded pieces
   * @returns { string|null } Preloaded torrent file path
   */
  loadCache (url, downloadDirectory) {
    if (preloadTasks.has(url)) {
      // Copy preloaded files to `downloadDirectory` and return the preloaded torrent file
      const { torrentPath, downloadPath, removed } = preloadTasks.get(url)
      if (removed) {
        console.log('Preload task is removed!')
        return torrentPath
      }
      console.log('copy', downloadPath, downloadDirectory)
      cpSync(downloadPath, downloadDirectory, { recursive: true })
      // Remove preloaded task as it is added
      setTimeout(() => {
        rmSync(downloadPath, { recursive: true })
        preloadTasks.set(url, { torrentPath, removed: true })
      }, 5000)
      return torrentPath
    }
    return null
  },
  enable () {
    maxPreload = 40
    localStorage.setItem('library-max-preload', '40')
  },
  disable () {
    maxPreload = 0
    localStorage.setItem('library-max-preload', '0')
    // Remove added tasks
    removeOldIfNeeded()
    taskQueue.splice(0)
    preloadTasks.clear()
  },
  // Main module sends data to render process from this map
  preloadTasks,
  taskQueue,
  failures
}
