'use strict'

const fs = require('fs')
const path = require('path')
const { validateReleaseMetadata } = require('./version-contract')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const packageJson = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'))
const release = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'release.json'), 'utf8'))
const result = validateReleaseMetadata(packageJson, release)

console.log(`Release version: ${result.version}`)
console.log(`Release channel: ${result.channel}`)
console.log(`Native installer version: ${result.nativeVersion}`)
console.log(`Release target: ${result.target}`)
