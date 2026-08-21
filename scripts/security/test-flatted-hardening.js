'use strict'

const assert = require('assert').strict
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const packageManifest = JSON.parse(
  fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8')
)
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
  .replace(/\r\n/g, '\n')
const lockBlocks = lockfile.split('\n\n')

function normalizeHeader (block) {
  const header = block.split('\n', 1)[0]
  const quoted = header.match(/^"([^"]+)":$/)
  return quoted ? `${quoted[1]}:` : header
}

function findLockBlock (header) {
  return lockBlocks.find((block) => normalizeHeader(block) === header)
}

const flattedBlocks = lockBlocks.filter((block) => /^"?flatted@/.test(block))
assert.equal(flattedBlocks.length, 1, 'Unexpected flatted selector entered the lockfile')

const flattedBlock = flattedBlocks[0]
assert.equal(normalizeHeader(flattedBlock), 'flatted@^3.1.0:')
assert.ok(flattedBlock.includes('\n  version "3.4.4"'), 'flatted is not frozen to 3.4.4')
assert.ok(
  flattedBlock.includes('flatted-3.4.4.tgz#aeeca2a506303f0cee61c59e6c9f2a88d2f29fc6'),
  'flatted tarball hash changed'
)
assert.ok(
  flattedBlock.includes('sha512-5+ybhBZANEJxaH3X5evAFatUxLfEHSr7n6kYJ+1Qd0mUqr4eu9gIf6GDbWHf8RJijHrjjO8G+la14SlL2SeS1Q=='),
  'flatted tarball integrity changed'
)

function assertConsumerSelector (consumerHeader, dependency, selector) {
  const consumer = findLockBlock(consumerHeader)
  assert.ok(consumer, `Missing flatted consumer: ${consumerHeader}`)
  assert.ok(
    consumer.includes(`\n    ${dependency} "${selector}"`),
    `${consumerHeader} no longer selects ${dependency} ${selector}`
  )
}

assertConsumerSelector('eslint@^8.7.0:', 'file-entry-cache', '^6.0.1')
assertConsumerSelector('file-entry-cache@^6.0.1:', 'flat-cache', '^3.0.4')
assertConsumerSelector('flat-cache@^3.0.4:', 'flatted', '^3.1.0')

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  return {
    directory: path.dirname(manifestPath),
    manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath: require.resolve(name, { paths: [searchPath] })
  }
}

assert.equal(packageManifest.devDependencies.eslint, '^8.7.0')

const eslint = resolvePackage('eslint', repositoryRoot)
const fileEntryCache = resolvePackage('file-entry-cache', eslint.directory)
const flatCache = resolvePackage('flat-cache', fileEntryCache.directory)
const flatted = resolvePackage('flatted', flatCache.directory)

const graph = [
  { name: 'eslint', package: eslint, version: '8.9.0' },
  { name: 'file-entry-cache', package: fileEntryCache, version: '6.0.1' },
  { name: 'flat-cache', package: flatCache, version: '3.0.4' },
  { name: 'flatted', package: flatted, version: '3.4.4' }
]

assert.equal(eslint.manifest.dependencies['file-entry-cache'], '^6.0.1')
assert.equal(fileEntryCache.manifest.dependencies['flat-cache'], '^3.0.4')
assert.equal(flatCache.manifest.dependencies.flatted, '^3.1.0')
assert.equal(new Set(graph.map((entry) => entry.package.manifestPath)).size, graph.length)

for (const entry of graph) {
  assert.equal(entry.package.manifest.version, entry.version)
  assert.equal(
    fs.realpathSync(entry.package.directory),
    fs.realpathSync(path.join(repositoryRoot, 'node_modules', entry.name)),
    `${entry.name} is no longer the expected physical installation`
  )
  assert.ok(
    entry.package.modulePath.startsWith(`${entry.package.directory}${path.sep}`),
    `${entry.name} resolved outside its physical package directory`
  )
}

const probeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  "const fs = require('fs')",
  "const path = require('path')",
  'const flatted = require(process.argv[1])',
  'const flatCache = require(process.argv[2])',
  'const manifest = require(process.argv[3])',
  'const tempDirectory = process.argv[4]',
  "assert.equal(manifest.version, '3.4.4')",
  "const payload = '[{\"x\":\"__proto__\"}]'",
  "const marker = `__flatted_security_${process.pid}`",
  'function assertUnpolluted () {',
  '  assert.equal(Object.prototype.hasOwnProperty.call(Array.prototype, marker), false)',
  '  assert.equal(Object.prototype.hasOwnProperty.call(Object.prototype, marker), false)',
  '}',
  'function exerciseReference (value) {',
  '  assert.notEqual(value, Array.prototype)',
  "  if (value && (typeof value === 'object' || typeof value === 'function')) value[marker] = true",
  '  assertUnpolluted()',
  '}',
  'function assertGraph (value) {',
  "  assert.equal(value.name, 'alpha')",
  '  assert.equal(value.self, value)',
  '  assert.equal(value.left, value.right)',
  '  assert.equal(value.left.value, 42)',
  '}',
  'assertUnpolluted()',
  'const direct = flatted.parse(payload)',
  'assert.equal(direct.x, undefined)',
  'exerciseReference(direct.x)',
  'try {',
  "  const maliciousCache = path.join(tempDirectory, 'malicious-cache')",
  '  fs.writeFileSync(maliciousCache, payload)',
  '  const cachedReference = flatCache.createFromFile(maliciousCache).all().x',
  '  assert.equal(cachedReference, undefined)',
  '  exerciseReference(cachedReference)',
  '  const shared = { value: 42 }',
  "  const value = { name: 'alpha', left: shared, right: shared }",
  '  value.self = value',
  "  const writer = flatCache.create('round-trip-cache', tempDirectory)",
  "  writer.setKey('graph', value)",
  '  writer.save(true)',
  "  assertGraph(flatCache.create('round-trip-cache', tempDirectory).getKey('graph'))",
  "  const legacyCache = path.join(tempDirectory, 'legacy-3.2.5-cache')",
  "  fs.writeFileSync(legacyCache, '[{\"graph\":\"1\"},{\"name\":\"2\",\"left\":\"3\",\"right\":\"3\",\"self\":\"1\"},\"alpha\",{\"value\":42}]')",
  "  assertGraph(flatCache.createFromFile(legacyCache).getKey('graph'))",
  '} finally {',
  '  delete Array.prototype[marker]',
  '  delete Object.prototype[marker]',
  '  fs.rmSync(tempDirectory, { recursive: true, force: true })',
  '}',
  'assertUnpolluted()'
].join('\n')

const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-flatted-'))
try {
  const probe = spawnSync(process.execPath, [
    '--max-old-space-size=64',
    '-e',
    probeSource,
    flatted.modulePath,
    flatCache.modulePath,
    flatted.manifestPath,
    tempDirectory
  ], {
    encoding: 'utf8',
    timeout: 2000,
    maxBuffer: 1024 * 1024
  })

  assert.equal(probe.error, undefined, `flatted probe failed to execute: ${probe.error}`)
  assert.equal(probe.signal, null, `flatted probe terminated by ${probe.signal}`)
  assert.equal(probe.status, 0, `flatted probe failed: ${probe.stderr}`)
} finally {
  fs.rmSync(tempDirectory, { recursive: true, force: true })
}

console.log('[flatted] Frozen ESLint cache graph blocks prototype aliases and preserves cyclic caches.')
