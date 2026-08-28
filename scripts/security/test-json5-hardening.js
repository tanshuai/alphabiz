'use strict'

const assert = require('assert').strict
const crypto = require('crypto')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const rootManifest = JSON.parse(
  fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8')
)
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
  .replace(/\r\n/g, '\n')
const lockBlocks = lockfile.split('\n\n').filter((block) =>
  block && block.split('\n', 1)[0].endsWith(':')
)

function selectorsFor (block) {
  const header = block.split('\n', 1)[0]
  assert.ok(header.endsWith(':'), `Malformed yarn.lock header: ${header}`)

  return header.slice(0, -1).split(/,\s+/).map((selector) => {
    if (selector.startsWith('"') && selector.endsWith('"')) {
      return selector.slice(1, -1)
    }
    return selector
  })
}

function normalizedHeader (block) {
  return `${selectorsFor(block).join(', ')}:`
}

function lockValue (block, key) {
  const match = block.match(new RegExp(`\\n  ${key} (?:"([^"]+)"|(\\S+))`))
  assert.ok(match, `${normalizedHeader(block)} has no ${key}`)
  return match[1] || match[2]
}

function json5Dependency (block) {
  const matches = [...block.matchAll(/\n    json5 (?:"([^"]+)"|(\S+))/g)]
  assert.ok(
    matches.length <= 1,
    `${normalizedHeader(block)} declares json5 more than once`
  )
  if (matches.length === 0) return undefined
  return matches[0][1] || matches[0][2]
}

const expectedLockBlocks = [
  [
    'json5@2.2.0, json5@2.2.2, json5@2.x, json5@^2.1.2:',
    '  version "2.2.2"',
    '  resolved "https://registry.yarnpkg.com/json5/-/json5-2.2.2.tgz#64471c5bdcc564c18f7c1d4df2e2297f2457c5ab"',
    '  integrity sha512-46Tk9JiOL2z7ytNQWFLpj99RZkVgeHf87yGQKsIkaPz1qSH9UczKH1rO7K3wgRselo0tYMUNfecYpm/p1vC7tQ=='
  ].join('\n'),
  [
    'json5@1.0.2, json5@^0.5.1:',
    '  version "1.0.2"',
    '  resolved "https://registry.yarnpkg.com/json5/-/json5-1.0.2.tgz#63d98d60f21b313b77c4d6da18bfa69d80e1d593"',
    '  integrity sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==',
    '  dependencies:',
    '    minimist "^1.2.0"'
  ].join('\n'),
  [
    'json5@^1.0.1:',
    '  version "1.0.2"',
    '  resolved "https://registry.yarnpkg.com/json5/-/json5-1.0.2.tgz#63d98d60f21b313b77c4d6da18bfa69d80e1d593"',
    '  integrity sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==',
    '  dependencies:',
    '    minimist "^1.2.0"'
  ].join('\n')
]

const json5Blocks = lockBlocks.filter((block) =>
  selectorsFor(block).some((selector) => selector.startsWith('json5@'))
)

assert.equal(json5Blocks.length, expectedLockBlocks.length, 'Unexpected json5 lock block count')
for (const expectedBlock of expectedLockBlocks) {
  const header = expectedBlock.split('\n', 1)[0]
  const actualBlock = json5Blocks.find((block) => normalizedHeader(block) === header)
  assert.ok(actualBlock, `Missing frozen json5 lock block: ${header}`)
  assert.equal(actualBlock, expectedBlock, `${header} changed from its reviewed lock block`)
}

const expectedIntegrity = {
  '1.0.2': 'sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==',
  '2.2.2': 'sha512-46Tk9JiOL2z7ytNQWFLpj99RZkVgeHf87yGQKsIkaPz1qSH9UczKH1rO7K3wgRselo0tYMUNfecYpm/p1vC7tQ=='
}

for (const block of json5Blocks) {
  const version = lockValue(block, 'version')
  assert.equal(lockValue(block, 'integrity'), expectedIntegrity[version])
  assert.equal(
    Buffer.from(lockValue(block, 'integrity').slice('sha512-'.length), 'base64').length,
    64,
    `${normalizedHeader(block)} has a malformed SHA-512 SRI`
  )
}

for (const dependencyGroup of [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]) {
  assert.equal(
    rootManifest[dependencyGroup] && rootManifest[dependencyGroup].json5,
    undefined,
    `Root ${dependencyGroup} must not add a direct json5 pin`
  )
}

const actualJson5Resolutions = Object.fromEntries(
  Object.entries(rootManifest.resolutions || {}).filter(([resolution]) =>
    resolution.replace(/\\/g, '/').split('/').pop() === 'json5'
  )
)

assert.deepEqual(actualJson5Resolutions, {
  '@playwright/test/json5': '2.2.2',
  '**/find-babel-config/json5': '1.0.2'
}, 'Use only the two reviewed, consumer-scoped json5 resolutions')

const expectedConsumerLocks = [
  {
    header: '@babel/core@7.16.12:',
    version: '7.16.12',
    range: '^2.1.2'
  },
  {
    header: '@babel/core@^7.1.0, @babel/core@^7.12.3, @babel/core@^7.7.2, @babel/core@^7.8.0:',
    version: '7.17.5',
    range: '^2.1.2'
  },
  {
    header: '@playwright/test@^1.18.1:',
    version: '1.19.1',
    range: '2.2.0'
  },
  {
    header: 'find-babel-config@^1.2.0:',
    version: '1.2.0',
    range: '^0.5.1'
  },
  {
    header: 'loader-utils@^1.2.3:',
    version: '1.4.2',
    range: '^1.0.1'
  },
  {
    header: 'ts-jest@^27.1.3:',
    version: '27.1.3',
    range: '2.x'
  }
]

for (const expected of expectedConsumerLocks) {
  const block = lockBlocks.find((candidate) => normalizedHeader(candidate) === expected.header)
  assert.ok(block, `Missing json5 consumer lock block: ${expected.header}`)
  assert.equal(lockValue(block, 'version'), expected.version)
  assert.equal(
    json5Dependency(block),
    expected.range,
    `${expected.header} changed its json5 selector`
  )
}

const expectedConsumerEdges = [
  '@babel/core@7.16.12 -> ^2.1.2',
  '@babel/core@^7.1.0 -> ^2.1.2',
  '@babel/core@^7.12.3 -> ^2.1.2',
  '@babel/core@^7.7.2 -> ^2.1.2',
  '@babel/core@^7.8.0 -> ^2.1.2',
  '@playwright/test@^1.18.1 -> 2.2.0',
  'find-babel-config@^1.2.0 -> ^0.5.1',
  'loader-utils@^1.2.3 -> ^1.0.1',
  'ts-jest@^27.1.3 -> 2.x'
].sort()

const actualConsumerEdges = lockBlocks.flatMap((block) => {
  const dependency = json5Dependency(block)
  if (!dependency) return []
  return selectorsFor(block).map((selector) => `${selector} -> ${dependency}`)
}).sort()

assert.deepEqual(
  actualConsumerEdges,
  expectedConsumerEdges,
  'The json5 consumer graph changed; review every new or removed edge'
)

function portableRelative (file) {
  return path.relative(repositoryRoot, file).split(path.sep).join('/')
}

function visitPackage (packageDirectory, graph) {
  const stat = fs.lstatSync(packageDirectory)
  if (!stat.isDirectory() || stat.isSymbolicLink()) return

  const manifestPath = path.join(packageDirectory, 'package.json')
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    if (manifest.name === 'json5') {
      graph.installations.push({ directory: packageDirectory, manifest, manifestPath })
    }

    const declarations = [
      'dependencies',
      'optionalDependencies',
      'peerDependencies'
    ].flatMap((dependencyGroup) => {
      const dependencies = manifest[dependencyGroup] || {}
      if (!Object.prototype.hasOwnProperty.call(dependencies, 'json5')) return []
      return [{ dependencyGroup, range: dependencies.json5 }]
    })

    assert.ok(
      declarations.length <= 1,
      `${portableRelative(manifestPath)} declares json5 in multiple dependency groups`
    )
    if (declarations.length === 1) {
      graph.consumers.push({
        directory: packageDirectory,
        manifest,
        manifestPath,
        dependencyGroup: declarations[0].dependencyGroup,
        range: declarations[0].range
      })
    }
  }

  const nestedNodeModules = path.join(packageDirectory, 'node_modules')
  if (fs.existsSync(nestedNodeModules)) visitNodeModules(nestedNodeModules, graph)
}

function visitNodeModules (nodeModulesDirectory, graph) {
  for (const entry of fs.readdirSync(nodeModulesDirectory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || !entry.isDirectory()) continue

    const entryPath = path.join(nodeModulesDirectory, entry.name)
    if (entry.name.startsWith('@')) {
      for (const scopedEntry of fs.readdirSync(entryPath, { withFileTypes: true })) {
        if (scopedEntry.isDirectory()) {
          visitPackage(path.join(entryPath, scopedEntry.name), graph)
        }
      }
    } else {
      visitPackage(entryPath, graph)
    }
  }
}

const nodeModulesDirectory = path.join(repositoryRoot, 'node_modules')
assert.ok(fs.existsSync(nodeModulesDirectory), 'node_modules is missing; run the frozen install first')

const physicalGraph = { installations: [], consumers: [] }
visitNodeModules(nodeModulesDirectory, physicalGraph)
physicalGraph.installations.sort((left, right) =>
  portableRelative(left.manifestPath).localeCompare(portableRelative(right.manifestPath))
)
physicalGraph.consumers.sort((left, right) =>
  portableRelative(left.manifestPath).localeCompare(portableRelative(right.manifestPath))
)

const actualPhysicalInstallations = physicalGraph.installations.map((installation) =>
  `${portableRelative(installation.manifestPath)} -> ${installation.manifest.version}`
)

assert.deepEqual(actualPhysicalInstallations, [
  'node_modules/find-babel-config/node_modules/json5/package.json -> 1.0.2',
  'node_modules/json5/package.json -> 2.2.2',
  'node_modules/loader-utils/node_modules/json5/package.json -> 1.0.2'
], 'Unexpected physical json5 installation entered node_modules')

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  const directory = path.dirname(manifestPath)
  const modulePath = require.resolve(name, { paths: [searchPath] })
  const relativeModule = path.relative(directory, modulePath)

  assert.ok(
    relativeModule && !relativeModule.startsWith(`..${path.sep}`) && !path.isAbsolute(relativeModule),
    `${name} resolved outside its physical package directory`
  )

  return {
    directory,
    manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath
  }
}

const installationByManifest = new Map(physicalGraph.installations.map((installation) => [
  fs.realpathSync(installation.manifestPath),
  installation
]))

const actualPhysicalConsumers = physicalGraph.consumers.map((consumer) => {
  const resolvedManifest = require.resolve('json5/package.json', {
    paths: [consumer.directory]
  })
  const resolvedModule = require.resolve('json5', { paths: [consumer.directory] })
  const resolvedDirectory = path.dirname(resolvedManifest)
  const relativeModule = path.relative(resolvedDirectory, resolvedModule)
  const installation = installationByManifest.get(fs.realpathSync(resolvedManifest))

  assert.ok(
    installation,
    `${portableRelative(consumer.manifestPath)} resolves an untracked json5 copy`
  )
  assert.ok(
    relativeModule && !relativeModule.startsWith(`..${path.sep}`) && !path.isAbsolute(relativeModule),
    `${portableRelative(consumer.manifestPath)} resolves json5 outside its package directory`
  )

  return [
    `${portableRelative(consumer.manifestPath)} ->`,
    `${consumer.manifest.name}@${consumer.manifest.version} ->`,
    `json5@${consumer.range} ->`,
    `${portableRelative(resolvedManifest)}@${installation.manifest.version}`
  ].join(' ')
}).sort()

const expectedPhysicalConsumers = [
  'node_modules/@babel/core/package.json -> @babel/core@7.16.12 -> json5@^2.1.2 -> node_modules/json5/package.json@2.2.2',
  'node_modules/@jest/transform/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> json5@^2.1.2 -> node_modules/json5/package.json@2.2.2',
  'node_modules/@playwright/test/package.json -> @playwright/test@1.19.1 -> json5@2.2.0 -> node_modules/json5/package.json@2.2.2',
  'node_modules/find-babel-config/package.json -> find-babel-config@1.2.0 -> json5@^0.5.1 -> node_modules/find-babel-config/node_modules/json5/package.json@1.0.2',
  'node_modules/istanbul-lib-instrument/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> json5@^2.1.2 -> node_modules/json5/package.json@2.2.2',
  'node_modules/jest-config/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> json5@^2.1.2 -> node_modules/json5/package.json@2.2.2',
  'node_modules/jest-snapshot/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> json5@^2.1.2 -> node_modules/json5/package.json@2.2.2',
  'node_modules/loader-utils/package.json -> loader-utils@1.4.2 -> json5@^1.0.1 -> node_modules/loader-utils/node_modules/json5/package.json@1.0.2',
  'node_modules/ts-jest/package.json -> ts-jest@27.1.3 -> json5@2.x -> node_modules/json5/package.json@2.2.2'
].sort()

assert.deepEqual(
  actualPhysicalConsumers,
  expectedPhysicalConsumers,
  'Unexpected physical json5 consumer or resolution entered node_modules'
)

function packageTreeDigest (packageDirectory) {
  const files = []

  function visit (directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name)
      const stat = fs.lstatSync(entryPath)
      assert.equal(stat.isSymbolicLink(), false, `${portableRelative(entryPath)} is an unexpected symlink`)
      if (stat.isDirectory()) {
        visit(entryPath)
      } else {
        assert.equal(stat.isFile(), true, `${portableRelative(entryPath)} is not a regular file`)
        files.push(entryPath)
      }
    }
  }

  visit(packageDirectory)
  files.sort((left, right) => {
    const leftPath = path.relative(packageDirectory, left).split(path.sep).join('/')
    const rightPath = path.relative(packageDirectory, right).split(path.sep).join('/')
    return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0
  })

  const digest = crypto.createHash('sha256')
  let bytes = 0
  for (const file of files) {
    const relativeFile = path.relative(packageDirectory, file).split(path.sep).join('/')
    const contents = fs.readFileSync(file)
    bytes += contents.length
    digest.update(relativeFile)
    digest.update(Buffer.from([0]))
    digest.update(String(contents.length))
    digest.update(Buffer.from([0]))
    digest.update(contents)
    digest.update(Buffer.from([0]))
  }

  return { files: files.length, bytes, sha256: digest.digest('hex') }
}

const expectedPackageTrees = {
  '1.0.2': {
    files: 12,
    bytes: 78288,
    sha256: '644ee1b4f21fcffb4fdf3da3811c93c2aeafc92801b723ea304a3822249b503a'
  },
  '2.2.2': {
    files: 20,
    bytes: 235025,
    sha256: '9c7f7ccde4b321088b97e9a87d3a9c16554c57f9430cced2a55041a83e269404'
  }
}

for (const installation of physicalGraph.installations) {
  assert.deepEqual(
    packageTreeDigest(installation.directory),
    expectedPackageTrees[installation.manifest.version],
    `${portableRelative(installation.manifestPath)} differs from the reviewed npm package bytes`
  )
}

function runChildProbe (label, source, args) {
  const probe = spawnSync(process.execPath, [
    '--max-old-space-size=64',
    '-e',
    source,
    ...args
  ], {
    encoding: 'utf8',
    timeout: 5000,
    maxBuffer: 256 * 1024,
    windowsHide: true
  })

  assert.equal(
    probe.error,
    undefined,
    `${label} failed to execute within its resource bound: ${probe.error && probe.error.message}`
  )
  assert.equal(probe.signal, null, `${label} terminated by ${probe.signal}`)
  assert.equal(probe.status, 0, `${label} failed: ${probe.stderr}`)
}

const parserProbeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const json5 = require(process.argv[1])',
  'const manifest = require(process.argv[2])',
  'const expectedVersion = process.argv[3]',
  'assert.equal(manifest.version, expectedVersion)',
  "const marker = 'json5AdvisoryMarker93bf'",
  'const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key)',
  'assert.equal(hasOwn(Object.prototype, marker), false)',
  'assert.equal(({})[marker], undefined)',
  '// This mirrors the ordinary assignment used by vulnerable JSON5 releases.',
  'function historicalMaterialization (withReviver) {',
  '  const result = {}',
  "  result.__proto__ = { [marker]: 'historical' }",
  '  result.safe = true',
  '  if (withReviver) {',
  '    for (const key in result) result[key] = result[key]',
  '  }',
  '  return result',
  '}',
  'for (const withReviver of [false, true]) {',
  '  const historical = historicalMaterialization(withReviver)',
  '  assert.notEqual(Object.getPrototypeOf(historical), Object.prototype)',
  "  assert.equal(Object.getPrototypeOf(historical)[marker], 'historical')",
  "  assert.equal(hasOwn(historical, '__proto__'), false)",
  '  assert.equal(hasOwn(Object.prototype, marker), false)',
  '}',
  'function assertSafePrototypeProperty (value, expectedMarker) {',
  '  assert.equal(Object.getPrototypeOf(value), Object.prototype)',
  "  assert.equal(hasOwn(value, '__proto__'), true)",
  "  const descriptor = Object.getOwnPropertyDescriptor(value, '__proto__')",
  '  assert.equal(descriptor.enumerable, true)',
  '  assert.equal(descriptor.writable, true)',
  '  assert.equal(descriptor.configurable, true)',
  '  assert.equal(Object.getPrototypeOf(descriptor.value), Object.prototype)',
  '  assert.equal(descriptor.value[marker], expectedMarker)',
  '  assert.equal(value[marker], undefined)',
  '  assert.equal(hasOwn(Object.prototype, marker), false)',
  '  assert.equal(({})[marker], undefined)',
  '}',
  'for (const withReviver of [false, true]) {',
  '  const seen = []',
  '  const reviver = withReviver ? function (key, value) { seen.push(key); return value } : undefined',
  "  const root = json5.parse(`{__proto__: {${marker}: 'root'}, safe: 1}`, reviver)",
  "  assertSafePrototypeProperty(root, 'root')",
  "  const nested = json5.parse(`{outer: {__proto__: {${marker}: 'nested'}, safe: 2}}`, reviver)",
  "  assertSafePrototypeProperty(nested.outer, 'nested')",
  '  if (withReviver) assert.ok(seen.includes("__proto__"))',
  '}',
  "for (const mode of ['recreate', 'replace', 'delete']) {",
  '  const seen = []',
  '  const revived = json5.parse(`{__proto__: {${marker}: \'reviver\'}, safe: 3}`, function (key, value) {',
  '    seen.push(key)',
  "    if (key !== '__proto__') return value",
  "    if (mode === 'delete') return undefined",
  '    const original = value',
  '    assert.equal(delete this.__proto__, true)',
  "    assert.equal(hasOwn(this, '__proto__'), false)",
  "    if (mode === 'replace') return { [marker]: 'replacement' }",
  '    return original',
  '  })',
  "  assert.ok(seen.includes('__proto__'))",
  '  assert.equal(Object.getPrototypeOf(revived), Object.prototype)',
  '  assert.equal(hasOwn(Object.prototype, marker), false)',
  '  assert.equal(({})[marker], undefined)',
  "  if (mode === 'delete') {",
  "    assert.equal(hasOwn(revived, '__proto__'), false)",
  '    assert.equal(revived[marker], undefined)',
  '  } else {',
  "    assertSafePrototypeProperty(revived, mode === 'replace' ? 'replacement' : 'reviver')",
  '  }',
  '}',
  'const corpus = json5.parse([',
  "  '{ // comments are valid',",
  "  \"  unquoted: 'value',\",",
  "  '  trailing: [1, 2,],',",
  "  '  hex: 0xdecaf,',",
  "  '  plus: +17,',",
  "  '  leading: .5,',",
  "  '  trailingDecimal: 5.,',",
  "  '  exponent: 6.02e2,',",
  "  '  truth: true,',",
  "  '  empty: null,',",
  "  '  infinity: Infinity,',",
  "  '  notNumber: NaN,',",
  "  \"  escaped: 'line\\\\\\nbreak',\",",
  "  \"  unicode: 'check ✓',\",",
  "  '}',",
  "].join('\\n'))",
  "assert.equal(corpus.unquoted, 'value')",
  'assert.deepEqual(corpus.trailing, [1, 2])',
  'assert.equal(corpus.hex, 0xdecaf)',
  'assert.equal(corpus.plus, 17)',
  'assert.equal(corpus.leading, 0.5)',
  'assert.equal(corpus.trailingDecimal, 5)',
  'assert.equal(corpus.exponent, 602)',
  'assert.equal(corpus.truth, true)',
  'assert.equal(corpus.empty, null)',
  'assert.equal(corpus.infinity, Infinity)',
  'assert.equal(Number.isNaN(corpus.notNumber), true)',
  "assert.equal(corpus.escaped, 'linebreak')",
  "assert.equal(corpus.unicode, 'check ✓')",
  "const revived = json5.parse('{nested: {count: 2}, list: [1, 2, 3]}', function (key, value) {",
  "  if (key === 'count') return value * 3",
  "  if (key === '1') return undefined",
  '  return value',
  '})',
  'assert.equal(revived.nested.count, 6)',
  'assert.equal(revived.list.length, 3)',
  'assert.equal(1 in revived.list, false)',
  'const roundTripInput = {',
  "  alpha: 'text',",
  "  'spaced key': 'value',",
  '  list: [1, true, null],',
  '  nested: { enabled: false },',
  '  notNumber: NaN,',
  '  infinity: Infinity',
  '}',
  'const serialized = json5.stringify(roundTripInput, null, 2)',
  'const roundTrip = json5.parse(serialized)',
  "assert.equal(roundTrip.alpha, 'text')",
  "assert.equal(roundTrip['spaced key'], 'value')",
  'assert.deepEqual(roundTrip.list, [1, true, null])',
  'assert.deepEqual(roundTrip.nested, { enabled: false })',
  'assert.equal(Number.isNaN(roundTrip.notNumber), true)',
  'assert.equal(roundTrip.infinity, Infinity)',
  'const protoRoundTripInput = {}',
  "Object.defineProperty(protoRoundTripInput, '__proto__', {",
  "  value: { [marker]: 'round-trip' },",
  '  writable: true,',
  '  enumerable: true,',
  '  configurable: true',
  '})',
  "assertSafePrototypeProperty(json5.parse(json5.stringify(protoRoundTripInput)), 'round-trip')",
  'const circular = {}',
  'circular.self = circular',
  'assert.throws(() => json5.stringify(circular), /circular/i)',
  'assert.equal(hasOwn(Object.prototype, marker), false)',
  'assert.equal(({})[marker], undefined)'
].join('\n')

for (const installation of physicalGraph.installations) {
  const packageInfo = resolvePackage('json5', installation.directory)
  assert.equal(fs.realpathSync(packageInfo.manifestPath), fs.realpathSync(installation.manifestPath))
  runChildProbe(
    `json5 ${installation.manifest.version} at ${portableRelative(installation.manifestPath)}`,
    parserProbeSource,
    [packageInfo.modulePath, packageInfo.manifestPath, installation.manifest.version]
  )
}

const rootJson5 = resolvePackage('json5', repositoryRoot)
assert.equal(rootJson5.manifest.version, '2.2.2')
assert.equal(portableRelative(rootJson5.manifestPath), 'node_modules/json5/package.json')

const findBabelConfigPackage = resolvePackage('find-babel-config', repositoryRoot)
const babelPackage = resolvePackage('@babel/core', repositoryRoot)
const playwrightPackage = resolvePackage('@playwright/test', repositoryRoot)
const tsJestPackage = resolvePackage('ts-jest', repositoryRoot)
const loaderUtilsPackage = resolvePackage('loader-utils', repositoryRoot)

assert.equal(findBabelConfigPackage.manifest.version, '1.2.0')
assert.equal(findBabelConfigPackage.manifest.dependencies.json5, '^0.5.1')
assert.equal(babelPackage.manifest.version, '7.16.12')
assert.equal(babelPackage.manifest.dependencies.json5, '^2.1.2')
assert.equal(playwrightPackage.manifest.version, '1.19.1')
assert.equal(playwrightPackage.manifest.dependencies.json5, '2.2.0')
assert.equal(tsJestPackage.manifest.version, '27.1.3')
assert.equal(tsJestPackage.manifest.dependencies.json5, '2.x')
assert.equal(loaderUtilsPackage.manifest.version, '1.4.2')
assert.equal(loaderUtilsPackage.manifest.dependencies.json5, '^1.0.1')

const fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-json5-'))
try {
  const projectDirectory = path.join(fixtureDirectory, 'project')
  const sourceDirectory = path.join(projectDirectory, 'src')
  fs.mkdirSync(sourceDirectory, { recursive: true })
  fs.writeFileSync(
    path.join(projectDirectory, 'package.json'),
    '{"name":"alphabiz-json5-fixture","private":true}\n'
  )

  const babelConfigPath = path.join(projectDirectory, '.babelrc')
  fs.writeFileSync(babelConfigPath, [
    '{ // JSON5 fixture shared by real Babel consumers',
    "  sourceType: 'script',",
    '  comments: false,',
    '  parserOpts: {',
    '    allowReturnOutsideFunction: true,',
    '  },',
    '}',
    ''
  ].join('\n'))
  const sourcePath = path.join(sourceDirectory, 'sample.js')
  fs.writeFileSync(sourcePath, 'return 1\n')

  const findBabelConfig = require(findBabelConfigPackage.modulePath)
  const foundBabelConfig = findBabelConfig.sync(sourceDirectory)
  assert.equal(path.resolve(foundBabelConfig.file), path.resolve(babelConfigPath))
  assert.deepEqual(foundBabelConfig.config, {
    sourceType: 'script',
    comments: false,
    parserOpts: { allowReturnOutsideFunction: true }
  })

  const asyncFindProbeSource = [
    "'use strict'",
    "const assert = require('assert').strict",
    "const path = require('path')",
    'const findBabelConfig = require(process.argv[1])',
    'const sourceDirectory = process.argv[2]',
    'const expectedConfigPath = process.argv[3]',
    'process.exitCode = 1',
    'const timeout = setTimeout(() => {',
    "  console.error('find-babel-config async probe timed out')",
    '  process.exit(1)',
    '}, 3000)',
    'findBabelConfig(sourceDirectory).then((result) => {',
    '  assert.equal(path.resolve(result.file), path.resolve(expectedConfigPath))',
    '  assert.deepEqual(result.config, {',
    "    sourceType: 'script',",
    '    comments: false,',
    '    parserOpts: { allowReturnOutsideFunction: true }',
    '  })',
    '  clearTimeout(timeout)',
    '  process.exitCode = 0',
    '}).catch((error) => {',
    '  clearTimeout(timeout)',
    '  console.error(error)',
    '  process.exitCode = 1',
    '})'
  ].join('\n')
  runChildProbe(
    'find-babel-config async JSON5 consumer',
    asyncFindProbeSource,
    [findBabelConfigPackage.modulePath, sourceDirectory, babelConfigPath]
  )

  const babel = require(babelPackage.modulePath)
  const babelOptions = babel.loadOptions({
    cwd: projectDirectory,
    root: projectDirectory,
    filename: sourcePath,
    babelrc: true,
    configFile: false
  })
  assert.equal(babelOptions.sourceType, 'script')
  assert.equal(babelOptions.comments, false)
  assert.equal(babelOptions.parserOpts.allowReturnOutsideFunction, true)
  assert.equal(path.resolve(babelOptions.filename), path.resolve(sourcePath))

  const baseTsconfigPath = path.join(projectDirectory, 'tsconfig.base.json')
  const tsconfigPath = path.join(projectDirectory, 'tsconfig.json')
  fs.writeFileSync(baseTsconfigPath, [
    '{',
    '  compilerOptions: {',
    "    baseUrl: 'base-src',",
    "    paths: { '@fixture/*': ['lib/*'], },",
    '  },',
    '}',
    ''
  ].join('\n'))
  fs.writeFileSync(tsconfigPath, `\uFEFF${[
    '{ // Playwright must accept BOM, comments, and trailing commas',
    "  extends: './tsconfig.base',",
    '  compilerOptions: {',
    '    strict: true,',
    "    baseUrl: 'src',",
    '  },',
    '}',
    ''
  ].join('\n')}`)

  const playwrightTsconfigLoaderPath = path.join(
    playwrightPackage.directory,
    'lib',
    'third_party',
    'tsconfig-loader.js'
  )
  assert.equal(fs.existsSync(playwrightTsconfigLoaderPath), true)
  const { loadTsconfig } = require(playwrightTsconfigLoaderPath)
  const loadedTsconfig = loadTsconfig(tsconfigPath)
  assert.equal(loadedTsconfig.extends, './tsconfig.base')
  assert.equal(loadedTsconfig.compilerOptions.baseUrl, 'src')
  assert.equal(loadedTsconfig.compilerOptions.strict, true)
  assert.deepEqual(loadedTsconfig.compilerOptions.paths, {
    '@fixture/*': ['lib/*']
  })

  const tsJestConfigSetPath = path.join(tsJestPackage.directory, 'dist', 'config', 'config-set.js')
  assert.equal(fs.existsSync(tsJestConfigSetPath), true)
  const { ConfigSet } = require(tsJestConfigSetPath)
  const tsJestContext = {
    cwd: projectDirectory,
    logger: { debug () {} },
    resolvedTransformers: { before: [], after: [], afterDeclarations: [] },
    resolvePath (inputPath) {
      return path.resolve(this.cwd, inputPath)
    },
    _getAndResolveTsConfig () {
      return { errors: [], options: {}, raw: {} }
    },
    raiseDiagnostics () {}
  }
  ConfigSet.prototype._setupConfigSet.call(tsJestContext, {
    babelConfig: babelConfigPath,
    diagnostics: false
  })
  assert.equal(tsJestContext.babelConfig.sourceType, 'script')
  assert.equal(tsJestContext.babelConfig.comments, false)
  assert.equal(tsJestContext.babelConfig.parserOpts.allowReturnOutsideFunction, true)
  assert.equal(typeof tsJestContext.babelJestTransformer.process, 'function')

  const loaderUtils = require(loaderUtilsPackage.modulePath)
  assert.deepEqual(
    loaderUtils.parseQuery("?{mode: 'strict', nested: {enabled: true,}, list: [1, 2,],}"),
    { mode: 'strict', nested: { enabled: true }, list: [1, 2] }
  )
  const loaderMarker = 'loaderUtilsJson5Marker93bf'
  const loaderResult = loaderUtils.parseQuery(`?{__proto__: {${loaderMarker}: true}, safe: 1}`)
  assert.equal(Object.getPrototypeOf(loaderResult), Object.prototype)
  assert.equal(Object.prototype.hasOwnProperty.call(loaderResult, '__proto__'), true)
  assert.equal(loaderResult.__proto__[loaderMarker], true)
  assert.equal(loaderResult[loaderMarker], undefined)
  assert.equal(Object.prototype[loaderMarker], undefined)
} finally {
  fs.rmSync(fixtureDirectory, { recursive: true, force: true })
}

assert.equal(fs.existsSync(fixtureDirectory), false, 'JSON5 consumer fixture was not cleaned up')

console.log('[json5] Frozen 1.x/2.x graphs preserve parser consumers and own-property __proto__ safety.')
