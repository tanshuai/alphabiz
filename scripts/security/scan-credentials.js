#!/usr/bin/env node
'use strict'

const { execFileSync, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const repositoryRoot = path.resolve(__dirname, '../..')
const trackedEntries = execFileSync('git', ['ls-files', '-s', '-z'], {
  cwd: repositoryRoot,
  encoding: 'utf8'
}).split('\0').filter(Boolean).map((entry) => {
  const separator = entry.indexOf('\t')
  const [mode, objectId, stage] = entry.slice(0, separator).split(' ')
  return { mode, objectId, stage, path: entry.slice(separator + 1) }
}).filter((entry) => entry.stage === '0')

const modifiedWorktreePaths = new Set(execFileSync('git', ['diff', '--name-only', '-z'], {
  cwd: repositoryRoot,
  encoding: 'utf8'
}).split('\0').filter(Boolean))

const forbiddenContainer = /\.(?:pfx|p12|pkcs12|p8|pkcs8|ppk|key|jks|keystore)$/i
const forbiddenName = /(?:^|\/)(?:id_rsa|id_dsa|id_ecdsa|id_ed25519)$/i
const pemBegin = '-----' + 'BEGIN '
const privateKeyEnd = 'PRIVATE ' + 'KEY-----'
const privateKeyMarkers = [
  new RegExp(`${pemBegin}(?:RSA |DSA |EC |OPENSSH |ENCRYPTED )?${privateKeyEnd}`),
  new RegExp(`${pemBegin}SSH2 ENCRYPTED ${privateKeyEnd}`),
  new RegExp('PuTTY-User-' + 'Key-File-')
]
const scanBufferBytes = 64 * 1024
const markerOverlapBytes = 256
const maximumDerInspectionBytes = 2 * 1024 * 1024
const findings = []

function containsPrivateKeyMarker (buffer) {
  let offset = 0
  let overlap = ''

  while (offset < buffer.length) {
    const end = Math.min(offset + scanBufferBytes, buffer.length)
    const text = overlap + buffer.subarray(offset, end).toString('latin1')
    if (privateKeyMarkers.some((marker) => marker.test(text))) return true
    overlap = text.slice(-markerOverlapBytes)
    offset = end
  }
  return false
}

function isDerPrivateKey (buffer) {
  if (
    buffer.length < 16 ||
    buffer.length > maximumDerInspectionBytes ||
    buffer[0] !== 0x30
  ) return false

  const result = spawnSync('openssl', ['pkey', '-inform', 'DER', '-noout'], {
    input: buffer,
    stdio: ['pipe', 'ignore', 'ignore'],
    timeout: 5000
  })
  return !result.error && result.status === 0
}

function inspectBuffer (buffer) {
  if (containsPrivateKeyMarker(buffer)) return 'private-key content marker'
  if (isDerPrivateKey(buffer)) return 'DER private-key structure'
  return undefined
}

function inspectFileDescriptor (file, size) {
  if (size <= maximumDerInspectionBytes) {
    const buffer = Buffer.alloc(size)
    const bytesRead = fs.readSync(file, buffer, 0, size, 0)
    return inspectBuffer(buffer.subarray(0, bytesRead))
  }

  const buffer = Buffer.alloc(scanBufferBytes)
  let offset = 0
  let overlap = ''
  while (offset < size) {
    const bytesRead = fs.readSync(file, buffer, 0, buffer.length, offset)
    if (bytesRead === 0) break
    const text = overlap + buffer.subarray(0, bytesRead).toString('latin1')
    if (privateKeyMarkers.some((marker) => marker.test(text))) {
      return 'private-key content marker'
    }
    overlap = text.slice(-markerOverlapBytes)
    offset += bytesRead
  }
  return undefined
}

function readIndexBlob (objectId) {
  return execFileSync('git', ['cat-file', 'blob', objectId], {
    cwd: repositoryRoot,
    encoding: null,
    maxBuffer: 512 * 1024 * 1024
  })
}

for (const entry of trackedEntries) {
  const normalizedPath = entry.path.replace(/\\/g, '/')
  const absolutePath = path.join(repositoryRoot, entry.path)

  if (forbiddenContainer.test(normalizedPath) || forbiddenName.test(normalizedPath)) {
    findings.push({ path: normalizedPath, reason: 'credential container or private-key filename' })
    continue
  }

  let file
  try {
    let reason
    if (entry.mode === '120000' || modifiedWorktreePaths.has(entry.path)) {
      reason = inspectBuffer(readIndexBlob(entry.objectId))
    } else {
      file = fs.openSync(
        absolutePath,
        fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0)
      )
      const metadata = fs.fstatSync(file)
      if (!metadata.isFile()) continue
      reason = inspectFileDescriptor(file, metadata.size)
    }

    if (reason) findings.push({ path: normalizedPath, reason })
  } catch (error) {
    findings.push({
      path: normalizedPath,
      reason: `unable to inspect tracked file safely (${error.code || 'unknown error'})`
    })
  } finally {
    if (file !== undefined) fs.closeSync(file)
  }
}

if (findings.length > 0) {
  console.error('Credential scan failed. Remove the following tracked credential material:')
  for (const finding of findings) {
    console.error(`- ${finding.path} (${finding.reason})`)
  }
  process.exit(1)
}

console.log(`Credential scan passed (${trackedEntries.length} tracked files checked).`)
