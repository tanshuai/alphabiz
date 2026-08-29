'use strict'

const assert = require('assert').strict
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

function picomatchDependency (block) {
  const matches = [...block.matchAll(/\n    picomatch (?:"([^"]+)"|(\S+))/g)]
  assert.ok(
    matches.length <= 1,
    `${normalizedHeader(block)} declares picomatch more than once`
  )
  if (matches.length === 0) return undefined
  return matches[0][1] || matches[0][2]
}

const expectedLock = {
  header: 'picomatch@^2.0.4, picomatch@^2.2.1, picomatch@^2.2.3:',
  version: '2.3.2',
  resolved: 'https://registry.yarnpkg.com/picomatch/-/picomatch-2.3.2.tgz#5a942915e26b372dc0f0e6753149a16e6b1c5601',
  integrity: 'sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA=='
}

const picomatchBlocks = lockBlocks.filter((block) =>
  selectorsFor(block).some((selector) => selector.startsWith('picomatch@'))
)

assert.equal(picomatchBlocks.length, 1, 'Unexpected picomatch lock block count')
assert.equal(normalizedHeader(picomatchBlocks[0]), expectedLock.header)
assert.equal(lockValue(picomatchBlocks[0], 'version'), expectedLock.version)
assert.equal(lockValue(picomatchBlocks[0], 'resolved'), expectedLock.resolved)
assert.equal(lockValue(picomatchBlocks[0], 'integrity'), expectedLock.integrity)

for (const dependencyGroup of [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]) {
  assert.equal(
    rootManifest[dependencyGroup] && rootManifest[dependencyGroup].picomatch,
    undefined,
    `Root ${dependencyGroup} must not add a direct picomatch pin`
  )
}

const picomatchResolutions = Object.keys(rootManifest.resolutions || {}).filter((resolution) => {
  const finalSegment = resolution.replace(/\\/g, '/').split('/').pop()
  return /^picomatch(?:@|$)/.test(finalSegment)
})
assert.deepEqual(
  picomatchResolutions,
  [],
  'picomatch must remain a compatible transitive update without a resolution override'
)

const expectedConsumerLocks = [
  { header: 'anymatch@^3.0.3:', version: '3.1.2', range: '^2.0.4' },
  { header: 'anymatch@~3.1.2:', version: '3.1.3', range: '^2.0.4' },
  { header: 'jest-util@^27.0.0, jest-util@^27.5.1:', version: '27.5.1', range: '^2.2.3' },
  { header: 'micromatch@^4.0.2, micromatch@^4.0.4:', version: '4.0.4', range: '^2.2.3' },
  { header: 'readdirp@~3.6.0:', version: '3.6.0', range: '^2.2.1' }
]

for (const expected of expectedConsumerLocks) {
  const block = lockBlocks.find((candidate) => normalizedHeader(candidate) === expected.header)
  assert.ok(block, `Missing picomatch consumer: ${expected.header}`)
  assert.equal(lockValue(block, 'version'), expected.version)
  assert.equal(
    picomatchDependency(block),
    expected.range,
    `${expected.header} changed its picomatch selector`
  )
}

const expectedConsumerEdges = [
  'anymatch@^3.0.3 -> ^2.0.4',
  'anymatch@~3.1.2 -> ^2.0.4',
  'jest-util@^27.0.0 -> ^2.2.3',
  'jest-util@^27.5.1 -> ^2.2.3',
  'micromatch@^4.0.2 -> ^2.2.3',
  'micromatch@^4.0.4 -> ^2.2.3',
  'readdirp@~3.6.0 -> ^2.2.1'
].sort()

const actualConsumerEdges = lockBlocks.flatMap((block) => {
  const dependency = picomatchDependency(block)
  if (!dependency) return []
  return selectorsFor(block).map((selector) => `${selector} -> ${dependency}`)
}).sort()

assert.deepEqual(
  actualConsumerEdges,
  expectedConsumerEdges,
  'The picomatch consumer graph changed; review every new or removed edge'
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
    if (manifest.name === 'picomatch') {
      graph.installations.push({ directory: packageDirectory, manifest, manifestPath })
    }

    const declarations = [
      'dependencies',
      'optionalDependencies',
      'peerDependencies'
    ].flatMap((dependencyGroup) => {
      const dependencies = manifest[dependencyGroup] || {}
      if (!Object.prototype.hasOwnProperty.call(dependencies, 'picomatch')) return []
      return [{ dependencyGroup, range: dependencies.picomatch }]
    })

    assert.ok(
      declarations.length <= 1,
      `${portableRelative(manifestPath)} declares picomatch in multiple dependency groups`
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
physicalGraph.installations.sort((left, right) => left.manifestPath.localeCompare(right.manifestPath))
physicalGraph.consumers.sort((left, right) => left.manifestPath.localeCompare(right.manifestPath))

const actualPhysicalInstallations = physicalGraph.installations.map((installation) =>
  `${portableRelative(installation.manifestPath)} -> ${installation.manifest.version}`
)
assert.deepEqual(
  actualPhysicalInstallations,
  ['node_modules/picomatch/package.json -> 2.3.2'],
  'Unexpected physical picomatch installation entered node_modules'
)

const canonicalPicomatch = physicalGraph.installations[0]
const canonicalPicomatchManifest = fs.realpathSync(canonicalPicomatch.manifestPath)

const actualPhysicalConsumers = physicalGraph.consumers.map((consumer) => {
  const resolvedManifest = require.resolve('picomatch/package.json', {
    paths: [consumer.directory]
  })
  const resolvedModule = require.resolve('picomatch', { paths: [consumer.directory] })
  const resolvedDirectory = path.dirname(resolvedManifest)
  const relativeModule = path.relative(resolvedDirectory, resolvedModule)

  assert.equal(
    fs.realpathSync(resolvedManifest),
    canonicalPicomatchManifest,
    `${portableRelative(consumer.manifestPath)} resolves a different picomatch copy`
  )
  assert.ok(
    relativeModule && !relativeModule.startsWith(`..${path.sep}`) && !path.isAbsolute(relativeModule),
    `${portableRelative(consumer.manifestPath)} resolves picomatch outside its package directory`
  )

  return [
    `${portableRelative(consumer.manifestPath)} ->`,
    `${consumer.manifest.name}@${consumer.manifest.version} ->`,
    `picomatch@${consumer.range} ->`,
    `${portableRelative(resolvedManifest)}@${canonicalPicomatch.manifest.version}`
  ].join(' ')
}).sort()

const expectedPhysicalConsumers = [
  'node_modules/anymatch/package.json -> anymatch@3.1.2 -> picomatch@^2.0.4 -> node_modules/picomatch/package.json@2.3.2',
  'node_modules/jest-util/package.json -> jest-util@27.5.1 -> picomatch@^2.2.3 -> node_modules/picomatch/package.json@2.3.2',
  'node_modules/micromatch/package.json -> micromatch@4.0.4 -> picomatch@^2.2.3 -> node_modules/picomatch/package.json@2.3.2'
].sort()

assert.deepEqual(
  actualPhysicalConsumers,
  expectedPhysicalConsumers,
  'Unexpected physical picomatch consumer entered node_modules'
)

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

const picomatchPackage = resolvePackage('picomatch', repositoryRoot)
assert.equal(picomatchPackage.manifest.version, expectedLock.version)
assert.equal(fs.realpathSync(picomatchPackage.manifestPath), canonicalPicomatchManifest)

function runChildProbe (label, source, args) {
  const probe = spawnSync(process.execPath, [
    '--max-old-space-size=64',
    '-e',
    source,
    ...args
  ], {
    encoding: 'utf8',
    timeout: 2000,
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

const extglobExpectations = [
  {
    pattern: '+(+(a))',
    source: '^(?:\\+\\(\\+\\(a\\)\\))$',
    accepted: ['+(+(a))'],
    rejected: ['a', 'aa']
  },
  {
    pattern: '+(a|aa)',
    source: '^(?:\\+\\(a\\|aa\\))$',
    accepted: ['+(a|aa)'],
    rejected: ['a', 'aa']
  },
  {
    pattern: '+(a|)',
    source: '^(?:\\+\\(a\\|\\))$',
    accepted: ['+(a|)'],
    rejected: ['', 'a']
  },
  {
    pattern: '+(*|a)',
    source: '^(?:\\+\\(\\*\\|a\\))$',
    accepted: ['+(*|a)'],
    rejected: ['*', 'a']
  },
  {
    pattern: '+(*(a)*(b))',
    source: '^(?:(?=.)[ab]*)$',
    accepted: ['a', 'b', 'ab', 'abba'],
    rejected: ['', 'c']
  },
  {
    pattern: '*(+(a))',
    source: '^(?:\\*\\(\\+\\(a\\)\\))$',
    accepted: ['*(+(a))'],
    rejected: ['a', 'aa']
  }
]

const extglobProbeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const picomatch = require(process.argv[1])',
  'const expectations = JSON.parse(process.argv[2])',
  "const boundedSafetyInputs = ['constructor', 'a'.repeat(24) + '!']",
  'assert.ok(expectations.every(({ pattern }) => pattern.length <= 16))',
  'assert.ok(boundedSafetyInputs.every((input) => input.length <= 32))',
  'for (const expectation of expectations) {',
  '  const regex = picomatch.makeRe(expectation.pattern, { windows: false })',
  '  assert.equal(regex.source, expectation.source)',
  '  const matcher = picomatch(expectation.pattern, { windows: false })',
  '  for (const input of expectation.accepted) assert.equal(matcher(input), true)',
  '  for (const input of expectation.rejected) assert.equal(matcher(input), false)',
  '  for (const input of boundedSafetyInputs) assert.equal(matcher(input), false)',
  '  const nativeMatcher = picomatch(expectation.pattern)',
  '  for (const input of boundedSafetyInputs) assert.equal(nativeMatcher(input), false)',
  '}',
  'const positiveControls = [',
  "  { pattern: '+(a|b)', accepted: ['a', 'b', 'ab', 'aa'], rejected: ['c'] },",
  "  { pattern: '*(a|b)', accepted: ['a', 'b', 'ab', 'abba'], rejected: ['', 'c'] },",
  "  { pattern: '+(ab|cd)', accepted: ['ab', 'cd', 'abcd'], rejected: ['ac'] }",
  ']',
  'for (const control of positiveControls) {',
  '  const matcher = picomatch(control.pattern, { windows: false })',
  '  const nativeMatcher = picomatch(control.pattern)',
  '  for (const input of control.accepted) {',
  '    assert.equal(matcher(input), true)',
  '    assert.equal(nativeMatcher(input), true)',
  '  }',
  '  for (const input of control.rejected) {',
  '    assert.equal(matcher(input), false)',
  '    assert.equal(nativeMatcher(input), false)',
  '  }',
  '}',
  "const normalExtglob = picomatch('src/@(api|ui)/*.js', { windows: false })",
  "assert.equal(normalExtglob('src/api/app.js'), true)",
  "assert.equal(normalExtglob('src/ui/view.js'), true)",
  "assert.equal(normalExtglob('src/docs/app.js'), false)"
].join('\n')

runChildProbe('quantified extglob probe', extglobProbeSource, [
  picomatchPackage.modulePath,
  JSON.stringify(extglobExpectations)
])

const posixMethodProbeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const picomatch = require(process.argv[1])',
  'const expectedSource = process.argv[2]',
  "const inheritedNames = ['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__']",
  "const forbiddenFragments = ['function ', 'native code', '[object Object]']",
  'for (const name of inheritedNames) {',
  '  const pattern = `[[:${name}:]]`',
  '  assert.ok(pattern.length <= 32)',
  '  const regex = picomatch.makeRe(pattern, { windows: false })',
  "  if (name === 'constructor') assert.equal(regex.source, expectedSource)",
  '  assert.ok(regex.source.length < 128)',
  '  for (const fragment of forbiddenFragments) {',
  '    assert.equal(regex.source.includes(fragment), false)',
  '  }',
  "  const boundedInputs = [...new Set(['a', 'aa', 'constructor', name])]",
  '  const matcher = picomatch(pattern, { windows: false })',
  '  for (const input of boundedInputs) assert.equal(matcher(input), false)',
  '  const nativeRegex = picomatch.makeRe(pattern)',
  '  assert.ok(nativeRegex.source.length < 128)',
  '  for (const fragment of forbiddenFragments) {',
  '    assert.equal(nativeRegex.source.includes(fragment), false)',
  '  }',
  '  const nativeMatcher = picomatch(pattern)',
  '  for (const input of boundedInputs) assert.equal(nativeMatcher(input), false)',
  '}',
  "const normalPosixClass = picomatch('file-[[:digit:]].txt', { windows: false })",
  "assert.equal(normalPosixClass('file-7.txt'), true)",
  "assert.equal(normalPosixClass('file-a.txt'), false)"
].join('\n')

runChildProbe('POSIX method-name probe', posixMethodProbeSource, [
  picomatchPackage.modulePath,
  '^(?:[[:constructor:]\\])$'
])

const picomatch = require(picomatchPackage.modulePath)
const directMatcher = picomatch('src/{api,ui}/**/*.js', { windows: false })
assert.equal(directMatcher('src/api/app.js'), true)
assert.equal(directMatcher('src/ui/nested/view.js'), true)
assert.equal(directMatcher('src/docs/app.js'), false)
assert.equal(directMatcher('src/api/app.txt'), false)

const anymatchPackage = resolvePackage('anymatch', repositoryRoot)
const micromatchPackage = resolvePackage('micromatch', repositoryRoot)
const jestUtilPackage = resolvePackage('jest-util', repositoryRoot)
const fastGlobPackage = resolvePackage('fast-glob', repositoryRoot)

assert.equal(anymatchPackage.manifest.version, '3.1.2')
assert.equal(anymatchPackage.manifest.dependencies.picomatch, '^2.0.4')
assert.equal(micromatchPackage.manifest.version, '4.0.4')
assert.equal(micromatchPackage.manifest.dependencies.picomatch, '^2.2.3')
assert.equal(jestUtilPackage.manifest.version, '27.5.1')
assert.equal(jestUtilPackage.manifest.dependencies.picomatch, '^2.2.3')
assert.equal(fastGlobPackage.manifest.version, '3.2.11')
assert.equal(fastGlobPackage.manifest.dependencies.micromatch, '^4.0.4')

for (const consumer of [anymatchPackage, micromatchPackage, jestUtilPackage]) {
  assert.equal(
    fs.realpathSync(require.resolve('picomatch/package.json', { paths: [consumer.directory] })),
    canonicalPicomatchManifest,
    `${consumer.manifest.name} did not resolve the frozen picomatch package`
  )
}

const fastGlobMicromatch = resolvePackage('micromatch', fastGlobPackage.directory)
assert.equal(fs.realpathSync(fastGlobMicromatch.manifestPath), fs.realpathSync(micromatchPackage.manifestPath))
assert.equal(
  fs.realpathSync(require.resolve('picomatch/package.json', { paths: [fastGlobMicromatch.directory] })),
  canonicalPicomatchManifest,
  'fast-glob did not reach the frozen picomatch package through micromatch'
)

const anymatch = require(anymatchPackage.modulePath)
const anymatchConsumer = anymatch(['src/**/*.js', '!src/**/*.test.js'])
assert.equal(anymatchConsumer('src/api/app.js'), true)
assert.equal(anymatchConsumer('src/api/app.test.js'), false)
assert.equal(anymatchConsumer('src/api/app.txt'), false)

const micromatch = require(micromatchPackage.modulePath)
assert.deepEqual(
  micromatch(
    ['src/api/app.js', 'src/ui/nested/view.js', 'src/api/app.test.js', 'README.md'],
    ['src/{api,ui}/**/*.js', '!**/*.test.js']
  ),
  ['src/api/app.js', 'src/ui/nested/view.js']
)

const jestUtil = require(jestUtilPackage.modulePath)
assert.equal(typeof jestUtil.globsToMatcher, 'function')
const jestConsumer = jestUtil.globsToMatcher(['**/*.js', '!**/*.test.js'])
assert.equal(jestConsumer('src/api/app.js'), true)
assert.equal(jestConsumer('src/api/app.test.js'), false)
assert.equal(jestConsumer('README.md'), false)

const fastGlob = require(fastGlobPackage.modulePath)
const fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-picomatch-'))
try {
  fs.mkdirSync(path.join(fixtureDirectory, 'src', 'api'), { recursive: true })
  fs.mkdirSync(path.join(fixtureDirectory, 'src', 'ui', 'nested'), { recursive: true })
  fs.writeFileSync(path.join(fixtureDirectory, 'src', 'api', 'app.js'), "'use strict'\n")
  fs.writeFileSync(path.join(fixtureDirectory, 'src', 'api', 'app.test.js'), "'use strict'\n")
  fs.writeFileSync(path.join(fixtureDirectory, 'src', 'ui', 'nested', 'view.js'), "'use strict'\n")
  fs.writeFileSync(path.join(fixtureDirectory, 'README.md'), '# fixture\n')

  assert.deepEqual(
    fastGlob.sync(['src/{api,ui}/**/*.js', '!**/*.test.js'], {
      cwd: fixtureDirectory,
      onlyFiles: true,
      unique: true
    }).sort(),
    ['src/api/app.js', 'src/ui/nested/view.js']
  )
} finally {
  fs.rmSync(fixtureDirectory, { recursive: true, force: true })
}

assert.equal(fs.existsSync(fixtureDirectory), false, 'fast-glob fixture was not cleaned up')

console.log('[picomatch] Frozen graph rejects unsafe extglob/POSIX expansion and preserves real glob consumers.')
