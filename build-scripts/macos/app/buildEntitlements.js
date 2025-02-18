const { existsSync, readFileSync, writeFileSync } = require('fs')
const { tmpdir } = require('os')
const { resolve } = require('path')
const app = require('../../../developer/app')
const identifier = app.appIdentifier
const teamId = process.env.TEAM_ID || app.appleTeamId
const fullIdentifier = teamId + '.' + identifier

const toReplace = { identifier, teamId, fullIdentifier }

const entitlements = ['mas', 'inherit', 'loginhelper']

const buildEntitlements = async (dist = '') => {
  console.log('build to', dist)
  entitlements.forEach(name => {
    console.log('Building', name)
    const src = resolve(__dirname, `entitlements.${name}.plist`)
    const dest = resolve(dist, `entitlements.${name}.plist`)
    let info = readFileSync(src, 'utf-8')
    for (const key in toReplace) {
      while (info.includes(`{{${key}}}`)) {
        info = info.replace(`{{${key}}}`, toReplace[key])
      }
    }
    writeFileSync(dest, info, 'utf-8')
  })
}

let dist = ''
if (process.argv[2] && existsSync(process.argv[2])) {
  dist = process.argv[2]
} else {
  console.warn('Warn: dist not be specified or not exists.')
  dist = resolve(tmpdir(), 'electron-build/entitlements')
}
buildEntitlements(dist)
