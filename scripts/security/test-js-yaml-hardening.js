'use strict'

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
  .replace(/\r\n/g, '\n')
const yamlBlocks = lockfile.split('\n\n')
  .filter((block) => /^"?js-yaml@/.test(block))

assert.equal(yamlBlocks.length, 2, 'Unexpected js-yaml selector entered the lockfile')

function normalizeHeader (block) {
  const header = block.split('\n', 1)[0]
  const quoted = header.match(/^"([^"]+)":$/)
  return quoted ? `${quoted[1]}:` : header
}

function assertLockedVersion (selector, version) {
  const block = yamlBlocks.find((candidate) => normalizeHeader(candidate) === selector)
  assert.ok(block, `Missing frozen js-yaml selector: ${selector}`)
  assert.ok(
    block.includes(`\n  version "${version}"`),
    `${selector} is not frozen to js-yaml ${version}`
  )
}

assertLockedVersion('js-yaml@^3.10.0, js-yaml@^3.13.1:', '3.15.2')
assertLockedVersion('js-yaml@^4.1.0:', '4.3.2')

const lockedVersions = yamlBlocks.map((block) => {
  const match = block.match(/\n  version "([^"]+)"/)
  assert.ok(match, 'js-yaml lock block has no version')
  return match[1]
}).sort()

assert.deepEqual(lockedVersions, ['3.15.2', '4.3.2'])

function assertConsumerSelector (consumerHeader, selector) {
  const consumer = lockfile.split('\n\n')
    .find((block) => normalizeHeader(block) === consumerHeader)
  assert.ok(consumer, `Missing js-yaml consumer: ${consumerHeader}`)
  assert.ok(
    consumer.includes(`\n    js-yaml "${selector}"`),
    `${consumerHeader} no longer selects js-yaml ${selector}`
  )
}

assertConsumerSelector('electron-installer-snap@^5.1.0:', '^3.10.0')
assertConsumerSelector('@istanbuljs/load-nyc-config@^1.0.0:', '^3.13.1')
assertConsumerSelector('eslint@^8.7.0:', '^4.1.0')
assertConsumerSelector('@eslint/eslintrc@^1.1.0:', '^4.1.0')

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  return {
    directory: path.dirname(manifestPath),
    manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath: require.resolve(name, { paths: [searchPath] })
  }
}

const istanbulConfig = resolvePackage('@istanbuljs/load-nyc-config', repositoryRoot)
const eslint = resolvePackage('eslint', repositoryRoot)
const eslintConfig = resolvePackage('@eslint/eslintrc', repositoryRoot)

const installations = [
  {
    label: 'Istanbul/Babel configuration graph',
    expectedVersion: '3.15.2',
    package: resolvePackage('js-yaml', istanbulConfig.directory)
  },
  {
    label: 'ESLint graph',
    expectedVersion: '4.3.2',
    package: resolvePackage('js-yaml', eslint.directory)
  },
  {
    label: 'ESLint configuration graph',
    expectedVersion: '4.3.2',
    package: resolvePackage('js-yaml', eslintConfig.directory)
  }
]

assert.equal(
  new Set(installations.map((installation) => installation.package.manifestPath)).size,
  3,
  'Unexpected js-yaml physical installation layout'
)

const probeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const yaml = require(process.argv[1])',
  'const manifest = require(process.argv[2])',
  'const expectedVersion = process.argv[3]',
  'assert.equal(manifest.version, expectedVersion)',
  "const load = expectedVersion.startsWith('3.') ? yaml.safeLoad : yaml.load",
  "const dump = expectedVersion.startsWith('3.') ? yaml.safeDump : yaml.dump",
  "const document = load('name: alphabiz\\nfeatures:\\n  - security\\n')",
  "assert.deepEqual(document, { name: 'alphabiz', features: ['security'] })",
  'assert.deepEqual(load(dump(document)), document)',
  'assert.equal(Object.prototype.polluted, undefined)',
  'const pollutionDocument = load([',
  "  'source: &source',",
  "  '  __proto__:',",
  "  '    polluted: true',",
  "  'target:',",
  "  '  <<: *source',",
  "  ''",
  "].join('\\n'))",
  'assert.equal(Object.prototype.polluted, undefined)',
  "assert.equal(Object.prototype.hasOwnProperty.call(pollutionDocument.target, '__proto__'), true)",
  "assert.equal(pollutionDocument.target.__proto__.polluted, true)",
  "const omapDocument = '!!omap\\n' + Array.from({ length: 200 }, (_, index) => `- k${index}: ${index}`).join('\\n') + '\\n'",
  'const nativeIndexOf = Array.prototype.indexOf',
  'let indexOfCalls = 0',
  'let orderedMap',
  'Array.prototype.indexOf = function (...args) {',
  '  indexOfCalls += 1',
  '  return Reflect.apply(nativeIndexOf, this, args)',
  '}',
  'try {',
  '  orderedMap = load(omapDocument)',
  '} finally {',
  '  Array.prototype.indexOf = nativeIndexOf',
  '}',
  'assert.equal(orderedMap.length, 200)',
  'assert.equal(indexOfCalls, 0)',
  "const specialKeys = load('!!omap\\n- __proto__: 1\\n- constructor: 2\\n- toString: 3\\n')",
  "assert.deepEqual(specialKeys.map((entry) => Object.keys(entry)[0]), ['__proto__', 'constructor', 'toString'])",
  "assert.throws(() => load('!!omap\\n- duplicate: 1\\n- duplicate: 2\\n'))",
  "const emptyMerge = 'base: &base {}\\ntarget:\\n  <<: [*base, *base, *base]\\n'",
  "assert.throws(() => load(emptyMerge, { maxTotalMergeKeys: 2 }), /maxTotalMergeKeys/)",
  'assert.deepEqual(load(emptyMerge, { maxTotalMergeKeys: 3 }).target, {})',
  'function mergeSequence (length) {',
  "  return `base: &base {}\\ntarget:\\n  <<: [${Array(length).fill('*base').join(', ')}]\\n`",
  '}',
  'assert.deepEqual(load(mergeSequence(100), { maxTotalMergeKeys: -1 }).target, {})',
  "assert.throws(() => load(mergeSequence(101), { maxTotalMergeKeys: -1 }), /abnormal merge sequence size/)",
  'function mergeChain (count) {',
  "  const lines = ['a0: &a0 { k0: 0 }']",
  '  for (let index = 1; index < count; index += 1) {',
  "    lines.push(`a${index}: &a${index} { <<: *a${index - 1}, k${index}: ${index} }`)",
  '  }',
  "  lines.push(`b: *a${count - 1}`)",
  "  return `${lines.join('\\n')}\\n`",
  '}',
  'assert.equal(Object.keys(load(mergeChain(140)).b).length, 140)',
  "assert.throws(() => load(mergeChain(141)), /maxTotalMergeKeys/)",
  "assert.equal(load('base: &base { a: 1, b: 2 }\\ntarget: { <<: *base, b: 3 }\\n').target.b, 3)",
  "if (expectedVersion.startsWith('4.')) {",
  "  assert.equal(load('value: 1_000\\n').value, '1_000')",
  "  const hugeNumber = '9'.repeat(400)",
  "  assert.equal(load(`value: ${hugeNumber}\\n`).value, hugeNumber)",
  "  const withinDepth = '['.repeat(98) + '0' + ']'.repeat(98)",
  "  const beyondDepth = '['.repeat(99) + '0' + ']'.repeat(99)",
  "  assert.ok(Array.isArray(load(withinDepth)))",
  "  assert.throws(() => load(beyondDepth), /maxDepth/)",
  '}'
].join('\n')

for (const installation of installations) {
  assert.equal(installation.package.manifest.version, installation.expectedVersion)

  const probe = spawnSync(process.execPath, [
    '--max-old-space-size=64',
    '-e',
    probeSource,
    installation.package.modulePath,
    installation.package.manifestPath,
    installation.expectedVersion
  ], {
    encoding: 'utf8',
    timeout: 2000
  })

  assert.equal(probe.error, undefined)
  assert.equal(
    probe.status,
    0,
    `${installation.label} failed its parser boundary: ${probe.stderr}`
  )
}

const { Linter } = require(eslint.modulePath)
const lintMessages = new Linter().verify('const value = 1\n', {
  env: { es2021: true },
  parserOptions: { ecmaVersion: 2021 },
  rules: { semi: ['error', 'never'] }
})
assert.deepEqual(lintMessages, [])

console.log('[js-yaml] Patched 3.x and 4.x graphs pass merge, omap, pollution, and configuration boundaries.')
