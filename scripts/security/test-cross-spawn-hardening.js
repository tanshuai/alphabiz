'use strict'

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

let activePhase = 'initialization'
let failureReported = false

function escapeWorkflowData (value) {
  return String(value)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
}

function reportFailure (error) {
  if (failureReported) return
  failureReported = true

  const details = error && error.stack ? error.stack : String(error)
  if (process.env.GITHUB_ACTIONS === 'true') {
    console.error(
      `::error file=scripts/security/test-cross-spawn-hardening.js::${escapeWorkflowData(`cross-spawn gate failed in ${activePhase}:\n${details}`)}`
    )
  } else {
    console.error(error)
  }
  process.exitCode = 1
}

process.once('uncaughtException', reportFailure)
process.once('unhandledRejection', reportFailure)

const repositoryRoot = path.resolve(__dirname, '..', '..')
const rootManifest = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'))
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

const crossSpawnBlocks = lockBlocks.filter((block) =>
  selectorsFor(block).some((selector) => selector.startsWith('cross-spawn@'))
)

activePhase = 'lock graph'
assert.equal(crossSpawnBlocks.length, 2, 'Unexpected cross-spawn lock block count')

const expectedLocks = [
  {
    header: 'cross-spawn@^6.0.0, cross-spawn@^6.0.5:',
    version: '6.0.6',
    resolved: 'https://registry.yarnpkg.com/cross-spawn/-/cross-spawn-6.0.6.tgz#30d0efa0712ddb7eb5a76e1e8721bffafa6b5d57',
    integrity: 'sha512-VqCUuhcd1iB+dsv8gxPttb5iZh/D0iubSP21g36KXdEuf6I5JiioesUVjpCdHV9MZRUfVFlvwtIUyPfxo5trtw=='
  },
  {
    header: 'cross-spawn@^7.0.0, cross-spawn@^7.0.1, cross-spawn@^7.0.2, cross-spawn@^7.0.3:',
    version: '7.0.6',
    resolved: 'https://registry.yarnpkg.com/cross-spawn/-/cross-spawn-7.0.6.tgz#8a58fe78f00dcd70c370451759dfbfaf03e8ee9f',
    integrity: 'sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA=='
  }
]

for (const expected of expectedLocks) {
  const block = crossSpawnBlocks.find((candidate) => normalizedHeader(candidate) === expected.header)
  assert.ok(block, `Missing frozen cross-spawn selector: ${expected.header}`)
  assert.equal(lockValue(block, 'version'), expected.version)
  assert.equal(lockValue(block, 'resolved'), expected.resolved)
  assert.equal(lockValue(block, 'integrity'), expected.integrity)
}

const expectedConsumerEdges = [
  '@electron-forge/maker-appx@^6.0.0-beta.63 -> ^7.0.3',
  '@malept/cross-spawn-promise@^1.0.0 -> ^7.0.1',
  '@malept/cross-spawn-promise@^1.1.0 -> ^7.0.1',
  '@malept/cross-spawn-promise@^2.0.0 -> ^7.0.1',
  'cross-env@^7.0.3 -> ^7.0.1',
  'eslint@^8.7.0 -> ^7.0.2',
  'execa@4.1.0 -> ^7.0.0',
  'execa@5.1.1 -> ^7.0.3',
  'execa@^1.0.0 -> ^6.0.0',
  'execa@^5.0.0 -> ^7.0.3',
  'patch-package@^6.4.7 -> ^6.0.5',
  'yarn-or-npm@^3.0.1 -> ^6.0.5'
].sort()

const actualConsumerEdges = lockBlocks.flatMap((block) => {
  const dependency = block.match(/\n    cross-spawn "([^"]+)"/)
  if (!dependency) return []
  return selectorsFor(block).map((selector) => `${selector} -> ${dependency[1]}`)
}).sort()

activePhase = 'consumer selector graph'
assert.deepEqual(
  actualConsumerEdges,
  expectedConsumerEdges,
  'The cross-spawn selector graph changed; review every new or removed consumer'
)

assert.equal(rootManifest.dependencies['cross-spawn'], undefined)
assert.equal(rootManifest.devDependencies['cross-env'], '^7.0.3')
assert.equal(rootManifest.devDependencies['@electron-forge/maker-appx'], '^6.0.0-beta.63')
assert.equal(rootManifest.devDependencies.eslint, '^8.7.0')
assert.equal(rootManifest.devDependencies['patch-package'], '^6.4.7')

function visitPackage (packageDirectory, installations) {
  const stat = fs.lstatSync(packageDirectory)
  if (!stat.isDirectory() || stat.isSymbolicLink()) return

  const manifestPath = path.join(packageDirectory, 'package.json')
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    if (manifest.name === 'cross-spawn') {
      installations.push({ directory: packageDirectory, manifest, manifestPath })
    }
  }

  const nestedNodeModules = path.join(packageDirectory, 'node_modules')
  if (fs.existsSync(nestedNodeModules)) visitNodeModules(nestedNodeModules, installations)
}

function visitNodeModules (nodeModulesDirectory, installations) {
  for (const entry of fs.readdirSync(nodeModulesDirectory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || !entry.isDirectory()) continue

    const entryPath = path.join(nodeModulesDirectory, entry.name)
    if (entry.name.startsWith('@')) {
      for (const scopedEntry of fs.readdirSync(entryPath, { withFileTypes: true })) {
        if (scopedEntry.isDirectory()) {
          visitPackage(path.join(entryPath, scopedEntry.name), installations)
        }
      }
    } else {
      visitPackage(entryPath, installations)
    }
  }
}

function portableRelative (file) {
  return path.relative(repositoryRoot, file).split(path.sep).join('/')
}

const installations = []
activePhase = 'physical package graph'
visitNodeModules(path.join(repositoryRoot, 'node_modules'), installations)
installations.sort((left, right) => left.manifestPath.localeCompare(right.manifestPath))

const actualPhysicalGraph = installations.map((installation) =>
  `${portableRelative(installation.manifestPath)} -> ${installation.manifest.version}`
).sort()
const expectedPhysicalGraph = [
  'node_modules/cross-spawn/package.json -> 7.0.6',
  'node_modules/execa/node_modules/cross-spawn/package.json -> 6.0.6',
  'node_modules/patch-package/node_modules/cross-spawn/package.json -> 6.0.6',
  'node_modules/yarn-or-npm/node_modules/cross-spawn/package.json -> 6.0.6'
].sort()

assert.deepEqual(
  actualPhysicalGraph,
  expectedPhysicalGraph,
  'Unexpected physical cross-spawn installation entered node_modules'
)

for (const installation of installations) {
  installation.modulePath = require.resolve(installation.directory)
  installation.escapePath = path.join(installation.directory, 'lib', 'util', 'escape.js')
  assert.ok(fs.existsSync(installation.escapePath), `${portableRelative(installation.escapePath)} is missing`)
}

const redosProbeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const escape = require(process.argv[1])',
  "const input = '\\\\'.repeat(80000) + '◎'",
  'const startedAt = Date.now()',
  'const output = escape.argument(input, false)',
  'assert.equal(output.length, 80005)',
  "assert.ok(output.startsWith('^\"'))",
  "assert.ok(output.endsWith('◎^\"'))",
  'assert.ok(Date.now() - startedAt < 1500)'
].join('\n')

activePhase = 'bounded escaping probe'
for (const installation of installations) {
  const probe = spawnSync(process.execPath, [
    '--max-old-space-size=64',
    '-e',
    redosProbeSource,
    installation.escapePath
  ], {
    encoding: 'utf8',
    timeout: 2000
  })

  assert.equal(
    probe.error,
    undefined,
    `${portableRelative(installation.escapePath)} exceeded the bounded ReDoS probe: ${probe.error && probe.error.message}`
  )
  assert.equal(
    probe.status,
    0,
    `${portableRelative(installation.escapePath)} failed the bounded ReDoS probe: ${probe.stderr}`
  )
}

const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g

function legacyEscapeCommand (argument) {
  return argument.replace(metaCharsRegExp, '^$1')
}

function legacyEscapeArgument (argument, doubleEscapeMetaChars) {
  argument = `${argument}`
  argument = argument.replace(/(\\*)"/g, '$1$1\\"')
  argument = argument.replace(/(\\*)$/, '$1$1')
  argument = `"${argument}"`
  argument = argument.replace(metaCharsRegExp, '^$1')
  if (doubleEscapeMetaChars) argument = argument.replace(metaCharsRegExp, '^$1')
  return argument
}

// Keep this compatibility oracle bounded to the argument shapes exercised by
// cross-spawn's own Windows suite. The long hostile slash run is tested above.
const corpus = [
  '',
  'plain',
  '()',
  '[]',
  '%!',
  '^<',
  '>&',
  '|;',
  ', ',
  '!=',
  '\\*',
  '"f"',
  '?.',
  '=`',
  "'",
  '\\"',
  'bar\\',
  '"foo|bar>baz"',
  '"(foo|bar>baz|foz)"',
  '影音-◎'
]

activePhase = 'escaping compatibility corpus'
for (const installation of installations) {
  const escape = require(installation.escapePath)
  for (const argument of corpus) {
    assert.equal(
      escape.command(argument),
      legacyEscapeCommand(argument),
      `${portableRelative(installation.escapePath)} changed command escaping for ${JSON.stringify(argument)}`
    )
    for (const doubleEscape of [false, true]) {
      assert.equal(
        escape.argument(argument, doubleEscape),
        legacyEscapeArgument(argument, doubleEscape),
        `${portableRelative(installation.escapePath)} changed argument escaping for ${JSON.stringify(argument)}`
      )
    }
  }

  for (const argument of [undefined, null, 0, true]) {
    for (const doubleEscape of [false, true]) {
      assert.equal(escape.argument(argument, doubleEscape), legacyEscapeArgument(argument, doubleEscape))
    }
  }
}

const complexArguments = [
  'plain',
  'with space',
  'double"quote',
  'trailing\\',
  'single\\backslash',
  'slashes\\\\before"quote',
  'meta&caret^pipe|percent%bang!',
  'unicode-影音-◎'
]
const argvProbeSource = 'process.stdout.write(JSON.stringify(process.argv.slice(1)))'

function assertSpawnResult (result, expectedArguments, label) {
  assert.ok(!result.error, `${label} could not spawn: ${result.error && result.error.message}`)
  assert.equal(result.status, 0, `${label} exited ${result.status}: ${result.stderr}`)
  assert.deepEqual(JSON.parse(result.stdout), expectedArguments, `${label} changed child arguments`)
}

activePhase = 'direct spawn argument round trip'
for (const installation of installations) {
  const crossSpawn = require(installation.modulePath)
  const result = crossSpawn.sync(process.execPath, [
    '-e',
    argvProbeSource,
    ...complexArguments
  ], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    timeout: 5000
  })
  assertSpawnResult(result, complexArguments, portableRelative(installation.manifestPath))
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

function assertConsumerResolution (consumer, expectedCrossSpawnVersion) {
  const resolved = resolvePackage('cross-spawn', consumer.directory)
  assert.equal(
    resolved.manifest.version,
    expectedCrossSpawnVersion,
    `${consumer.manifest.name}@${consumer.manifest.version} resolves cross-spawn ${resolved.manifest.version}`
  )
  return resolved
}

const crossEnv = resolvePackage('cross-env', repositoryRoot)
activePhase = 'cross-env consumer'
assert.equal(crossEnv.manifest.version, '7.0.3')
const crossEnvCrossSpawn = assertConsumerResolution(crossEnv, '7.0.6')
const crossEnvShim = path.join(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'cross-env.cmd' : 'cross-env'
)
assert.ok(fs.existsSync(crossEnvShim), `Missing cross-env command shim: ${crossEnvShim}`)

const crossEnvArguments = [
  'with space',
  'double"quote',
  'single\\backslash',
  'trailing\\',
  'meta&caret^pipe|percent%bang!',
  'unicode-影音-◎'
]
const crossEnvProbeSource = [
  'process.stdout.write(JSON.stringify({',
  '  value: process.env.ALPHABIZ_CROSS_SPAWN_GATE,',
  '  args: process.argv.slice(1)',
  '}))'
].join('\n')
const crossEnvResult = require(crossEnvCrossSpawn.modulePath).sync(crossEnvShim, [
  'ALPHABIZ_CROSS_SPAWN_GATE=value with spaces',
  process.execPath,
  '-e',
  crossEnvProbeSource,
  ...crossEnvArguments
], {
  cwd: repositoryRoot,
  encoding: 'utf8',
  timeout: 5000
})

assert.ok(!crossEnvResult.error)
assert.equal(crossEnvResult.status, 0, `cross-env consumer failed: ${crossEnvResult.stderr}`)
assert.deepEqual(JSON.parse(crossEnvResult.stdout), {
  value: 'value with spaces',
  args: crossEnvArguments
})

async function assertMaleptConsumer (relativeDirectory, expectedVersion) {
  const consumerDirectory = path.join(repositoryRoot, relativeDirectory)
  const consumer = resolvePackage('@malept/cross-spawn-promise', consumerDirectory)
  assert.equal(consumer.manifest.version, expectedVersion)
  assertConsumerResolution(consumer, '7.0.6')

  const result = await require(consumer.modulePath).spawn(process.execPath, [
    '-e',
    argvProbeSource,
    ...complexArguments
  ], {
    cwd: repositoryRoot,
    timeout: 5000
  })
  assert.deepEqual(JSON.parse(result), complexArguments)
}

function portableCanonicalPath (file) {
  const canonical = fs.realpathSync(file)
  return process.platform === 'win32' ? canonical.toLowerCase() : canonical
}

async function main () {
  activePhase = '@malept/cross-spawn-promise 1.1.1 consumer'
  await assertMaleptConsumer('node_modules/@malept/cross-spawn-promise', '1.1.1')
  activePhase = '@malept/cross-spawn-promise 2.0.0 consumer'
  await assertMaleptConsumer(
    'node_modules/@electron-forge/core/node_modules/@malept/cross-spawn-promise',
    '2.0.0'
  )

  activePhase = 'APPX resolveCommand consumer'
  const makerAppx = resolvePackage('@electron-forge/maker-appx', repositoryRoot)
  assert.equal(makerAppx.manifest.version, '6.0.0-beta.63')
  const makerCrossSpawn = assertConsumerResolution(makerAppx, '7.0.6')
  const makerSourcePath = path.join(makerAppx.directory, 'dist', 'MakerAppX.js')
  const makerSource = fs.readFileSync(makerSourcePath, 'utf8')
  const executableMakerSource = makerSource.split('\n//# sourceMappingURL=', 1)[0]
  assert.ok(
    executableMakerSource.includes('cross-spawn/lib/util/resolveCommand'),
    'APPX maker no longer imports the reviewed cross-spawn resolution boundary'
  )

  const resolveCommandPath = require.resolve('cross-spawn/lib/util/resolveCommand', {
    paths: [makerAppx.directory]
  })
  assert.equal(
    portableRelative(resolveCommandPath),
    portableRelative(path.join(makerCrossSpawn.directory, 'lib', 'util', 'resolveCommand.js'))
  )
  const resolvedNode = require(resolveCommandPath)({
    command: process.execPath,
    options: { cwd: null }
  }, true)
  assert.ok(resolvedNode, 'APPX cross-spawn boundary could not resolve Node.js')
  assert.equal(portableCanonicalPath(resolvedNode), portableCanonicalPath(process.execPath))

  let electronWindowsStorePath
  try {
    electronWindowsStorePath = require.resolve('electron-windows-store', {
      paths: [makerAppx.directory]
    })
  } catch (error) {
    assert.equal(error.code, 'MODULE_NOT_FOUND')
  }

  let appxRuntime = 'static import/resolution only (--ignore-optional omitted electron-windows-store)'
  if (electronWindowsStorePath) {
    const MakerAppX = require(makerAppx.modulePath).default
    const maker = new MakerAppX({ windowsKit: path.dirname(process.execPath) })
    maker.prepareConfig(process.arch)
    assert.equal(maker.name, 'appx')
    assert.deepEqual(maker.defaultPlatforms, ['win32'])
    assert.equal(maker.config.windowsKit, path.dirname(process.execPath))
    assert.equal(maker.isSupportedOnCurrentPlatform(), process.platform === 'win32')
    appxRuntime = 'loaded'
  }

  console.log(
    `[cross-spawn] Locked and exercised 6.0.6/7.0.6; APPX gate: ${appxRuntime}.`
  )
}

main().catch(reportFailure)
