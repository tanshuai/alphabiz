'use strict'

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const packageManifest = require(path.join(repositoryRoot, 'package.json'))
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
  .replace(/\r\n/g, '\n')

const expectedResolutions = {
  '**/appium-support/form-data': '4.0.6',
  '**/jsdom/form-data': '3.0.5',
  '**/request/form-data': '2.5.6'
}

for (const [selector, version] of Object.entries(expectedResolutions)) {
  assert.equal(packageManifest.resolutions[selector], version)
}

function assertLockedVersion (selector, version) {
  const start = lockfile.indexOf(selector)
  assert.notEqual(start, -1, `Missing frozen form-data selector: ${selector}`)

  const end = lockfile.indexOf('\n\n', start)
  const block = lockfile.slice(start, end === -1 ? lockfile.length : end)
  assert.ok(
    block.includes(`\n  version "${version}"`),
    `${selector} is not frozen to form-data ${version}`
  )
}

assertLockedVersion(
  'form-data@2.5.6, form-data@^2.5.0, form-data@~2.3.2:',
  '2.5.6'
)
assertLockedVersion('form-data@3.0.5, form-data@^3.0.0:', '3.0.5')
assertLockedVersion('form-data@4.0.6, form-data@^4.0.0:', '4.0.6')

const formDataBlocks = lockfile.split('\n\n')
  .filter((block) => block.startsWith('form-data@'))

for (const vulnerableVersion of [
  '2.3.3',
  '2.5.1',
  '2.5.5',
  '3.0.1',
  '3.0.4',
  '4.0.0',
  '4.0.4'
]) {
  assert.equal(
    formDataBlocks.some((block) => block.includes(`\n  version "${vulnerableVersion}"`)),
    false,
    `Vulnerable form-data ${vulnerableVersion} remains in the frozen lockfile`
  )
}

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  return {
    directory: path.dirname(manifestPath),
    manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath: require.resolve(name, { paths: [searchPath] })
  }
}

const appium = resolvePackage('appium', repositoryRoot)
const appiumSupport = resolvePackage('appium-support', appium.directory)
const jsdom = resolvePackage('jsdom', repositoryRoot)
const requestTypesManifest = require.resolve('@types/request/package.json', {
  paths: [repositoryRoot]
})
const requestConsumers = [
  resolvePackage('@cypress/request', repositoryRoot),
  resolvePackage('request', repositoryRoot),
  { directory: path.dirname(requestTypesManifest) }
]

for (const consumer of requestConsumers) {
  assert.equal(resolvePackage('form-data', consumer.directory).manifest.version, '2.5.6')
}

const installations = [
  {
    label: 'request-compatible 2.x graph',
    expectedVersion: '2.5.6',
    package: resolvePackage('form-data', repositoryRoot)
  },
  {
    label: 'jsdom 3.x graph',
    expectedVersion: '3.0.5',
    package: resolvePackage('form-data', jsdom.directory)
  },
  {
    label: 'appium-support 4.x graph',
    expectedVersion: '4.0.6',
    package: resolvePackage('form-data', appiumSupport.directory)
  }
]

const probeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const FormData = require(process.argv[1])',
  'const manifest = require(process.argv[2])',
  'const expectedVersion = process.argv[3]',
  'assert.equal(manifest.version, expectedVersion)',
  'const originalRandom = Math.random',
  "Math.random = () => { throw new Error('form-data consulted Math.random') }",
  'let boundary',
  'let form',
  'try {',
  '  form = new FormData()',
  '  boundary = form.getBoundary()',
  '} finally {',
  '  Math.random = originalRandom',
  '}',
  "assert.match(boundary, /^--------------------------[0-9a-f]{24}$/)",
  "form.append('field', 'value')",
  "form.append('file', Buffer.from('abc'), { filename: 'sample.txt', contentType: 'text/plain', knownLength: 3 })",
  'const headers = form.getHeaders()',
  "assert.equal(headers['content-type'], `multipart/form-data; boundary=${boundary}`)",
  'const body = form.getBuffer()',
  "assert.ok(body.includes(Buffer.from('value')))",
  "assert.ok(body.includes(Buffer.from('abc')))",
  'assert.equal(form.getLengthSync(), body.length)',
  'const escaped = new FormData()',
  "escaped.append('field\\\"\\r\\nline', 'safe')",
  "escaped.append('file', Buffer.from('abc'), { filename: 'sample\\\"\\r\\nfile.txt' })",
  "const escapedBody = escaped.getBuffer().toString('latin1')",
  "assert.ok(escapedBody.includes('name=\\\"field%22%0D%0Aline\\\"'))",
  "assert.ok(escapedBody.includes('filename=\\\"sample%22%0D%0Afile.txt\\\"'))",
  "assert.equal(escapedBody.includes('field\\\"\\r\\nline'), false)",
  "assert.equal(escapedBody.includes('sample\\\"\\r\\nfile.txt'), false)"
].join('\n')

for (const installation of installations) {
  assert.equal(installation.package.manifest.version, installation.expectedVersion)

  const probe = spawnSync(process.execPath, [
    '-e',
    probeSource,
    installation.package.modulePath,
    installation.package.manifestPath,
    installation.expectedVersion
  ], {
    encoding: 'utf8',
    timeout: 5000
  })

  assert.equal(probe.error, undefined)
  assert.equal(
    probe.status,
    0,
    `${installation.label} failed its entropy or compatibility boundary: ${probe.stderr}`
  )
}

console.log('[form-data] Patched 2.x, 3.x, and 4.x graphs pass entropy, CRLF escaping, and compatibility boundaries.')
