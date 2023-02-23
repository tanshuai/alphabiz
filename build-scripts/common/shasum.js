#!/usr/bin/env node

const { existsSync, readdirSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const getShasum = existsSync(resolve(__dirname, '../../src-electron/utils/shasum.js')) ? require('../../src-electron/utils/shasum')
  : require('../../shasum')

/**
 * @function generateShasums
 * @param { import('fs').PathLike } dir
 */
const generateShasums = async dir => {
  const files = readdirSync(dir).filter(i => !i.endsWith('.sha'))
  let count = 0
  for (const file of files) {
    const p = resolve(dir, file)
    const sha = await getShasum(p)
    if (typeof sha === 'string') {
      /**
       * The module `sumchecker` requires using `SHASUM256.txt` with following
       * string format. This may be used in the future.
       * @see https://www.npmjs.com/package/sumchecker
       * @see https://en.wikipedia.org/wiki/Sha1sum
       */
      console.log(`${sha} *${file}`)
      writeFileSync(p + '.sha', sha)
      count += 1
    } else {
      console.warn(`Failed to generate shasum file for ${file}`)
    }
  }
  console.log(`Generated ${count} shasum files`)
}

// Check if is command line call
if (require.main === module) {
  const dir = process.argv[2]
  if (dir && existsSync(dir)) {
    generateShasums(dir)
  } else {
    console.log('Require passing a directory with output installers')
  }
}

module.exports = generateShasums
