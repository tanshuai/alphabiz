'use strict'

const assert = require('assert').strict
const crypto = require('crypto')
const { inherits } = require('util')

const expectedVersions = {
  'cipher-base': '1.0.6',
  elliptic: '6.6.1',
  pbkdf2: '3.1.3',
  'sha.js': '2.4.12'
}

for (const [name, expectedVersion] of Object.entries(expectedVersions)) {
  const observedVersion = require(`${name}/package.json`).version
  assert.equal(observedVersion, expectedVersion, `${name} resolved to ${observedVersion}`)
}

const CipherBase = require('cipher-base')

function IdentityCipher () {
  CipherBase.call(this)
}

inherits(IdentityCipher, CipherBase)
IdentityCipher.prototype._update = input => input
IdentityCipher.prototype._final = () => undefined

const identityInput = Buffer.from('alphabiz-crypto-transitive-regression')
const identityCipher = new IdentityCipher()
const identityOutput = Buffer.concat([
  identityCipher.update(identityInput),
  identityCipher.final()
])
assert.deepEqual(identityOutput, identityInput)

const viewBacking = Uint8Array.from([
  0x00, 0x01, 0x7f, 0x80, 0xfe, 0xff, 0x10, 0x20,
  0x30, 0x40, 0x50, 0x60, 0x70, 0x81, 0x91, 0xa1
]).buffer
const binaryViews = [
  new Uint16Array(viewBacking, 0, 4),
  new Uint32Array(viewBacking, 4, 2),
  new DataView(viewBacking, 3, 9)
]

function viewBytes (view) {
  return Buffer.from(view.buffer, view.byteOffset, view.byteLength)
}

for (const view of binaryViews) {
  const cipher = new IdentityCipher()
  const observed = Buffer.concat([cipher.update(view), cipher.final()])
  assert.deepEqual(observed, viewBytes(view), 'cipher-base truncated or reinterpreted a typed-array view')
}

const Sha = require('sha.js')
const hashInputs = [
  Buffer.alloc(0),
  Buffer.from('abc'),
  Buffer.from('AlphaBiz deterministic crypto regression')
]

for (const algorithm of ['sha1', 'sha224', 'sha256', 'sha384', 'sha512']) {
  for (const input of hashInputs) {
    const expected = crypto.createHash(algorithm).update(input).digest('hex')
    const observed = Sha(algorithm).update(input).digest('hex')
    assert.equal(observed, expected, `${algorithm} mismatch`)
  }
}

for (const view of binaryViews) {
  const expected = crypto.createHash('sha256').update(viewBytes(view)).digest('hex')
  const observed = Sha('sha256').update(view).digest('hex')
  assert.equal(observed, expected, 'sha.js truncated or reinterpreted a typed-array view')
}

for (const malformedInput of [{ length: -3 }, { length: '1e99' }]) {
  assert.throws(
    () => new IdentityCipher().update(malformedInput),
    TypeError,
    'cipher-base accepted a crafted length object'
  )
  assert.throws(
    () => Sha('sha256').update(malformedInput),
    TypeError,
    'sha.js accepted a crafted length object'
  )
}

const createHash = require('create-hash')
const createHmac = require('create-hmac')
const integrationInput = Buffer.from('AlphaBiz browser crypto integration')
const hmacKey = Buffer.from('synthetic-test-key')
assert.equal(
  createHash('sha256').update(integrationInput).digest('hex'),
  crypto.createHash('sha256').update(integrationInput).digest('hex')
)
assert.equal(
  createHmac('sha256', hmacKey).update(integrationInput).digest('hex'),
  crypto.createHmac('sha256', hmacKey).update(integrationInput).digest('hex')
)

const pbkdf2Node = require('pbkdf2')
const pbkdf2Browser = require('pbkdf2/browser')
const pbkdf2Implementations = [pbkdf2Node, pbkdf2Browser]
const pbkdf2Vectors = [
  { password: 'password', salt: 'salt', iterations: 1, keyLength: 20, digest: 'sha1' },
  { password: 'password', salt: 'salt', iterations: 4096, keyLength: 32, digest: 'sha256' },
  { password: 'AlphaBiz', salt: 'synthetic-salt', iterations: 1024, keyLength: 48, digest: 'sha512' }
]

for (const vector of pbkdf2Vectors) {
  const args = [
    Buffer.from(vector.password),
    Buffer.from(vector.salt),
    vector.iterations,
    vector.keyLength,
    vector.digest
  ]
  const expected = crypto.pbkdf2Sync(...args)
  for (const implementation of pbkdf2Implementations) {
    assert.deepEqual(implementation.pbkdf2Sync(...args), expected)
  }
}

const typedPassword = Uint8Array.from([1, 2, 3])
const typedSalt = Uint8Array.from([1, 3, 4])
const typedArgs = [typedPassword, typedSalt, 1024, 32, 'sha256']
const typedExpected = crypto.pbkdf2Sync(...typedArgs)
for (const implementation of pbkdf2Implementations) {
  assert.deepEqual(
    implementation.pbkdf2Sync(...typedArgs),
    typedExpected,
    'pbkdf2 ignored typed-array password or salt bytes'
  )
}

for (const digest of ['Sha256', 'sha-256']) {
  const args = ['secret', 'salt', 64, 32, digest]
  assert.deepEqual(
    pbkdf2Browser.pbkdf2Sync(...args),
    crypto.pbkdf2Sync(...args),
    `pbkdf2 browser digest normalization failed for ${digest}`
  )
}

assert.throws(
  () => pbkdf2Browser.pbkdf2Sync('secret', 'salt', 64, 32, 'sha3-256'),
  /not supported/i,
  'pbkdf2 browser silently returned predictable output for an unsupported digest'
)

const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const signingKey = ec.keyFromPrivate('1'.padStart(64, '0'), 'hex')
const messageDigest = crypto.createHash('sha256').update('AlphaBiz elliptic regression').digest()
const signature = signingKey.sign(messageDigest, { canonical: true })
const publicKey = ec.keyFromPublic(signingKey.getPublic())
assert.equal(publicKey.verify(messageDigest, signature), true)

const changedDigest = Buffer.from(messageDigest)
changedDigest[0] ^= 0xff
assert.equal(publicKey.verify(changedDigest, signature), false)

assert.throws(
  () => signingKey.sign(`-${'01'.repeat(32)}`),
  /negative message/i,
  'elliptic accepted a malformed negative signing input'
)

function deriveAsync (implementation, args, label) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`${label} async PBKDF2 callback did not complete`))
    }, 5000)

    try {
      implementation.pbkdf2(...args, (error, observed) => {
        clearTimeout(timeout)
        if (error) reject(error)
        else resolve(observed)
      })
    } catch (error) {
      clearTimeout(timeout)
      reject(error)
    }
  })
}

async function runAsyncRegressions () {
  const args = [
    Buffer.from('async-password'),
    Buffer.from('async-salt'),
    512,
    32,
    'sha256'
  ]
  const expected = crypto.pbkdf2Sync(...args)

  assert.deepEqual(await deriveAsync(pbkdf2Node, args, 'node'), expected)
  assert.deepEqual(await deriveAsync(pbkdf2Browser, args, 'browser'), expected)
}

runAsyncRegressions()
  .then(() => {
    console.log('[crypto-transitives] Version and exploit-boundary regressions passed.')
  })
  .catch((error) => {
    console.error(error.stack || error)
    process.exitCode = 1
  })
