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
    /retired AlphaBiz development certificate/
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
