'use strict'

const assert = require('assert').strict
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const packageManifest = require(path.join(repositoryRoot, 'package.json'))
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
const resolutionPath = 'appium/appium-tizen-driver/jimp/@jimp/custom/@jimp/core/mkdirp'

assert.equal(packageManifest.resolutions[resolutionPath], '0.5.6')
assert.equal(
  /^minimist@0\.0\.8:/m.test(lockfile),
  false,
  'The vulnerable minimist 0.0.8 selector remains in the frozen lockfile'
)
assert.ok(
  /mkdirp@0\.5\.1, mkdirp@0\.5\.6:\r?\n  version "0\.5\.6"/.test(lockfile),
  'The exact Appium/Tizen mkdirp override is missing from the frozen lockfile'
)

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  return {
    directory: path.dirname(manifestPath),
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath: require.resolve(name, { paths: [searchPath] })
  }
}

const appium = resolvePackage('appium', repositoryRoot)
const tizenDriver = resolvePackage('appium-tizen-driver', appium.directory)
const jimp = resolvePackage('jimp', tizenDriver.directory)
const jimpCustom = resolvePackage('@jimp/custom', jimp.directory)
const jimpCore = resolvePackage('@jimp/core', jimpCustom.directory)
const targetMkdirp = resolvePackage('mkdirp', jimpCore.directory)
const targetMinimist = resolvePackage('minimist', targetMkdirp.directory)

assert.equal(jimp.manifest.version, '0.5.6')
assert.equal(jimpCore.manifest.version, '0.5.4')
assert.equal(targetMkdirp.manifest.version, '0.5.6')
assert.equal(targetMinimist.manifest.version, '1.2.6')

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-mkdirp-'))
const nestedDirectory = path.join(temporaryRoot, 'nested', 'directory')

try {
  require(targetMkdirp.modulePath).sync(nestedDirectory)
  assert.equal(fs.statSync(nestedDirectory).isDirectory(), true)
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true })
}

function assertIsolatedProbe (source, boundary) {
  const pollutionProbe = spawnSync(process.execPath, [
    '-e',
    source.join('\n'),
    targetMinimist.modulePath
  ], {
    encoding: 'utf8',
    timeout: 5000
  })

  assert.equal(pollutionProbe.error, undefined)
  assert.equal(
    pollutionProbe.status,
    0,
    `minimist crossed the ${boundary} prototype boundary: ${pollutionProbe.stderr}`
  )
}

assertIsolatedProbe([
  'const parse = require(process.argv[1])',
  "parse(['--_.constructor.constructor.prototype.alphabizMinimistProbe', 'safe'])",
  'if ((function () {}).alphabizMinimistProbe !== undefined) process.exit(23)'
], 'constructor')

assertIsolatedProbe([
  'const parse = require(process.argv[1])',
  "parse(['--__proto__.alphabizMinimistObjectProbe=unsafe'])",
  'if (({}).alphabizMinimistObjectProbe !== undefined) process.exit(24)'
], 'object')

console.log('[minimist] Targeted Appium/Tizen chain and prototype-pollution boundary passed.')
