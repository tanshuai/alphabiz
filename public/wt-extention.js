const { EventEmitter } = require('events')
const { ipcRenderer } = require('electron')
const bencode = require('bencode')

/** @typedef { import('../src/types').Wire } Wire */

const payChunkSize = 10 * 1000 * 1000
const payPrice = 1
const payedMap = new Map()
const autoRenewMap = new Map()
const transactions = new Map()

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

const storedUser = localStorage.getItem('userInfo')
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
  console.log('set user', user)
  userInfo.user = user.user
  userInfo.sub = user.sub
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  client.torrents.forEach(tr => {
    tr.wires.forEach(wire => {
      if (wire._is_alphabiz_peer_ && wire.alphabiz_protocol) {
        wire.alphabiz_protocol._sendUserInfo()
      }
    })
  })
})
const onNewPayment = (e, info) => {
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
      if (!wire['alphabiz_protocol']) continue
      wire['alphabiz_protocol']._send({
        ab_payment: JSON.stringify({
          infoHash: info.infoHash,
          peerId: info.peerId,
          subId: userInfo.sub,
          payed: info.payed,
          autoRenew: info.autoRenew,
          id: info.id
        })
      })
    }
  }
}
ipcRenderer.on('payment-info', onNewPayment)
ipcRenderer.on('restart-payment', onNewPayment)
ipcRenderer.on('payment-verified', (e, info) => {
  const tr = client.get(info.infoHash)
  if (!tr || !tr.wires.length) return console.log('tr not found')
  for (const wire of tr.wires) {
    if (wire.remoteSub && wire.remoteSub === info.subId) {
      if (!wire['alphabiz_protocol']) continue
      wire['alphabiz_protocol']._onPaymentVerified({
        infoHash: info.infoHash,
        peerId: info.peerId,
        subId: userInfo.sub,
        payed: info.payed,
        autoRenew: info.autoRenew,
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
      if (!wire['alphabiz_protocol']) continue
      // info(wire)
      wire['alphabiz_protocol']._send({
        ab_payment_finish: info.transactionId
      })
      if (wire.transactions && wire.transactions.includes(info.transactionId)) {
        wire.transactions.splice(wire.transactions.indexOf(info.transactionId), 1)
      }
    }
  }
})
ipcRenderer.on('close-payment', (e, info) => {
  const tr = client.get(info.infoHash)
  if (!tr || !tr.wires.length) return console.log('close: tr not found')
  for (const wire of tr.wires) {
    if (wire.remoteSub && wire.remoteSub === info.remoteSub) {
      if (!wire['alphabiz_protocol']) continue
      wire['alphabiz_protocol']._send({
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
      this._peerId = null
      this._infoHash = null
      this.isSeeding = torrent.isSeeding
      this.download = torrent.download
      this.prevDownloaded = 0

      // alphabiz account info
      this._user = userInfo.user || ''
      this._subId = userInfo.sub || ''
      this.remoteSub = ''
      // for client usage
      this._wire._setThrottleGroup = level => this._setThrottleGroup(level)

      this._initUpload()
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
    _initUpload () {
      const wire = this._wire
      wire.on('upload', bytes => {
        if (!this.remoteSub) return
        const subId = this.remoteSub
        const left = payedMap.get(subId + this._infoHash) - bytes
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
            // this._send({
            //   ab_payment_completed: completed.id
            // })
          }
        }
        // notify renew if rest time is less then 5s
        const speed = wire.uploadSpeed ? wire.uploadSpeed() : 1_000_000
        if (autoRenewMap.get(subId) && left < 5 * speed) {
          // avoid multi renewing
          autoRenewMap.set(subId, false)
          this._send({ ab_renew: this._subId });
        }
        if (left <= 0) {
          this._setThrottleGroup('mid')
          payedMap.set(subId + this._infoHash, 0)
        } else {
          this._setThrottleGroup('high')
          payedMap.set(subId + this._infoHash, left)
        }
      })
      torrent.on('done', () => {
        if (!this._wire.transactions) return
        this._send({ ab_task_done: this._wire.transactions.join('$') })
      })
      // const sendByteMap = () => {
      //   // console.log('Change', torrent.byteMap)
      //   if (!torrent.byteMap) return
      //   this._send({ ab_byte_map: JSON.stringify(torrent.byteMap) })
      // }
      torrent.on('byte-map-change', () => this._sendByteMap())
    }
    _onAbPeer (peerId, user, subId) {
      if (!peerId.startsWith('_ab_')) return
      this._remotePeerId = peerId.substring(4)
      this._wire._is_alphabiz_peer_ = true
      this._wire.ab_peer = peerId
      this._wire.remoteUser = user
      this._wire.remoteSub = subId
      this._wire.transactions = []
      this.remoteSub = subId
      torrent._has_alphabiz_user_ = true
      torrent.emit('ab_peer', peerId)
      if (subId && payedMap.get(subId + this._infoHash) > 0) {
        // ipv4 and ipv6 wires are difference
        // add it again sharing same subId
        this._onPaymentVerified({
          infoHash: torrent.infoHash,
          subId,
          autoRenew: autoRenewMap.get(subId),
          payed: 0
        }, true)
      }
      else this._setThrottleGroup('mid')
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
                autoRenew: payment.autoRenew
              })
            })
            delayPaments.splice(i--, 1)
          }
        }
      }
      this._sendByteMap()
      // TODO:
      if (!this.isSeeding) {
        this._sendPubKey()
      }
    }
    // TODO:
    _onPubKey () { }
    _sendPubKey () { }
    _onAesKey () { }
    _sendAesKey () { }
    _setThrottleGroup (level) {
      const t = this._wire._uploadThrottle
      if (!t || !t._group) return // throw new Error('not_connected')
      if (!client.throttleGroups[level]) throw new Error('level_not_found')
      if (t._group === client.throttleGroups[level]) return { code: 0, message: 'success' }
      t._group._removeThrottle(t)
      client.throttleGroups[level]._addThrottle(t)
      t._group = client.throttleGroups[level]
      this._send({ ab_speed_group: level })
      return { code: 0, message: 'success' }
    }
    _onSpeedGroup (group) {
      this._wire.remoteGroup = group
    }
    _onPaymentReceived (payment) {
      console.log('receive')
      client.emit('verify-payment', payment)
    }
    _onPaymentVerified ({ infoHash, payed, autoRenew, id }) {
      console.log('verified')
      const subId = this.remoteSub
      if (!subId) return
      this._setThrottleGroup('high')
      if (transactions.has(id)) return
      const payedSize = payed * payChunkSize / payPrice
      transactions.set(id, { infoHash, payed, autoRenew, id, payedSize })
      if (infoHash !== torrent.infoHash) return
      if (isNaN(payedSize)) return
      if (!payedMap.has(subId + this._infoHash)) payedMap.set(subId + this._infoHash, 0)
      const prePayed = payedMap.get(subId + this._infoHash)
      autoRenewMap.set(subId, autoRenew)
      payedMap.set(subId + this._infoHash, prePayed + payedSize)
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
        const downloaded = this._wire.downloaded
        const delta = downloaded - this.prevDownloaded
        // this.prevDownloaded = downloaded
        if (delta > trans.payedSize * 0.9 || torrent.done) {
          ipcRenderer.send('webtorrent-payment-finished', {
            id,
            remoteSub: this.remoteSub,
            infoHash: this._infoHash
          })
          this.prevDownloaded += delta > trans.payedSize ? trans.payedSize : delta
          console.log(`Payment is finished. Payed for ${trans.payedSize}. Received ${delta}. Done: ${torrent.done}`)
        } else {
          this.prevDownloaded += delta
          console.log(`Payment is marked as not-finished. Payed for ${trans.payedSize}. Received ${delta}`)
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
    _onRenew (subId) {
      // dont renew if almost done
      if (torrent.length - torrent.downloaded < torrent.downloadSpeed * 5) return
      client.emit('request-renew', {
        infoHash: this._infoHash,
        peerId: this._remotePeerId,
        subId
      });
    }
    onMessage (buf) {
      let dict
      try {
        dict = bencode.decode(buf.toString())
      } catch (e) {
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
        console.log('Renew request', dict.ab_renew.toString())
        return this._onRenew(dict.ab_renew.toString())
      }
      if (dict.pubKey) {
        return this._onPubKey(dict)
      }
      if (dict.aesKey) {
        return this._onAesKey(dict)
      }
    }
    _send (dict) {
      const found = Object.entries(this._wire.extendedMapping)
        .find(i => i[1] === EXT_NAME)
      const id = found && found[0]
      if (!(id >= 0)) return
      this._wire.extended(Number(id), bencode.encode(dict))
    }
    // check recieved length when close
    // this may change to onData or other
    onClose () {
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