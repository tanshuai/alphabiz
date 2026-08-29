'use strict'

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const {
  nativeVersion,
  parseVersion,
  releaseChannel,
  runtimeVersion,
  validateBuiltVersion,
  validateReleaseMetadata,
  validateReleaseRequest
} = require('./version-contract')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const packageJson = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'))
const release = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'release.json'), 'utf8'))

assert.deepEqual(validateReleaseMetadata(packageJson, release), {
  version: '0.4.0-beta.1',
  channel: 'beta',
  nativeVersion: '0.4.0',
  target: 'main'
})

assert.equal(releaseChannel('0.4.0-beta.1'), 'beta')
assert.equal(releaseChannel('0.4.0'), 'stable')
assert.equal(nativeVersion('0.4.0-beta.1'), '0.4.0')

const beta = runtimeVersion({
  packageVersion: '0.3.3',
  newTag: '0.4.0-beta.1',
  buildTime: '202608300945',
  buildCommit: '1234567',
  sourceCommit: '1234567'
})
assert.deepEqual(beta, {
  packageVer: '0.4.0-beta.1',
  channel: 'beta',
  buildTime: '202608300945',
  buildCommit: '1234567',
  sourceCommit: '1234567',
  version: '0.4.0-beta.1'
})

const stable = runtimeVersion({
  packageVersion: '0.3.3',
  newTag: '0.4.0',
  buildTime: '202608300945',
  buildCommit: '1234567',
  sourceCommit: '1234567'
})
assert.equal(stable.channel, 'stable')
assert.equal(stable.version, '0.4.0')

const stableNightly = runtimeVersion({
  packageVersion: '0.3.3',
  buildTime: '202608300945',
  buildCommit: '1234567',
  sourceCommit: '7654321'
})
assert.equal(stableNightly.version, '0.3.4-nightly-202608300945')

const betaNightly = runtimeVersion({
  packageVersion: '0.4.0-beta.1',
  buildTime: '202608300945',
  buildCommit: '1234567',
  sourceCommit: '7654321'
})
assert.equal(betaNightly.version, '0.4.0-nightly-202608300945')

for (const invalid of ['v0.4.0-beta.1', '0.4', '0.4.0-beta..1', '01.4.0']) {
  assert.throws(() => parseVersion(invalid), /SemVer/)
}

assert.throws(() => runtimeVersion({
  packageVersion: '0.3.3',
  newTag: '0.4.0-beta.1',
  buildTime: '2026-08-30',
  buildCommit: '1234567',
  sourceCommit: '1234567'
}), /buildTime/)

for (const invalidBuildTime of ['202613010000', '202602290000', '202608302460']) {
  assert.throws(() => runtimeVersion({
    packageVersion: '0.3.3',
    buildTime: invalidBuildTime,
    buildCommit: '1234567',
    sourceCommit: '7654321'
  }), /buildTime/)
}

assert.throws(() => validateReleaseMetadata(
  { version: '0.4.0-beta.2' },
  release
), /Version mismatch/)

assert.throws(() => validateReleaseRequest({
  newTag: '0.4.0-beta.1',
  expectedVersion: '0.4.0-beta.1',
  sourceCommit: '1234567'
}), /--SHA7/)
assert.throws(() => validateReleaseRequest({
  newTag: '0.4.0-beta.1',
  expectedVersion: '0.4.0-beta.1',
  buildCommit: '1234567'
}), /--sourceSHA7/)
assert.throws(() => validateReleaseRequest({
  newTag: '0.4.0-beta.1',
  expectedVersion: '0.4.0-beta.1',
  buildCommit: '1234567',
  sourceCommit: '1234567',
  stable: true
}), /prerelease/)
assert.throws(() => validateReleaseRequest({
  newTag: '9.9.9',
  expectedVersion: '0.4.0-beta.1',
  buildCommit: '1234567',
  sourceCommit: '7654321'
}), /declared version/)
validateReleaseRequest({
  newTag: '0.4.0-beta.1',
  expectedVersion: '0.4.0-beta.1',
  buildCommit: '1234567',
  sourceCommit: '7654321'
})

const builtVersion = {
  packageVer: '0.4.0-beta.1',
  channel: 'beta',
  buildTime: '202608300945',
  buildCommit: '1234567',
  sourceCommit: '7654321',
  version: '0.4.0-beta.1'
}
assert.equal(validateBuiltVersion(
  packageJson,
  release,
  { version: '0.4.0-beta.1' },
  [
    { label: 'packaged runtime', value: builtVersion },
    { label: 'generated runtime', value: { ...builtVersion } }
  ]
).version, '0.4.0-beta.1')
assert.throws(() => validateBuiltVersion(
  packageJson,
  release,
  { version: '0.2.4' },
  [{ label: 'packaged runtime', value: builtVersion }]
), /Packaged app version mismatch/)

console.log('Release version contract passed.')
