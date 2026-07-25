#!/usr/bin/env node
'use strict'

const { execFileSync, spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const mode = process.argv[2]
if (!['open', 'ci'].includes(mode)) {
  console.error('Usage: node test/cypress/run-with-temporary-tls.js <open|ci>')
  process.exit(2)
}

const repositoryRoot = path.resolve(__dirname, '../..')
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-e2e-tls-'))
const certificatePath = path.join(temporaryDirectory, 'localhost.pem')
const keyPath = path.join(temporaryDirectory, 'localhost-key.pem')
const opensslConfigPath = path.join(temporaryDirectory, 'openssl.cnf')

const opensslConfig = `[req]
distinguished_name = subject
x509_extensions = extensions
prompt = no

[subject]
CN = localhost

[extensions]
subjectAltName = @alternate_names
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alternate_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
`

let cleaned = false
function cleanup () {
  if (cleaned) return
  cleaned = true
  fs.rmSync(temporaryDirectory, { recursive: true, force: true })
}

function environmentReference (name) {
  return process.platform === 'win32' ? `"%${name}%"` : `"$${name}"`
}

try {
  fs.writeFileSync(opensslConfigPath, opensslConfig, { mode: 0o600 })
  execFileSync('openssl', [
    'req',
    '-x509',
    '-nodes',
    '-newkey', 'rsa:2048',
    '-sha256',
    '-days', '1',
    '-keyout', keyPath,
    '-out', certificatePath,
    '-config', opensslConfigPath
  ], { stdio: 'inherit' })
  fs.chmodSync(keyPath, 0o600)
  fs.chmodSync(certificatePath, 0o600)
} catch (error) {
  cleanup()
  console.error('[e2e-tls] Unable to generate the temporary localhost certificate.')
  console.error(error.message)
  process.exit(1)
}

const childEnvironment = {
  ...process.env,
  E2E_TEST: 'true',
  START_SERVER_AND_TEST_INSECURE: '1',
  ALPHABIZ_E2E_DIST: path.join(repositoryRoot, 'dist/spa'),
  ALPHABIZ_E2E_CERT: certificatePath,
  ALPHABIZ_E2E_KEY: keyPath,
  ALPHABIZ_E2E_CONFIG: path.join(repositoryRoot, 'test/cypress/cypress-config.json'),
  ALPHABIZ_E2E_SPEC: path.join(repositoryRoot, 'test/cypress/integration/main/**')
}

const serverCommand = [
  'http-server',
  environmentReference('ALPHABIZ_E2E_DIST'),
  ...(mode === 'ci' ? ['--silent'] : []),
  '-S',
  '-C', environmentReference('ALPHABIZ_E2E_CERT'),
  '-K', environmentReference('ALPHABIZ_E2E_KEY')
].join(' ')

const cypressCommand = [
  'cypress',
  mode === 'ci' ? 'run' : 'open',
  '--config-file', environmentReference('ALPHABIZ_E2E_CONFIG'),
  ...(mode === 'ci'
    ? [
        '--spec', environmentReference('ALPHABIZ_E2E_SPEC'),
        '--browser', 'chrome'
      ]
    : [])
].join(' ')

const startTestCommand = process.platform === 'win32' ? 'start-test.cmd' : 'start-test'
const child = spawn(
  startTestCommand,
  [serverCommand, 'https://localhost:8080', cypressCommand],
  {
    cwd: repositoryRoot,
    env: childEnvironment,
    shell: process.platform === 'win32',
    stdio: 'inherit'
  }
)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    if (!child.killed) child.kill(signal)
  })
}

child.once('error', error => {
  cleanup()
  console.error(`[e2e-tls] Unable to start the E2E runner: ${error.message}`)
  process.exitCode = 1
})

child.once('exit', (code, signal) => {
  cleanup()
  if (signal) {
    console.error(`[e2e-tls] E2E runner stopped by ${signal}.`)
    process.exitCode = 1
    return
  }
  process.exitCode = code === null ? 1 : code
})
