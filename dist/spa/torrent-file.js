(() => {
  'use strict'

  const crypto = require('crypto')
  const fs = require('fs')
  const path = require('path')

  const INFO_HASH_PATTERN = /^(?:[a-f\d]{40}|[a-f\d]{64})$/i

  function writeUniqueSibling (filePath, contents) {
    const parsedPath = path.parse(filePath)
    for (let attempt = 0; attempt < 10; attempt++) {
      const suffix = crypto.randomBytes(8).toString('hex')
      const candidate = path.join(
        parsedPath.dir,
        `${parsedPath.name}.${suffix}${parsedPath.ext}`
      )
      try {
        fs.writeFileSync(candidate, contents, { flag: 'wx', mode: 0o600 })
        return candidate
      } catch (error) {
        if (error.code !== 'EEXIST') throw error
      }
    }
    throw new Error('Unable to create a unique torrent file')
  }

  function writeFileOnce (filePath, torrentFile) {
    const contents = Buffer.from(torrentFile)
    try {
      fs.writeFileSync(filePath, contents, { flag: 'wx', mode: 0o600 })
    } catch (error) {
      if (error.code !== 'EEXIST') throw error

      let existingFd
      try {
        const noFollow = fs.constants.O_NOFOLLOW
        if (!noFollow) {
          return writeUniqueSibling(filePath, contents)
        }
        existingFd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow)
        if (!fs.fstatSync(existingFd).isFile()) {
          throw new Error(`Refusing to use a non-regular torrent file: ${filePath}`)
        }
        if (!fs.readFileSync(existingFd).equals(contents)) {
          throw new Error(`Refusing to replace a different torrent file: ${filePath}`)
        }
      } finally {
        if (existingFd !== undefined) fs.closeSync(existingFd)
      }
    }
    return filePath
  }

  function prepareDirectory (directory) {
    const resolvedDirectory = path.resolve(directory)
    fs.mkdirSync(resolvedDirectory, { recursive: true, mode: 0o700 })
    const realDirectory = fs.realpathSync(resolvedDirectory)
    if (!fs.statSync(realDirectory).isDirectory()) {
      throw new Error(`Expected a torrent directory: ${resolvedDirectory}`)
    }
    return realDirectory
  }

  function saveTorrentByInfoHash (directory, infoHash, torrentFile) {
    const normalizedInfoHash = String(infoHash).toLowerCase()
    if (!INFO_HASH_PATTERN.test(normalizedInfoHash)) {
      throw new Error('Invalid torrent info hash')
    }
    const resolvedDirectory = prepareDirectory(directory)
    return writeFileOnce(
      path.join(resolvedDirectory, `${normalizedInfoHash}.torrent`),
      torrentFile
    )
  }

  function sanitizeTorrentName (name) {
    let safeName = String(name)
      .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, '_')
      .replace(/^\.+/, '_')
      .replace(/[. ]+$/g, '')
    if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(safeName)) {
      safeName = `_${safeName}`
    }
    let byteLength = 0
    let truncatedName = ''
    for (const character of safeName) {
      const characterBytes = Buffer.byteLength(character, 'utf-8')
      if (byteLength + characterBytes > 200) break
      byteLength += characterBytes
      truncatedName += character
    }
    safeName = truncatedName.replace(/[. ]+$/g, '')
    if (!safeName) throw new Error('Invalid torrent name')
    return safeName
  }

  function saveTorrentByName (directory, name, torrentFile) {
    const resolvedDirectory = prepareDirectory(directory)
    const torrentPath = path.resolve(
      resolvedDirectory,
      `${sanitizeTorrentName(name)}.torrent`
    )
    if (path.dirname(torrentPath) !== resolvedDirectory) {
      throw new Error('Invalid torrent path')
    }
    return writeFileOnce(torrentPath, torrentFile)
  }

  Object.defineProperty(globalThis, 'alphabizTorrentFile', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Object.freeze({
      INFO_HASH_PATTERN,
      sanitizeTorrentName,
      saveTorrentByInfoHash,
      saveTorrentByName
    })
  })
})()
