'use strict'

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const PATH_ENV = 'ALPHABIZ_APPX_PFX_PATH'
const PASSWORD_ENV = 'ALPHABIZ_APPX_PFX_PASSWORD'
const FINGERPRINT_ENV = 'ALPHABIZ_APPX_CERT_SHA256'
const OPENSSL_ENV = 'ALPHABIZ_OPENSSL_PATH'
const RETIRED_FINGERPRINT = '986AAE60A0B76AD7A28E8BBBBC479B7E8B2564F86A33060513EC350FC22D6035'
const repositoryRoot = path.resolve(__dirname, '../../..')

function isInsideRepository (candidate) {
  const relativePath = path.relative(repositoryRoot, candidate)
  return relativePath === '' || (
    relativePath !== '..' &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  )
}

function normalizeFingerprint (value) {
  return String(value || '').replace(/[^0-9a-f]/gi, '').toUpperCase()
}

function normalizeSubject (value) {
  return String(value || '')
    .replace(/^subject\s*=\s*/i, '')
    .replace(/\s+/g, '')
    .toUpperCase()
}

function getOpenSslCommand () {
  const configuredPath = process.env[OPENSSL_ENV]
  if (configuredPath) {
    if (!path.isAbsolute(configuredPath) || !fs.existsSync(configuredPath)) {
      throw new Error(`[appx-signing] ${OPENSSL_ENV} must be an existing absolute path.`)
    }
    return configuredPath
  }

  if (process.platform === 'win32') {
    const programFiles = process.env.ProgramFiles || 'C:\\Program Files'
    const gitOpenSsl = path.join(programFiles, 'Git', 'usr', 'bin', 'openssl.exe')
    if (fs.existsSync(gitOpenSsl)) return gitOpenSsl
  }
  return 'openssl'
}

function readCertificateMetadata (certificatePath, password) {
  const openssl = getOpenSslCommand()
  const environment = { ...process.env, [PASSWORD_ENV]: password }
  const extract = spawnSync(openssl, [
    'pkcs12',
    '-in', certificatePath,
    '-clcerts',
    '-nokeys',
    '-passin', `env:${PASSWORD_ENV}`
  ], {
    env: environment,
    encoding: null,
    maxBuffer: 4 * 1024 * 1024
  })

  if (extract.error) {
    throw new Error('[appx-signing] OpenSSL is required to verify the signing certificate.')
  }
  if (extract.status !== 0 || !extract.stdout || extract.stdout.length === 0) {
    throw new Error('[appx-signing] Unable to read the PFX certificate with the configured password.')
  }

  const inspect = spawnSync(openssl, [
    'x509',
    '-noout',
    '-fingerprint',
    '-sha256'
  ], {
    input: extract.stdout,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  })

  if (inspect.error || inspect.status !== 0) {
    throw new Error('[appx-signing] Unable to inspect the PFX signing certificate.')
  }

  const fingerprintMatch = inspect.stdout.match(/Fingerprint\s*=\s*([0-9a-f:]+)/i)
  const fingerprint = normalizeFingerprint(fingerprintMatch && fingerprintMatch[1])
  if (fingerprint.length !== 64) {
    throw new Error('[appx-signing] OpenSSL returned an invalid SHA-256 certificate fingerprint.')
  }

  const subjectInspect = spawnSync(openssl, [
    'x509',
    '-noout',
    '-subject',
    '-nameopt', 'RFC2253',
    '-checkend', '0'
  ], {
    input: extract.stdout,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  })
  if (subjectInspect.error || subjectInspect.status !== 0) {
    throw new Error('[appx-signing] The PFX certificate is expired or its validity cannot be verified.')
  }
  const subjectMatch = subjectInspect.stdout.match(/subject\s*=\s*(.+)/i)
  const subject = subjectMatch && subjectMatch[1].trim()
  if (!subject) {
    throw new Error('[appx-signing] OpenSSL returned an invalid certificate subject.')
  }

  return { fingerprint, subject }
}

function readCertificateFingerprint (certificatePath, password) {
  return readCertificateMetadata(certificatePath, password).fingerprint
}

function getAppxSigningCertificate ({ required = false, expectedPublisher } = {}) {
  const configuredPath = process.env[PATH_ENV]
  const password = process.env[PASSWORD_ENV]
  const expectedFingerprint = normalizeFingerprint(process.env[FINGERPRINT_ENV])
  const anyConfigured = Boolean(configuredPath || password || expectedFingerprint)

  if (!anyConfigured && !required) return undefined

  if (!configuredPath) {
    throw new Error(`[appx-signing] ${PATH_ENV} is required.`)
  }
  if (!password) {
    throw new Error(`[appx-signing] ${PASSWORD_ENV} is required and must not be empty.`)
  }
  if (expectedFingerprint.length !== 64) {
    throw new Error(`[appx-signing] ${FINGERPRINT_ENV} must be a SHA-256 certificate fingerprint.`)
  }
  if (expectedFingerprint === RETIRED_FINGERPRINT) {
    throw new Error('[appx-signing] The retired AlphaBiz development certificate is forbidden.')
  }
  if (!path.isAbsolute(configuredPath)) {
    throw new Error(`[appx-signing] ${PATH_ENV} must be an absolute path.`)
  }
  if (!fs.existsSync(configuredPath)) {
    throw new Error('[appx-signing] The configured certificate does not exist.')
  }

  const certificatePath = fs.realpathSync(configuredPath)
  if (!fs.statSync(certificatePath).isFile()) {
    throw new Error('[appx-signing] The configured certificate must be a file.')
  }
  if (path.extname(certificatePath).toLowerCase() !== '.pfx') {
    throw new Error('[appx-signing] The configured certificate must use the .pfx extension.')
  }
  if (isInsideRepository(certificatePath)) {
    throw new Error('[appx-signing] The signing certificate must be stored outside the repository.')
  }

  const metadata = readCertificateMetadata(certificatePath, password)
  const actualFingerprint = metadata.fingerprint
  if (actualFingerprint === RETIRED_FINGERPRINT) {
    throw new Error('[appx-signing] The retired AlphaBiz development certificate is forbidden.')
  }
  if (actualFingerprint !== expectedFingerprint) {
    throw new Error('[appx-signing] The certificate fingerprint does not match the approved fingerprint.')
  }
  if (
    expectedPublisher &&
    normalizeSubject(metadata.subject) !== normalizeSubject(expectedPublisher)
  ) {
    throw new Error('[appx-signing] The certificate subject does not match the configured APPX publisher.')
  }

  return {
    path: certificatePath,
    password,
    fingerprint: actualFingerprint
  }
}

if (require.main === module) {
  try {
    const { publisher } = require('../../../developer/app')
    getAppxSigningCertificate({ required: true, expectedPublisher: publisher })
    console.log('[appx-signing] External signing certificate is configured and verified.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = {
  PATH_ENV,
  PASSWORD_ENV,
  FINGERPRINT_ENV,
  OPENSSL_ENV,
  RETIRED_FINGERPRINT,
  getOpenSslCommand,
  getAppxSigningCertificate,
  normalizeFingerprint,
  normalizeSubject,
  readCertificateMetadata,
  readCertificateFingerprint
}
