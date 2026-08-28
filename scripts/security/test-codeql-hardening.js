#!/usr/bin/env node
'use strict'

const assert = require('assert')
const { execFileSync, spawnSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const vm = require('vm')
const {
  createGitRestoreInvocation,
  createYarnInvocation,
  validateBuildTarget
} = require('../../build-scripts/common/command-boundary')
const escapeRegExp = require('../../test/utils/escapeRegExp')

const testRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-codeql-test-'))
const makeScript = path.resolve(__dirname, '../../build-scripts/common/make.js')
const torrentHelperPath = path.resolve(__dirname, '../../public/torrent-file.js')
const webTorrentHtmlPath = path.resolve(__dirname, '../../public/webtorrent.html')
const lzmaWorkerPaths = [
  '../../public/lzma_worker.js',
  '../../dist/spa/lzma_worker.js',
  '../../dist/electron/UnPackaged/lzma_worker.js'
].map(relativePath => path.resolve(__dirname, relativePath))

function loadLzmaMessageHandler (workerPath) {
  let messageHandler
  const workerContext = vm.createContext({
    addEventListener: (type, handler) => {
      if (type === 'message') messageHandler = handler
    },
    importScripts: () => {},
    postMessage: () => {},
    setImmediate,
    setTimeout
  })
  workerContext.self = workerContext
  vm.runInContext(
    fs.readFileSync(workerPath, 'utf-8'),
    workerContext,
    { filename: workerPath, timeout: 5000 }
  )
  assert.strictEqual(typeof messageHandler, 'function')
  return { lzma: workerContext.LZMA, messageHandler }
}

try {
  for (const lzmaWorkerPath of lzmaWorkerPaths) {
    const { lzma, messageHandler } = loadLzmaMessageHandler(lzmaWorkerPath)
    const compressed = Array.from(lzma.compress('AlphaBiz worker smoke', 1))
    assert.strictEqual(lzma.decompress(compressed), 'AlphaBiz worker smoke')
    let actionReads = 0
    const messageData = {}
    Object.defineProperty(messageData, 'action', {
      get: () => {
        actionReads += 1
        return 0
      }
    })
    messageHandler({ origin: 'https://attacker.example', data: messageData })
    messageHandler({ origin: undefined, data: messageData })
    assert.strictEqual(actionReads, 0)
    messageHandler({ origin: '', data: messageData })
    assert.strictEqual(actionReads, 2)
    assert.doesNotThrow(() => messageHandler({ origin: '', data: null }))
  }

  const torrentHelperSource = fs.readFileSync(torrentHelperPath, 'utf-8')
  const rendererContext = vm.createContext({ Buffer, require })
  vm.runInContext(
    torrentHelperSource,
    rendererContext,
    { filename: torrentHelperPath }
  )
  const {
    sanitizeTorrentName,
    saveTorrentByInfoHash,
    saveTorrentByName
  } = rendererContext.alphabizTorrentFile
  assert.strictEqual(typeof saveTorrentByInfoHash, 'function')
  assert.strictEqual(typeof saveTorrentByName, 'function')
  assert(Object.isFrozen(rendererContext.alphabizTorrentFile))
  assert.strictEqual(
    Object.getOwnPropertyDescriptor(rendererContext, 'alphabizTorrentFile').writable,
    false
  )

  const webTorrentHtml = fs.readFileSync(webTorrentHtmlPath, 'utf-8')
  const helperScriptPosition = webTorrentHtml.indexOf('<script src="torrent-file.js"></script>')
  const workerScriptPosition = webTorrentHtml.indexOf('<script src="webtorrent.js" type="module"></script>')
  assert(helperScriptPosition >= 0)
  assert(workerScriptPosition > helperScriptPosition)

  const noFollowFs = {
    ...fs,
    constants: { ...fs.constants, O_NOFOLLOW: 0 }
  }
  const noFollowContext = vm.createContext({
    Buffer,
    require: moduleName => moduleName === 'fs' ? noFollowFs : require(moduleName)
  })
  vm.runInContext(torrentHelperSource, noFollowContext, {
    filename: torrentHelperPath
  })
  const noFollowDirectory = path.join(testRoot, 'no-follow-torrents')
  const noFollowHash = 'c'.repeat(40)
  const noFollowFirstPath = noFollowContext.alphabizTorrentFile.saveTorrentByInfoHash(
    noFollowDirectory,
    noFollowHash,
    'first'
  )
  const noFollowSecondPath = noFollowContext.alphabizTorrentFile.saveTorrentByInfoHash(
    noFollowDirectory,
    noFollowHash,
    'second'
  )
  assert.notStrictEqual(noFollowSecondPath, noFollowFirstPath)
  assert.strictEqual(path.dirname(noFollowSecondPath), fs.realpathSync(noFollowDirectory))
  assert.strictEqual(fs.readFileSync(noFollowFirstPath, 'utf-8'), 'first')
  assert.strictEqual(fs.readFileSync(noFollowSecondPath, 'utf-8'), 'second')

  for (const artifact of [
    'torrent-file.js',
    'webtorrent-preload.js',
    'webtorrent.html',
    'webtorrent.js'
  ]) {
    const canonicalArtifact = fs.readFileSync(
      path.resolve(__dirname, '../../public', artifact)
    )
    for (const packagedDirectory of [
      '../../dist/spa',
      '../../dist/electron/UnPackaged'
    ]) {
      assert.deepStrictEqual(
        fs.readFileSync(path.resolve(__dirname, packagedDirectory, artifact)),
        canonicalArtifact,
        `${artifact} must match the packaged copy in ${packagedDirectory}`
      )
    }
  }

  const torrentDirectory = path.join(testRoot, 'torrents')
  const infoHash = 'a'.repeat(40)
  const torrentContents = Buffer.from('torrent-fixture')
  const torrentPath = saveTorrentByInfoHash(
    torrentDirectory,
    infoHash,
    torrentContents
  )
  assert.strictEqual(path.dirname(torrentPath), fs.realpathSync(torrentDirectory))
  assert.deepStrictEqual(fs.readFileSync(torrentPath), torrentContents)
  if (process.platform !== 'win32') {
    assert.strictEqual(fs.statSync(torrentPath).mode & 0o777, 0o600)
  }
  if (fs.constants.O_NOFOLLOW) {
    assert.strictEqual(
      saveTorrentByInfoHash(torrentDirectory, infoHash, torrentContents),
      torrentPath
    )
    assert.throws(
      () => saveTorrentByInfoHash(torrentDirectory, infoHash, 'different'),
      /different torrent file/
    )
  } else {
    const repeatedPath = saveTorrentByInfoHash(
      torrentDirectory,
      infoHash,
      torrentContents
    )
    assert.notStrictEqual(repeatedPath, torrentPath)
    assert.strictEqual(path.dirname(repeatedPath), fs.realpathSync(torrentDirectory))
    assert.deepStrictEqual(fs.readFileSync(repeatedPath), torrentContents)
    const differentPath = saveTorrentByInfoHash(
      torrentDirectory,
      infoHash,
      'different'
    )
    assert.notStrictEqual(differentPath, torrentPath)
    assert.notStrictEqual(differentPath, repeatedPath)
    assert.strictEqual(fs.readFileSync(differentPath, 'utf-8'), 'different')
  }
  assert.throws(
    () => saveTorrentByInfoHash(torrentDirectory, '../escape', torrentContents),
    /Invalid torrent info hash/
  )

  if (process.platform !== 'win32') {
    const symlinkHash = 'b'.repeat(40)
    const outsidePath = path.join(testRoot, 'outside.torrent')
    fs.writeFileSync(outsidePath, 'outside')
    fs.symlinkSync(
      outsidePath,
      path.join(torrentDirectory, `${symlinkHash}.torrent`)
    )
    assert.throws(
      () => saveTorrentByInfoHash(torrentDirectory, symlinkHash, torrentContents)
    )
    assert.strictEqual(fs.readFileSync(outsidePath, 'utf-8'), 'outside')
  }

  assert.strictEqual(sanitizeTorrentName('../episode'), '__episode')
  assert.strictEqual(sanitizeTorrentName('episode?.mp4.'), 'episode_.mp4')
  assert.strictEqual(sanitizeTorrentName('CON'), '_CON')
  assert.strictEqual(sanitizeTorrentName('lpt1.backup'), '_lpt1.backup')
  assert(Buffer.byteLength(sanitizeTorrentName('剧'.repeat(100)), 'utf-8') <= 200)
  const namedPath = saveTorrentByName(
    torrentDirectory,
    '../../absolute\\escape',
    torrentContents
  )
  assert.strictEqual(path.dirname(namedPath), fs.realpathSync(torrentDirectory))
  assert.deepStrictEqual(fs.readFileSync(namedPath), torrentContents)

  const releasePattern = new RegExp(
    `^${escapeRegExp('alpha.biz+desktop')}-${escapeRegExp('0.4.0-beta.1')}\\.${escapeRegExp('dmg')}$`
  )
  assert(releasePattern.test('alpha.biz+desktop-0.4.0-beta.1.dmg'))
  assert(!releasePattern.test('alphaXbiz+desktop-0.4.0-beta.1.dmg'))
  assert(!releasePattern.test('alpha.biz+desktop-0.4.0-beta.1Xdmg'))

  const entitlementsDirectory = path.join(testRoot, 'entitlements')
  fs.mkdirSync(entitlementsDirectory, { mode: 0o700 })
  execFileSync(process.execPath, [
    path.resolve(__dirname, '../../build-scripts/macos/app/buildEntitlements.js'),
    entitlementsDirectory
  ], { stdio: 'ignore' })
  const entitlementFiles = fs.readdirSync(entitlementsDirectory)
  assert.deepStrictEqual(entitlementFiles.sort(), [
    'entitlements.inherit.plist',
    'entitlements.loginhelper.plist',
    'entitlements.mas.plist'
  ])
  for (const file of entitlementFiles) {
    if (process.platform !== 'win32') {
      assert.strictEqual(
        fs.statSync(path.join(entitlementsDirectory, file)).mode & 0o777,
        0o600
      )
    }
  }
  assert.throws(() => execFileSync(process.execPath, [
    path.resolve(__dirname, '../../build-scripts/macos/app/buildEntitlements.js'),
    entitlementsDirectory
  ], {
    env: {
      ...process.env,
      NODE_OPTIONS: '--unhandled-rejections=warn'
    },
    stdio: 'ignore'
  }))
  assert.throws(() => execFileSync(process.execPath, [
    path.resolve(__dirname, '../../build-scripts/macos/app/buildEntitlements.js')
  ], { stdio: 'ignore' }))

  assert.deepStrictEqual(validateBuildTarget('x64', 'linux'), {
    arch: 'x64',
    platform: 'linux'
  })
  assert.throws(
    () => validateBuildTarget('x64;touch-pwned', 'linux'),
    /Unsupported BUILD_ARCH/
  )
  assert.throws(
    () => validateBuildTarget('x64', '--inspect'),
    /Unsupported BUILD_PLATFORM/
  )
  assert.deepStrictEqual(
    createYarnInvocation({
      arch: 'x64',
      platform: 'win32',
      runtimePlatform: 'win32'
    }),
    {
      command: 'C:\\Windows\\System32\\cmd.exe',
      args: ['/d', '/s', '/c', 'yarn.cmd', 'make:win', '--arch', 'x64'],
      options: { shell: false, windowsHide: true }
    }
  )
  assert.deepStrictEqual(createGitRestoreInvocation(), {
    command: 'git',
    args: [
      'restore',
      '--worktree',
      '--',
      'build-scripts/windows/appx/template.xml',
      'package.json'
    ],
    options: { shell: false }
  })
  if (process.platform === 'win32') {
    const fakeBin = path.join(testRoot, 'fake-bin')
    fs.mkdirSync(fakeBin)
    fs.writeFileSync(
      path.join(fakeBin, 'yarn.cmd'),
      '@echo off\r\necho %*\r\n'
    )
    const invocation = createYarnInvocation({
      arch: 'x64',
      platform: 'win32',
      runtimePlatform: process.platform
    })
    const actualWindowsSpawn = spawnSync(
      invocation.command,
      invocation.args,
      {
        ...invocation.options,
        encoding: 'utf-8',
        env: {
          ...process.env,
          PATH: `${fakeBin};${process.env.PATH || ''}`
        }
      }
    )
    assert.strictEqual(actualWindowsSpawn.status, 0, actualWindowsSpawn.stderr)
    assert.match(actualWindowsSpawn.stdout, /make:win --arch x64/)
  }

  const invalidArchitecture = spawnSync(process.execPath, [makeScript], {
    encoding: 'utf-8',
    env: {
      ...process.env,
      BUILD_ARCH: 'x64;touch-pwned',
      BUILD_PLATFORM: 'linux'
    }
  })
  assert.notStrictEqual(invalidArchitecture.status, 0)
  assert.match(invalidArchitecture.stderr, /Unsupported BUILD_ARCH/)

  const invalidPlatform = spawnSync(process.execPath, [makeScript], {
    encoding: 'utf-8',
    env: {
      ...process.env,
      BUILD_ARCH: 'x64',
      BUILD_PLATFORM: '--inspect'
    }
  })
  assert.notStrictEqual(invalidPlatform.status, 0)
  assert.match(invalidPlatform.stderr, /Unsupported BUILD_PLATFORM/)

  const validBoundary = spawnSync(process.execPath, [makeScript], {
    encoding: 'utf-8',
    env: {
      ...process.env,
      BUILD_ARCH: 'x64',
      BUILD_PLATFORM: 'linux'
    }
  })
  assert.notStrictEqual(validBoundary.status, 0)
  assert.match(validBoundary.stderr, /Require passing --make or --postmake/)
  assert.doesNotMatch(validBoundary.stderr, /Unsupported BUILD_/)

  execFileSync(process.execPath, ['-e', [
    "const assert = require('assert')",
    "const { getminversions } = require('./test/utils/modifyVersion')",
    "getminversions().then(versions => {",
    "  assert.deepStrictEqual(versions, {",
    "    stable: '0.1.0',",
    "    nightly: '0.1.0-nightly-202205301917',",
    "    internal: '0.1.0-internal-202205301821'",
    '  })',
    '})'
  ].join('\n')], {
    cwd: path.resolve(__dirname, '../..'),
    stdio: 'ignore'
  })

  const i18nFixtureRoot = path.join(testRoot, 'i18n')
  const i18nExampleDirectory = path.join(i18nFixtureRoot, 'example')
  const frenchDirectory = path.join(i18nFixtureRoot, 'fr')
  const germanDirectory = path.join(i18nFixtureRoot, 'de')
  const spanishDirectory = path.join(i18nFixtureRoot, 'es')
  fs.mkdirSync(i18nExampleDirectory, { recursive: true })
  fs.mkdirSync(frenchDirectory)
  fs.mkdirSync(germanDirectory)
  fs.mkdirSync(spanishDirectory)
  fs.copyFileSync(
    path.resolve(__dirname, '../../i18n/check.js'),
    path.join(i18nFixtureRoot, 'check.js')
  )
  const exampleTranslations = {
    hello: 'Hello {name}',
    bye: 'Bye'
  }
  fs.writeFileSync(
    path.join(i18nExampleDirectory, 'translations.json'),
    JSON.stringify(exampleTranslations)
  )
  fs.writeFileSync(
    path.join(frenchDirectory, 'translations.json'),
    JSON.stringify({ hello: 'Bonjour {name}', old: 'Old' })
  )
  execFileSync(process.execPath, [
    path.join(i18nFixtureRoot, 'check.js'),
    '--overwrite',
    'fr'
  ], { stdio: 'ignore' })
  assert.deepStrictEqual(
    JSON.parse(fs.readFileSync(path.join(frenchDirectory, 'translations.json'), 'utf-8')),
    { hello: 'Bonjour {name}', bye: 'Bye' }
  )
  execFileSync(process.execPath, [
    path.join(i18nFixtureRoot, 'check.js'),
    '--overwrite',
    'de'
  ], { stdio: 'ignore' })
  assert.deepStrictEqual(
    JSON.parse(fs.readFileSync(path.join(germanDirectory, 'translations.json'), 'utf-8')),
    exampleTranslations
  )
  if (process.platform !== 'win32') {
    assert.strictEqual(
      fs.statSync(path.join(germanDirectory, 'translations.json')).mode & 0o777,
      0o600
    )
    const outsideTranslations = path.join(testRoot, 'outside-translations.json')
    fs.writeFileSync(outsideTranslations, JSON.stringify({ hello: 'Outside' }))
    fs.symlinkSync(
      outsideTranslations,
      path.join(spanishDirectory, 'translations.json')
    )
    const symlinkCheck = spawnSync(process.execPath, [
      path.join(i18nFixtureRoot, 'check.js'),
      '--overwrite',
      'es'
    ], { encoding: 'utf-8' })
    assert.notStrictEqual(symlinkCheck.status, 0)
    assert.deepStrictEqual(
      JSON.parse(fs.readFileSync(outsideTranslations, 'utf-8')),
      { hello: 'Outside' }
    )
  }

  for (const signScript of [
    '../../build-scripts/macos/app/sign.sh',
    '../../build-scripts/macos/pkg/sign.sh'
  ]) {
    const signScriptContents = fs.readFileSync(
      path.resolve(__dirname, signScript),
      'utf-8'
    )
    assert.match(signScriptContents, /mktemp -d/)
    assert.match(signScriptContents, /trap cleanup_entitlements 0/)
    assert.doesNotMatch(signScriptContents, /electron-build-mas\/entitlements/)
  }

  console.log('[codeql-hardening] Regression tests passed.')
} finally {
  fs.rmSync(testRoot, { recursive: true, force: true })
}
