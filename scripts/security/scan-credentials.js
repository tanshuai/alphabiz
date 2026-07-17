#!/usr/bin/env node
'use strict'

const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const repositoryRoot = path.resolve(__dirname, '../..')
const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
  cwd: repositoryRoot,
  encoding: 'utf8'
}).split('\0').filter(Boolean)

const forbiddenContainer = /\.(?:pfx|p12|p8|ppk|key|jks|keystore)$/i
const forbiddenName = /(?:^|\/)(?:id_rsa|id_dsa|id_ecdsa|id_ed25519)$/i
const pemBegin = '-----' + 'BEGIN '
const privateKeyEnd = 'PRIVATE ' + 'KEY-----'
const privateKeyMarkers = [
  new RegExp(`${pemBegin}(?:RSA |DSA |EC |OPENSSH |ENCRYPTED )?${privateKeyEnd}`),
  new RegExp(`${pemBegin}SSH2 ENCRYPTED ${privateKeyEnd}`),
  new RegExp('PuTTY-User-' + 'Key-File-')
]
const maximumBytesToInspect = 256 * 1024
const findings = []

for (const trackedFile of trackedFiles) {
  const normalizedPath = trackedFile.replace(/\\/g, '/')
  const absolutePath = path.join(repositoryRoot, trackedFile)

  if (!fs.existsSync(absolutePath) || !fs.lstatSync(absolutePath).isFile()) continue

  if (forbiddenContainer.test(normalizedPath) || forbiddenName.test(normalizedPath)) {
    findings.push({ path: normalizedPath, reason: 'credential container or private-key filename' })
    continue
  }

  const file = fs.openSync(absolutePath, 'r')
  try {
    const buffer = Buffer.alloc(maximumBytesToInspect)
    const bytesRead = fs.readSync(file, buffer, 0, buffer.length, 0)
    const beginning = buffer.subarray(0, bytesRead).toString('utf8')
    if (privateKeyMarkers.some(marker => marker.test(beginning))) {
      findings.push({ path: normalizedPath, reason: 'private-key content marker' })
    }
  } finally {
    fs.closeSync(file)
  }
}

if (findings.length > 0) {
  console.error('Credential scan failed. Remove the following tracked credential material:')
  for (const finding of findings) {
    console.error(`- ${finding.path} (${finding.reason})`)
  }
  process.exit(1)
}

console.log(`Credential scan passed (${trackedFiles.length} tracked files checked).`)
