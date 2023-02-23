const { createHash } = require('crypto')
const { existsSync, createReadStream } = require('fs')

/**
 * @function getShasum
 * @param { import('fs').PathLike } file
 * @returns { Promise<string|null> }
 */
const getShasum = file => {
  if (!existsSync(file)) return null
  const sha = createHash('sha256')
  return new Promise((resolve, reject) => {
    const stream = createReadStream(file)
    stream.on('data', data => {
      sha.update(data)
    })
    stream.on('end', () => {
      const shasum = sha.digest('hex')
      resolve(shasum)
    })
    stream.on('error', e => {
      console.warn(`Failed to read ${file}.\n${e}`)
      reject(null)
    })
  })
}

module.exports = getShasum
