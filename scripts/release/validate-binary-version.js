'use strict'

const fs = require('fs')
const path = require('path')
const { validateBuiltVersion } = require('./version-contract')

const repositoryRoot = path.resolve(__dirname, '..', '..')

function readJson (relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8'))
}

const packageJson = readJson('package.json')
const release = readJson('release.json')
const appManifest = readJson('dist/electron/UnPackaged/package.json')
const packagedRuntime = readJson('dist/electron/UnPackaged/version.json')

validateBuiltVersion(packageJson, release, appManifest, [
  { label: 'packaged runtime', value: packagedRuntime }
])

const result = validateBuiltVersion(packageJson, release, appManifest, [
  { label: 'packaged runtime', value: packagedRuntime },
  { label: 'generated runtime', value: readJson('public/version.json') }
])

console.log(`Binary version contract passed for ${result.version}.`)
