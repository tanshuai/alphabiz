#!/usr/bin/env node
// Parse environment variables for building and packaging

const appConfig = require('../../developer/app')
const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const { resolve } = require('path')

const publicVersion = require('../../public/version.json').version
const targetPlatform = process.argv.includes('--darwin') ? 'darwin' : 'mas'

const envs = [
  `APP="${appConfig.displayName}"`,
  `BUILD_PLATFORM="${targetPlatform}"`,
  `PLATFORM="mas"`,
  `VERSION="${publicVersion}"`
]

const identities = execSync('security find-identity -v').toString()

const devId = identities.split('\n').find(i => i.includes('Apple Distribution'))
if (devId) {
  const identity = devId.substring(devId.indexOf('"')).replace(/"/g, '')
  envs.push(`APPLE_DISTRIBUTION_KEY="${identity}"`)
} else {
  console.warn(`Cannot find any "Apple Distribution" certificate in your identities.`)
}
const installId = identities.split('\n').find(i => i.includes('3rd Party Mac Developer Installer'))
if (installId) {
  const identity = installId.substring(installId.indexOf('"')).replace(/"/g, '')
  envs.push(`APPLE_INSTALLER_KEY="${identity}"`)
} else {
  console.warn(`Cannot find any "3rd Party Mac Developer Installer" certificate in your identities.`)
}
writeFileSync(resolve(__dirname, '.env'), envs.join('\n'))
console.log(`Generated env file at ${resolve(__dirname, '.env')}`)
console.log('You can check and append contents in this file to the .env file in root directory.')
