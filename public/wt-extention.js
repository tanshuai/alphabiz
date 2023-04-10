const { EventEmitter } = require('events')
const is = require('electron-is')
const { ipcRenderer } = is.renderer()
  ? require('electron')
  : require('../src/api/server')
const bencode = require('bencode')

/** @typedef { import('../src/types').Wire } Wire */

const payChunkSize = 10 * 1000 * 1000
const payPrice = 1
const payedMap = new Map()
const autoRenewMap = new Map()
const transactions = new Map()
const peerDownloaded = new Map()
const totalDownloaded = new Map()
const samePeerWires = new Map()

const nonAbDownloaded = new Map()
const payedNonAb = new Map()
// window.nonAbDownloaded = nonAbDownloaded
const addNonAbDownloaded = (infoHash, bytes) => {
  if (!nonAbDownloaded.has(infoHash)) nonAbDownloaded.set(infoHash, 0)
  if (!payedNonAb.has(infoHash)) payedNonAb.set(infoHash, 0)
  const total = nonAbDownloaded.get(infoHash) + bytes
  nonAbDownloaded.set(infoHash, total)
  // Pay once per 100MB
  const counts = Math.floor(total / 100_000_000)
  const delta = counts - payedNonAb.get(infoHash)
  if (delta > 0) {
    // Should send new payment
    console.log('Request provident payment for', infoHash, 'count:', delta)
    ipcRenderer.send('request-provident-payment', { infoHash, count: delta * 10 })
    payedNonAb.set(infoHash, counts)
  }
}

// this is helpful for reuse payments after torrent restart
const delayPaments = []
// window.delayPaments = delayPaments

/**
 * @type { Map<string, {
 *  infoHash: string,
 *  subId: string,
 *  payedSize: number,
 *  id: string,
 *  startPosition: number
 * }[]> }
 */
const transactionMap = new Map()
// window.payedMap = payedMap

const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('userInfo') : null
const userInfo = storedUser ? JSON.parse(storedUser) : {
  user: '',
  sub: ''
}
console.log('Init user', userInfo)

let client = null
export const useClientEvents = (_client) => {
  client = _client
  client.userInfo = userInfo
  client.on('request-renew', info => ipcRenderer.send('webtorrent-request-renew', info))
  client.on('verify-payment', info => ipcRenderer.send('webtorrent-verify-payment', info))
}
ipcRenderer.on('set-user', (e, user) => {
  if (!user) user = e
  console.log('set user', user)
  userInfo.user = user.user
  userInfo.sub = user.sub
  if (typeof localStorage !== 'undefined') localStorage.setItem('userInfo', JSON.stringify(userInfo))
  client.torrents.forEach(tr => {
    tr.wires.forEach(wire => {
      if (wire._is_alphabiz_peer_ && wire.alphabiz_protocol) {
        wire.alphabiz_protocol._sendUserInfo()
      }
    })
  })
})
const onNewPayment = (e, info) => {
  if (!info) info = e
  console.log('Payment info', info)
  const tr = client.get(info.infoHash)
  info.payedSize = info.payed * payChunkSize / payPrice
  transactions.set(info.id, info)
  if (!tr || !tr.wires.length) {
    if (delayPaments.some(i => i.id === info.id)) return
    return delayPaments.push(info)
  }
  for (const wire of tr.wires) {
    if (wire.remoteSub && wire.remoteSub === info.remoteSubId) {
      if (!wire.alphabiz_protocol) continue
      wire.alphabiz_protocol._send({
        ab_payment: JSON.stringify({
          infoHash: info.infoHash,
          peerId: info.peerId,
          subId: userInfo.sub,
          payed: info.payed,
          autoRenew: true,
          id: info.id
        })
      })
    }
  }
}
ipcRenderer.on('payment-info', onNewPayment)
ipcRenderer.on('restart-payment', onNewPayment)
ipcRenderer.on('payment-verified', (e, info) => {
  if (!info) info = e
  const tr = client.get(info.infoHash)
  if (!tr || !tr.wires.length) return console.log('tr not found')
  for (const wire of tr.wires) {
    if (wire.remoteSub && wire.remoteSub === info.subId) {
      if (!wire.alphabiz_protocol) continue
      wire.alphabiz_protocol._onPaymentVerified({
        infoHash: info.infoHash,
        peerId: info.peerId,
        subId: userInfo.sub,
        payed: info.payed,
        autoRenew: true,
        id: info.id
      })
    }
  }
})
ipcRenderer.on('finish-payment', (e, info) => {
  const tr = client.get(info.infoHash)
  if (!tr || !tr.wires.length) return console.log('finish: tr not found')
  for (const wire of tr.wires) {
    if (wire.remoteSub && wire.remoteSub === info.remoteSub) {
      if (!wire.alphabiz_protocol) continue
      // info(wire)
      wire.alphabiz_protocol._send({
        ab_payment_finish: info.transactionId
      })
      if (wire.transactions && wire.transactions.includes(info.transactionId)) {
        wire.transactions.splice(wire.transactions.indexOf(info.transactionId), 1)
      }
    }
  }
})
ipcRenderer.on('close-payment', (e, info) => {
  if (!info) info = e
  const tr = client.get(info.infoHash)
  if (!tr || !tr.wires.length) return console.log('close: tr not found')
  for (const wire of tr.wires) {
    if (wire.remoteSub && wire.remoteSub === info.remoteSub) {
      if (!wire.alphabiz_protocol) continue
      wire.alphabiz_protocol._send({
        ab_payment_close: JSON.stringify({
          infoHash: info.infoHash,
          id: info.id
        })
      })
    }
  }
})
const removeTransaction = info => {
  console.log('To remove', info)
  if (!info || !info.infoHash) return
  const infoHash = info.infoHash
  const transactions = transactionMap.get(infoHash)
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id === info.id) {
      const removed = transactions.splice(i, 1)
      console.log('Removed transaction', removed)
      return
    }
  }
}

/**
 * @function useAlphabizProtocol
 * @param { import('webtorrent') } client
 * @param { import('webtorrent/lib/torrent') } torrent
 * @returns
 */
export const useAlphabizProtocol = (client, torrent) => {
  const EXT_NAME = 'alphabiz_protocol'
  class AlphabizProto extends EventEmitter {
    constructor (wire) {
      super()
      /** @type { Wire } */
      this._wire = wire
      /**
       * The `_peerId` is the id of REMOTE peer, while the `_remotePeerId`
       * is in fact the LOCAL peer. This was caused by some mistakes.
       */
      this._peerId = null
      this._infoHash = torrent.infoHash
      this.isSeeding = torrent.isSeeding
      this.download = torrent.download

      // alphabiz account info
      this._user = userInfo.user || ''
      this._subId = userInfo.sub || ''
      this.remoteSub = ''
      // Unique for every user for different torrents, but same for different wires
      this.uniqueId = ''
      // for client usage
      this._wire._setThrottleGroup = level => this._setThrottleGroup(level)
      this.maxUploadSpeed = 1_000_000
      this._wire.maxUploadSpeed = 1_000_000

      this._initUpload()
      this._initDownload()
    }

    onHandshake (infoHash, peerId) {
      this._infoHash = infoHash
      this._peerId = peerId
      this._sendUserInfo()
    }

    _sendUserInfo () {
      this._user = userInfo.user || ''
      this._subId = userInfo.sub || ''
      this._send({
        ab_peer: '_ab_' + this._peerId,
        ab_user: this._user,
        ab_sub: this._subId,
        ab_has_meta: torrent.metadata ? 1 : 0
      })
      if (!torrent.metadata) {
        torrent.once('metadata', () => {
          this._send({ ab_has_meta: 1 })
        })
      }
    }

    onExtendedHandshake (handshake) {
      if (!handshake.m || !handshake.m[EXT_NAME]) {
        console.error('Client does not support', EXT_NAME)
      }
    }

    _sendByteMap () {
      // console.log('Change', torrent.byteMap)
      if (!torrent.byteMap) return
      this._send({ ab_byte_map: JSON.stringify(torrent.byteMap) })
    }

    _initDownload () {
      const wire = this._wire
      const onDownload = bytes => {
        /**
         * Randomly check memory usage.
         * This handler is called very frequently, 0.99 may even not large
         * enough for us.
         */
        if (Math.random() > 0.99) {
          // Trigger a crash to main process if current memory > 3GB
          if (process.memoryUsage().rss / 1000_000_000 > 3) process.exit(1)
        }
        // Only apply with download task
        if (this.isSeeding) return
        if (!this.remoteSub || !this.uniqueId) {
          addNonAbDownloaded(this._infoHash, bytes)
          return
        }
        // Count downloaded bytes
        if (!totalDownloaded.get(this.uniqueId)) {
          totalDownloaded.set(this.uniqueId, wire.downloaded || 0)
        }
        const prev = totalDownloaded.get(this.uniqueId)
        totalDownloaded.set(this.uniqueId, prev + bytes)
      }
      wire.on('download', onDownload)
    }

    _initUpload () {
      const wire = this._wire
      const onUpload = bytes => {
        if (!this.remoteSub || !this.uniqueId) return
        if (this.remoteSub === this._subId) return
        // const subId = this.remoteSub
        const left = payedMap.get(this.uniqueId) - bytes
        if (isNaN(left)) return
        const trans = transactionMap.get(this._infoHash)
        if (trans && trans.length) {
          trans[0].payedSize -= bytes
          if (trans[0].payedSize < 0) {
            const completed = trans.shift()
            // if (trans[0]) trans[0].payedSize += completed.payedSize
            ipcRenderer.send('webtorrent-payment-completed', {
              transactionId: completed.id,
              infoHash: this._infoHash,
              remoteSub: this.remoteSub
            })
          }
        }
        // notify renew if rest time is less than 5s
        const speed = wire.uploadSpeed ? wire.uploadSpeed() : 1_000_000
        if (speed > this.maxUploadSpeed) {
          // Set max speed
          this.maxUploadSpeed = Math.ceil(speed / 1_000_000) * 1_000_000
          this._wire.maxUploadSpeed = this.maxUploadSpeed
        }
        const sameWires = samePeerWires.get(this.uniqueId) || []
        const totalMaxSpeed = sameWires.reduce((pre, cur) => {
          return pre + (cur.maxUploadSpeed || 1_000_000)
        }, 0) || this.maxUploadSpeed
        if (autoRenewMap.get(this.uniqueId) && left < 5 * totalMaxSpeed) {
          // avoid multi renewing
          autoRenewMap.set(this.uniqueId, false)
          const count = Math.ceil(totalMaxSpeed / 1_000_000)
          console.log('[[wt-ext]] _send ab_renew left < 5*speed', count)
          // this._send({
          //   ab_renew: this._subId,
          //   ab_count: count < 10 ? 10 : count
          // })
          this.renew(count < 10 ? 10 : count)
        }
        if (left <= 0) {
          // console.log('[[wt-ext]] _setThrottleGroup(mid)')
          this._setThrottleGroup('mid')
          payedMap.set(this.uniqueId, 0)
          if (autoRenewMap.get(this.uniqueId) || !autoRenewMap.has(this.uniqueId)) {
            const count = Math.ceil(totalMaxSpeed / 1_000_000)
            autoRenewMap.set(this.uniqueId, false)
            console.log('[[wt-ext]] _send ab_renew from left<=0', count)
            // this._send({
            //   ab_renew: this._subId,
            //   ab_count: count < 10 ? 10 : count
            // })
            this.renew(count < 10 ? 10 : count)
          }
        } else {
          this._setThrottleGroup('high')
          payedMap.set(this.uniqueId, left)
        }
      }
      wire.on('upload', onUpload)
      const onDone = () => {
        if (!this._wire.transactions) return
        ipcRenderer.send('webtorrent-task-done', {
          infoHash: torrent.infoHash,
          name: torrent.name,
          payments: this._wire.transactions
        })
        this._send({ ab_task_done: this._wire.transactions.join('$') })
      }
      const onByteMapChange = () => this._sendByteMap()
      wire.on('close', () => {
        torrent.off('done', onDone)
        torrent.off('byte-map-change', onByteMapChange)
        const wires = samePeerWires.get(this.uniqueId)
        if (wires && wires.includes(wire)) {
          console.log('remove same wire')
          wires.splice(wires.indexOf(wire), 1)
        }
      })
      torrent.on('done', onDone)
      torrent.on('byte-map-change', onByteMapChange)
    }

    _onAbPeer (peerId, user, subId) {
      // console.log('onAbPeer', peerId, user, subId)
      if (!peerId.startsWith('_ab_')) return
      this._remotePeerId = peerId.substring(4)
      this._wire._is_alphabiz_peer_ = true
      this._wire.ab_peer = peerId
      this._wire.remoteUser = user
      this._wire.remoteSub = subId
      this._wire.transactions = []
      this.remoteSub = subId
      this.uniqueId = subId + '#' + this._infoHash
      // const removeSame = () => {
      //   if (!samePeerWires.has(this.uniqueId)) return
      //   const wires = samePeerWires.get(this.uniqueId)
      //   const index = wires.findIndex(w => w === this._wire)
      //   if (index !== -1) wires.splice(index, 1)
      // }
      if (!samePeerWires.has(this.uniqueId)) {
        samePeerWires.set(this.uniqueId, [this._wire])
        // this._wire.on('close', removeSame)
      } else {
        const wires = samePeerWires.get(this.uniqueId)
        if (!wires.includes(this._wire)) {
          wires.push(this._wire)
          // this._wire.on('close', removeSame)
        }
      }
      if (!peerDownloaded.has(this.uniqueId)) peerDownloaded.set(this.uniqueId, 0)
      // If wire disconnected, the `downloaded` will be reset
      if (peerDownloaded.get(this.uniqueId) > this._wire.downloaded) {
        peerDownloaded.set(this.uniqueId, this._wire.downloaded)
      }
      torrent._has_alphabiz_user_ = true
      torrent.emit('ab_peer', peerId)
      if (this._subId === this.remoteSub) {
        console.log('[wt-ab-peer] Connected to self')
        this._sendByteMap()
        this._setThrottleGroup('high')
        return
      }
      if (subId && payedMap.get(this.uniqueId) > 0) {
        // ipv4 and ipv6 wires are difference
        // add it again sharing same subId
        this._onPaymentVerified({
          infoHash: torrent.infoHash,
          subId,
          autoRenew: true,
          payed: 0
        }, true)
      } else {
        // console.log('[[wt-ext]] _setThrottleGroup(mid) from 294')
        this._setThrottleGroup('mid')
        if (this.isSeeding && !payedMap.get(this.uniqueId)) {
          this._sendByteMap()
          setTimeout(() => {
            // this._send({
            //   ab_renew: this._subId,
            //   count: 10
            // })
            this.renew()
          }, 1000)
        }
      }
      if (delayPaments.length) {
        for (let i = 0; i < delayPaments.length; i++) {
          const payment = delayPaments[i]
          if (payment.infoHash === this._infoHash && payment.remoteSubId === this.remoteSub) {
            this._send({
              ab_payment: JSON.stringify({
                infoHash: payment.infoHash,
                subId: userInfo.sub,
                payed: payment.payed,
                id: payment.id,
                autoRenew: true
              })
            })
            delayPaments.splice(i--, 1)
          }
        }
      }
      this._sendByteMap()
      // Wait for main process ready
      const interval = setInterval(() => {
        if (!this._wire || this._wire.destroyed) {
          clearInterval(interval)
        }
        if (this.isSeeding) return
        // Pay if currently not accelerating
        if (this._wire.remoteGroup === 'mid' && !this.isSeeding) {
          this._onRenew(this.remoteSub, 10)
        }
      }, 5000)
    }

    renew (ab_count = 10) {
      if (this._subId === this.remoteSub) {
        console.log('[wt-renew] Remote account is same as local')
        return
      }
      this._send({
        ab_renew: this._subId,
        ab_count
      })
    }

    _setThrottleGroup (level) {
      const t = this._wire._uploadThrottle
      if (!t || !t._group) return // throw new Error('not_connected')
      if (!client.throttleGroups[level]) throw new Error('level_not_found')
      // Removed return object since we don't need this
      if (t._group === client.throttleGroups[level]) return
      console.log('[[wt-ext]] _setThrottleGroup', level)
      autoRenewMap.set(this.uniqueId, true)
      if (level === 'mid' && t._group === client.throttleGroups.high) {
        console.log('Peer dropped back to mid. Send renew request', this._subId, this._infoHash)
        this.renew()
        // Speed is down to middle. Check accel continues after seconds
        setTimeout(() => {
          if (t._group !== client.throttleGroups.high) {
            // renew
            console.log('Peer is still in mid. Send renew request', this._subId, this._infoHash)
            this.renew()
          }
        }, 5000)
      }
      t._group._removeThrottle(t)
      client.throttleGroups[level]._addThrottle(t)
      t._group = client.throttleGroups[level]
      console.log('[[wt-ext]] _send ab_speed_group: ', level)
      this._send({ ab_speed_group: level })
    }

    _onSpeedGroup (group) {
      console.log('[[wt-ext]] _onSpeedGroup', group)
      this._wire.remoteGroup = group
    }

    _onPaymentReceived (payment) {
      client.emit('verify-payment', payment)
    }

    _onPaymentVerified ({ infoHash, payed, id }) {
      const subId = this.remoteSub
      console.log('payment verified')
      if (!subId || !this.uniqueId) return
      this._setThrottleGroup('high')
      autoRenewMap.set(this.uniqueId, true)
      if (!id || transactions.has(id)) return
      const payedSize = payed * payChunkSize / payPrice
      transactions.set(id, { infoHash, payed, autoRenew: true, id, payedSize })
      if (infoHash !== torrent.infoHash) return
      if (isNaN(payedSize)) return
      if (!payedMap.has(this.uniqueId)) payedMap.set(this.uniqueId, 0)
      const prePayed = payedMap.get(this.uniqueId)
      payedMap.set(this.uniqueId, prePayed + payedSize)
      if (!transactionMap.has(infoHash)) transactionMap.set(infoHash, [])
      const trans = transactionMap.get(infoHash)
      trans.push({
        infoHash,
        subId,
        payedSize,
        id,
        startPosition: this._wire.recieved
      })
      this._send({ ab_payment_accepted: id })
    }

    _onPaymentAccepted (id) {
      this._wire.transactions.push(id)
    }

    _onPaymentCompleted (id) {
      console.log('Completed', id, this.remoteSub)
      ipcRenderer.send('webtorrent-payment-completed', {
        transactionId: id,
        remoteSub: this.remoteSub,
        infoHash: this._infoHash
      })
      if (this._wire.transactions.includes(id)) {
        this._wire.transactions.splice(this._wire.transactions.indexOf(id), 1)
      }
    }

    _onTaskDone (data) {
      const trans = data.split('$').filter(i => i.length)
      console.log('Remote task done')
      if (trans.length) {
        for (const id of trans) {
          this._onPaymentCompleted(id)
        }
      }
      payedMap.delete(this.remoteSub, this._infoHash)
    }

    _onPaymentFinished (id) {
      console.log('Finished', id)
      const trans = transactions.get(id)
      if (trans) {
        const downloaded = totalDownloaded.get(this.uniqueId) || 0
        if (!peerDownloaded.has(this.uniqueId)) {
          peerDownloaded.set(this.uniqueId, 0)
        }
        const prev = peerDownloaded.get(this.uniqueId)
        const delta = downloaded - prev
        if (delta > trans.payedSize * 0.9 || torrent.done || torrent.downloaded >= torrent.length * 0.9) {
          ipcRenderer.send('webtorrent-payment-finished', {
            id,
            remoteSub: this.remoteSub,
            infoHash: this._infoHash
          })
          peerDownloaded.set(this.uniqueId, prev + (delta > trans.payedSize ? trans.payedSize : delta))
          console.log(`Payment ${id} is finished. Payed for ${trans.payedSize}. Received ${delta}. Done: ${torrent.done}`)
          console.log('Update prev-download', prev, peerDownloaded.get(this.uniqueId))
        } else {
          console.log(`Payment ${id} is marked as not-finished. Payed for ${trans.payedSize}. Received ${delta}`)
          console.log(`Prev: ${prev}. Downloaded: ${downloaded}`)
        }
      } else {
        ipcRenderer.send('webtorrent-payment-finished', {
          id,
          remoteSub: this.remoteSub,
          infoHash: this._infoHash
        })
      }
    }

    _onPaymentClosed (info) {
      console.log('Close', info)
      removeTransaction(info)
    }

    _onRenew (subId, count = 10) {
      // dont renew if almost done
      // if (torrent.length - torrent.downloaded < torrent.downloadSpeed * 5) return
      const payCount = count && parseInt(count) ? parseInt(count) : 10

      console.log('[[wt-ext]] _onRenew', subId, this._remotePeerId, payCount)
      client.emit('request-renew', {
        infoHash: this._infoHash,
        peerId: this._remotePeerId,
        payCount,
        subId
      })
    }

    onMessage (buf) {
      let dict
      try {
        dict = bencode.decode(buf)
        // console.log('onmsg', dict)
      } catch (e) {
        console.error('cannot decode buf', buf)
        return
      }
      if (dict.ab_has_meta) {
        this._wire.remote_has_meta = true
      }
      if (dict.ab_byte_map) {
        this._wire.remote_byte_map = JSON.parse(dict.ab_byte_map.toString())
      }
      if (dict.ab_peer) {
        return this._onAbPeer(dict.ab_peer.toString(), dict.ab_user && dict.ab_user.toString(), dict.ab_sub && dict.ab_sub.toString())
      }
      if (dict.ab_speed_group) {
        return this._onSpeedGroup(dict.ab_speed_group.toString())
      }
      if (dict.ab_payment) {
        const payment = JSON.parse(dict.ab_payment.toString())
        console.log('Protocol payment', payment)
        return this._onPaymentReceived(payment)
      }
      if (dict.ab_payment_completed) {
        // check if finished
        return this._onPaymentCompleted(dict.ab_payment_completed.toString())
      }
      if (dict.ab_payment_accepted) {
        return this._onPaymentAccepted(dict.ab_payment_accepted.toString())
      }
      if (dict.ab_payment_finish) {
        // finish payment
        return this._onPaymentFinished(dict.ab_payment_finish.toString())
      }
      if (dict.ab_payment_close) {
        return this._onPaymentClosed(JSON.parse(dict.ab_payment_close.toString()))
      }
      if (dict.ab_task_done) {
        return this._onTaskDone(dict.ab_task_done.toString())
      }
      if (dict.ab_renew) {
        return this._onRenew(dict.ab_renew.toString(), dict.ab_count?.toString())
      }
    }

    _send (dict) {
      // console.log('send', dict, bencode.encode(dict))
      const found = Object.entries(this._wire.extendedMapping)
        .find(i => i[1] === EXT_NAME)
      const id = found && found[0]
      if (!(id >= 0)) return
      this._wire.extended(Number(id), bencode.encode(dict))
    }

    // check recieved length when close
    // this may change to onData or other
    onClose () {
      console.log('onClose', this._wire)
      const recieved = this._wire.recieved
      // 10 mb
      if (recieved > 1000 * 1000 * 10) {
        // confirmPayment()
      }
    }
  }
  AlphabizProto.prototype.name = EXT_NAME
  return AlphabizProto
}
