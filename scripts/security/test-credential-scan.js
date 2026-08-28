#!/usr/bin/env node
'use strict'

const assert = require('assert')
const { execFileSync, spawnSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const testRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-scan-test-'))
const scannerSource = path.join(__dirname, 'scan-credentials.js')
const pemMarker = '-----' + 'BEGIN RSA ' + 'PRIVATE KEY-----'
const adminRoute = '/development/admin/' + 'query'
const adminCredential = 'to' + "ken: '" + 's'.repeat(9) + "'"

function git (repository, args) {
  execFileSync('git', args, { cwd: repository, stdio: 'ignore' })
}

function createRepository (name) {
  const repository = path.join(testRoot, name)
  const scannerDirectory = path.join(repository, 'scripts/security')
  fs.mkdirSync(scannerDirectory, { recursive: true })
  fs.copyFileSync(scannerSource, path.join(scannerDirectory, 'scan-credentials.js'))
  git(repository, ['init', '--quiet'])
  git(repository, ['add', '--', 'scripts/security/scan-credentials.js'])
  return repository
}

function runScanner (repository) {
  return spawnSync(process.execPath, ['scripts/security/scan-credentials.js'], {
    cwd: repository,
    encoding: 'utf8'
  })
}

function expectRejected (name, prepare) {
  const repository = createRepository(name)
  prepare(repository)
  const result = runScanner(repository)
  assert.notStrictEqual(result.status, 0, `${name} fixture was not rejected`)
}

try {
  const benignRepository = createRepository('benign')
  fs.writeFileSync(path.join(benignRepository, 'README.md'), 'public documentation\n')
  git(benignRepository, ['add', '--', 'README.md'])
  assert.strictEqual(runScanner(benignRepository).status, 0)

  expectRejected('pkcs12-extension', (repository) => {
    fs.writeFileSync(path.join(repository, 'signing.pkcs12'), 'fixture')
    git(repository, ['add', '--', 'signing.pkcs12'])
  })

  expectRejected('pkcs8-extension', (repository) => {
    fs.writeFileSync(path.join(repository, 'signing.pkcs8'), 'fixture')
    git(repository, ['add', '--', 'signing.pkcs8'])
  })

  expectRejected('late-pem-marker', (repository) => {
    const payload = Buffer.concat([
      Buffer.alloc(300 * 1024, 0x61),
      Buffer.from(pemMarker)
    ])
    fs.writeFileSync(path.join(repository, 'late-marker.txt'), payload)
    git(repository, ['add', '--', 'late-marker.txt'])
  })

  expectRejected('hardcoded-admin-token', (repository) => {
    fs.writeFileSync(
      path.join(repository, 'bundle.js'),
      `rest.post('${adminRoute}', { ${adminCredential}, type: 'reg_info' })`
    )
    git(repository, ['add', '--', 'bundle.js'])
  })

  expectRejected('der-private-key', (repository) => {
    const pemPath = path.join(repository, 'temporary.pem')
    const derPath = path.join(repository, 'opaque.der')
    execFileSync('openssl', [
      'genpkey',
      '-algorithm', 'RSA',
      '-pkeyopt', 'rsa_keygen_bits:2048',
      '-out', pemPath
    ], { stdio: 'ignore' })
    execFileSync('openssl', [
      'pkey',
      '-in', pemPath,
      '-outform', 'DER',
      '-out', derPath
    ], { stdio: 'ignore' })
    fs.rmSync(pemPath, { force: true })
    git(repository, ['add', '--', 'opaque.der'])
  })

  expectRejected('staged-content', (repository) => {
    const stagedPath = path.join(repository, 'masked.txt')
    fs.writeFileSync(stagedPath, pemMarker)
    git(repository, ['add', '--', 'masked.txt'])
    fs.writeFileSync(stagedPath, 'benign worktree content\n')
  })

  console.log('[credential-scan] Regression tests passed.')
} finally {
  fs.rmSync(testRoot, { recursive: true, force: true })
}
