#!/usr/bin/env node
'use strict'

const assert = require('assert')
const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const {
  PATH_ENV,
  PASSWORD_ENV,
  FINGERPRINT_ENV,
  RETIRED_FINGERPRINT,
  getOpenSslCommand,
  getAppxSigningCertificate,
  readCertificateFingerprint
} = require('../../build-scripts/windows/appx/signing-certificate')
const {
  createAppxMakeInvocation,
  isCertificateConfigured,
  parseArguments
} = require('../../build-scripts/windows/appx/make-appx-if-configured')

const environmentNames = [PATH_ENV, PASSWORD_ENV, FINGERPRINT_ENV]
const originalEnvironment = Object.fromEntries(
  environmentNames.map((name) => [name, process.env[name]])
)
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-appx-test-'))
const keyPath = path.join(temporaryDirectory, 'test-key.pem')
const certificatePath = path.join(temporaryDirectory, 'test-cert.pem')
const pfxPath = path.join(temporaryDirectory, 'test-signing.pfx')
const password = 'alphabiz-ci-test-only'
const openssl = getOpenSslCommand()

function clearSigningEnvironment () {
  for (const name of environmentNames) delete process.env[name]
}

function loadForgeConfig () {
  const configPath = require.resolve('../../build-scripts/common/forge.config')
  delete require.cache[configPath]
  return require(configPath)
}

try {
  clearSigningEnvironment()
  assert.strictEqual(getAppxSigningCertificate(), undefined)
  assert.throws(
    () => getAppxSigningCertificate({ required: true }),
    new RegExp(PATH_ENV)
  )

  const makeScriptSource = fs.readFileSync(
    path.resolve(__dirname, '../../build-scripts/common/make.js'),
    'utf-8'
  )
  assert(
    makeScriptSource.includes('ALPHABIZ_REQUIRE_APPX'),
    'make.js must keep the ALPHABIZ_REQUIRE_APPX opt-in for the APPX certificate requirement'
  )

  // The make:win chain ends in make-appx-if-configured.js, which builds a
  // command line from process.argv. Lock its boundary the way
  // test-codeql-hardening.js locks createYarnInvocation.
  assert.deepStrictEqual(
    createAppxMakeInvocation({ runtimePlatform: 'win32', args: ['--arch', 'x64'] }),
    {
      command: 'C:\\Windows\\System32\\cmd.exe',
      args: ['/d', '/s', '/c', 'yarn.cmd', 'make:appx', '--arch', 'x64'],
      options: { shell: false, windowsHide: true }
    }
  )
  assert.deepStrictEqual(
    createAppxMakeInvocation({ runtimePlatform: 'linux' }),
    {
      command: 'yarn',
      args: ['make:appx'],
      options: { shell: false }
    }
  )
  assert.deepStrictEqual(parseArguments([]), [])
  assert.deepStrictEqual(parseArguments(['--arch', 'x64']), ['--arch', 'x64'])
  assert.throws(
    () => parseArguments(['--inspect']),
    /Unsupported argument/
  )
  assert.throws(
    () => parseArguments(['--arch', 'x64;touch-pwned']),
    /Unsupported BUILD_ARCH/
  )
  assert.throws(
    () => parseArguments(['--arch']),
    /--arch requires an architecture value/
  )

  // The skip decision must agree with getAppxSigningCertificate: a
  // fingerprint with no hex digits counts as unconfigured for both.
  assert.strictEqual(isCertificateConfigured({}), false)
  assert.strictEqual(isCertificateConfigured({ [FINGERPRINT_ENV]: 'xxx' }), false)
  assert.strictEqual(isCertificateConfigured({ [PATH_ENV]: '/tmp/cert.pfx' }), true)

  if (process.argv.includes('--forge-config')) {
    const unsignedConfig = loadForgeConfig()
    assert.strictEqual(
      unsignedConfig.makers.some((maker) => maker.name === '@electron-forge/maker-appx'),
      false,
      'APPX maker must not be configured without an approved certificate'
    )
  }

  execFileSync(openssl, [
    'req',
    '-x509',
    '-nodes',
    '-newkey', 'rsa:2048',
    '-sha256',
    '-days', '1',
    '-subj', '/CN=zeeis',
    '-keyout', keyPath,
    '-out', certificatePath
  ], { stdio: 'ignore' })
  execFileSync(openssl, [
    'pkcs12',
    '-export',
    '-in', certificatePath,
    '-inkey', keyPath,
    '-out', pfxPath,
    '-passout', `pass:${password}`
  ], { stdio: 'ignore' })

  const fingerprint = readCertificateFingerprint(pfxPath, password)
  process.env[PATH_ENV] = pfxPath
  process.env[PASSWORD_ENV] = password
  process.env[FINGERPRINT_ENV] = fingerprint

  const signing = getAppxSigningCertificate({
    required: true,
    expectedPublisher: 'CN=zeeis'
  })
  assert.strictEqual(signing.path, fs.realpathSync(pfxPath))
  assert.strictEqual(signing.password, password)
  assert.strictEqual(signing.fingerprint, fingerprint)

  process.env[FINGERPRINT_ENV] = 'A'.repeat(64)
  assert.throws(
    () => getAppxSigningCertificate({ required: true }),
    /does not match/
  )

  process.env[FINGERPRINT_ENV] = RETIRED_FINGERPRINT
  assert.throws(
    () => getAppxSigningCertificate({ required: true }),
    /retired Alphabiz development certificate/
  )

  process.env[FINGERPRINT_ENV] = fingerprint
  assert.throws(
    () => getAppxSigningCertificate({
      required: true,
      expectedPublisher: 'CN=wrong-publisher'
    }),
    /subject does not match/
  )

  if (process.argv.includes('--forge-config')) {
    const signedConfig = loadForgeConfig()
    const appxMaker = signedConfig.makers.find(
      (maker) => maker.name === '@electron-forge/maker-appx'
    )
    assert(appxMaker, 'APPX maker must be present for an approved certificate')
    assert.strictEqual(appxMaker.config.devCert, fs.realpathSync(pfxPath))
    assert.strictEqual(appxMaker.config.certPass, password)
  }

  console.log('[appx-signing] Regression tests passed.')
} finally {
  for (const [name, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
  fs.rmSync(temporaryDirectory, { recursive: true, force: true })
}
