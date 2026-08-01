const { lstatSync, readFileSync, realpathSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const app = require('../../../developer/app')
const identifier = app.appIdentifier
const teamId = process.env.TEAM_ID || app.appleTeamId
const fullIdentifier = teamId + '.' + identifier

const toReplace = { identifier, teamId, fullIdentifier }

const buildEntitlements = (dist = '', isPkg = false) => {
  const entitlements = ['mas', 'inherit', 'loginhelper']
  if (isPkg) {
    console.log('Is PKG')
    entitlements[0] = ''
  }
  console.log('build to', dist)
  entitlements.forEach(name => {
    console.log('Building', name)
    const src = name
      ? resolve(__dirname, `entitlements.${name}.plist`)
      : resolve(__dirname, `entitlements.plist`)
    const dest = name ?
      resolve(dist, `entitlements.${name}.plist`) :
      resolve(dist, `entitlements.mas.plist`)
    let info = readFileSync(src, 'utf-8')
    for (const key in toReplace) {
      while (info.includes(`{{${key}}}`)) {
        info = info.replace(`{{${key}}}`, toReplace[key])
      }
    }
    writeFileSync(dest, info, {
      encoding: 'utf-8',
      flag: 'wx',
      mode: 0o600
    })
  })
}

if (!process.argv[2]) {
  throw new Error('A freshly-created entitlements directory is required')
}
const requestedDist = process.argv[2]
const requestedDistStat = lstatSync(requestedDist)
if (requestedDistStat.isSymbolicLink() || !requestedDistStat.isDirectory()) {
  throw new Error('Entitlements output must be a real directory')
}
const dist = realpathSync(requestedDist)
buildEntitlements(dist, process.argv.includes('--pkg'))
