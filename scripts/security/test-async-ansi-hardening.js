'use strict'

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
  .replace(/\r\n/g, '\n')
const lockBlocks = lockfile.split('\n\n')

function normalizeHeader (block) {
  const header = block.split('\n', 1)[0]
  const quoted = header.match(/^"([^"]+)":$/)
  return quoted ? `${quoted[1]}:` : header
}

function packageBlocks (name) {
  return lockBlocks.filter((block) => new RegExp(`^"?${name}@`).test(block))
}

function assertLockedVersion (blocks, selector, version) {
  const block = blocks.find((candidate) => normalizeHeader(candidate) === selector)
  assert.ok(block, `Missing frozen selector: ${selector}`)
  assert.ok(
    block.includes(`\n  version "${version}"`),
    `${selector} is not frozen to ${version}`
  )
}

function lockedVersions (blocks) {
  return blocks.map((block) => {
    const match = block.match(/\n  version "([^"]+)"/)
    assert.ok(match, `${normalizeHeader(block)} has no version`)
    return match[1]
  }).sort()
}

function assertConsumerSelector (consumerHeader, name, selector) {
  const consumer = lockBlocks.find((block) => normalizeHeader(block) === consumerHeader)
  assert.ok(consumer, `Missing consumer: ${consumerHeader}`)
  assert.ok(
    consumer.includes(`\n    ${name} "${selector}"`),
    `${consumerHeader} no longer selects ${name} ${selector}`
  )
}

const asyncBlocks = packageBlocks('async')
assert.equal(asyncBlocks.length, 4, 'Unexpected async selector entered the lockfile')
assertLockedVersion(
  asyncBlocks,
  'async@^2.6.0, async@^2.6.2, async@^2.6.3:',
  '2.6.4'
)
assert.deepEqual(lockedVersions(asyncBlocks), ['0.9.2', '1.5.2', '2.6.4', '3.2.3'])

const ansiRegexBlocks = packageBlocks('ansi-regex')
assert.equal(ansiRegexBlocks.length, 4, 'Unexpected ansi-regex selector entered the lockfile')
assertLockedVersion(ansiRegexBlocks, 'ansi-regex@^3.0.0:', '3.0.1')
assert.deepEqual(lockedVersions(ansiRegexBlocks), ['2.1.1', '3.0.1', '4.1.1', '5.0.1'])

assertConsumerSelector(
  'portfinder@^1.0.13, portfinder@^1.0.28, portfinder@^1.0.6:',
  'async',
  '^2.6.2'
)
assertConsumerSelector(
  'portscanner@2.2.0, portscanner@^2.1.1, portscanner@^2.2.0:',
  'async',
  '^2.6.0'
)
assertConsumerSelector('archiver@^3.0.0:', 'async', '^2.6.3')
assertConsumerSelector('strip-ansi@^4.0.0:', 'ansi-regex', '^3.0.0')

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  return {
    directory: path.dirname(manifestPath),
    manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath: require.resolve(name, { paths: [searchPath] })
  }
}

const portfinder = resolvePackage('portfinder', repositoryRoot)
const portscanner = resolvePackage('portscanner', repositoryRoot)
const tizenDriver = resolvePackage('appium-tizen-driver', repositoryRoot)
const tizenArchiver = resolvePackage('archiver', tizenDriver.directory)
const tizenStripAnsi = resolvePackage('strip-ansi', tizenDriver.directory)
const tizenAnsiRegex = resolvePackage('ansi-regex', tizenStripAnsi.directory)

assert.equal(portfinder.manifest.version, '1.0.28')
assert.equal(portscanner.manifest.version, '2.2.0')
assert.equal(tizenArchiver.manifest.version, '3.1.1')
assert.equal(tizenStripAnsi.manifest.version, '4.0.0')
assert.equal(tizenAnsiRegex.manifest.version, '3.0.1')

const asyncInstallations = [portfinder, portscanner, tizenArchiver]
  .map((consumer) => resolvePackage('async', consumer.directory))

assert.equal(
  new Set(asyncInstallations.map((installation) => installation.manifestPath)).size,
  1,
  'Target async consumers no longer share one physical installation'
)
for (const installation of asyncInstallations) {
  assert.equal(installation.manifest.version, '2.6.4')
}

const securityProbeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const asyncLibrary = require(process.argv[1])',
  'const asyncManifest = require(process.argv[2])',
  'const ansiRegex = require(process.argv[3])',
  'const ansiManifest = require(process.argv[4])',
  'const stripAnsi = require(process.argv[5])',
  "assert.equal(asyncManifest.version, '2.6.4')",
  "assert.equal(ansiManifest.version, '3.0.1')",
  ';(async () => {',
  "  const input = JSON.parse('{\"safe\":2,\"__proto__\":{\"polluted\":true}}')",
  '  const visited = []',
  '  const mapped = await new Promise((resolve, reject) => {',
  '    asyncLibrary.mapValues(input, (value, key, callback) => {',
  '      visited.push(key)',
  '      callback(null, value * 2)',
  '    }, (error, result) => error ? reject(error) : resolve(result))',
  '  })',
  "  assert.deepEqual(visited, ['safe'])",
  '  assert.deepEqual(mapped, { safe: 4 })',
  '  assert.equal(Object.getPrototypeOf(mapped), Object.prototype)',
  "  assert.equal(Object.prototype.hasOwnProperty.call(mapped, '__proto__'), false)",
  '  assert.equal(Object.prototype.polluted, undefined)',
  "  const normal = await new Promise((resolve, reject) => asyncLibrary.mapValues({ alpha: 2, beta: 3 }, (value, key, callback) => callback(null, `${key}:${value * 2}`), (error, result) => error ? reject(error) : resolve(result)))",
  "  assert.deepEqual(normal, { alpha: 'alpha:4', beta: 'beta:6' })",
  "  const colored = '\\u001B[31mAlphaBiz\\u001B[0m'",
  '  assert.equal(ansiRegex().test(colored), true)',
  "  assert.equal(stripAnsi(colored), 'AlphaBiz')",
  "  assert.equal(stripAnsi('AlphaBiz plain'), 'AlphaBiz plain')",
  "  const malformed = '\\u001B[' + ';'.repeat(100000)",
  '  assert.equal(ansiRegex().test(malformed), false)',
  '})().catch((error) => {',
  '  console.error(error)',
  '  process.exit(1)',
  '})'
].join('\n')

const securityProbe = spawnSync(process.execPath, [
  '--max-old-space-size=64',
  '-e',
  securityProbeSource,
  asyncInstallations[0].modulePath,
  asyncInstallations[0].manifestPath,
  tizenAnsiRegex.modulePath,
  tizenAnsiRegex.manifestPath,
  tizenStripAnsi.modulePath
], {
  encoding: 'utf8',
  timeout: 2000
})

assert.equal(securityProbe.error, undefined)
assert.equal(
  securityProbe.status,
  0,
  `async/ansi security probe failed: ${securityProbe.stderr}`
)

const consumerProbeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  "const net = require('net')",
  'const portfinder = require(process.argv[1])',
  'const portscanner = require(process.argv[2])',
  ';(async () => {',
  '  const server = net.createServer()',
  "  await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve))",
  '  const port = server.address().port',
  "  assert.equal(await portscanner.checkPortStatus(port, '127.0.0.1'), 'open')",
  '  const searchStart = port > 65515 ? port - 20 : port',
  '  const searchEnd = Math.min(port + 20, 65535)',
  "  const alternative = await portfinder.getPortPromise({ port: searchStart, stopPort: searchEnd, host: '127.0.0.1' })",
  '  assert.notEqual(alternative, port)',
  '  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))',
  "  assert.equal(await portscanner.checkPortStatus(port, '127.0.0.1'), 'closed')",
  "  const released = await portfinder.getPortPromise({ port, stopPort: port, host: '127.0.0.1' })",
  '  assert.equal(released, port)',
  '})().catch((error) => {',
  '  console.error(error)',
  '  process.exit(1)',
  '})'
].join('\n')

const consumerProbe = spawnSync(process.execPath, [
  '--max-old-space-size=64',
  '-e',
  consumerProbeSource,
  portfinder.modulePath,
  portscanner.modulePath
], {
  encoding: 'utf8',
  timeout: 5000
})

assert.equal(consumerProbe.error, undefined)
assert.equal(
  consumerProbe.status,
  0,
  `portfinder/portscanner compatibility probe failed: ${consumerProbe.stderr}`
)

assert.ok(require(tizenDriver.modulePath))

console.log('[async/ansi] Patched async 2.x and ansi-regex 3.x graphs pass pollution, ReDoS, and consumer compatibility boundaries.')
