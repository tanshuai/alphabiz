'use strict'

const { exec } = require('child_process')
const fs = require('fs')

const versionJSON = './public/version.json'
const releaseJSON = './release.json'
const releaseObj = require(releaseJSON)

const unpackagedVersionJSON = fs.readFileSync('build/electron/UnPackaged/version.json')
const unpackagedVersionObj = JSON.parse(unpackagedVersionJSON)
const content = {
  packageVer: '',
  channel: '',
  buildTime: '',
  buildCommit: '',
  sourceCommit: '',
  version: ''
}
const getBuildTime = async () => {
  return new Promise((resolve, reject) => {
    let command
    if (process.platform === 'win32') command = 'set TZ=UTC-8 && git log -1 --date=format-local:"%Y%m%d%H%M" --format="%cd"'
    else command = 'TZ=UTC-8 git log -1 --date=format-local:"%Y%m%d%H%M" --format="%cd"'
    exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    if (stderr) {
      console.error(`Error from Git: ${stderr}`)
      return
    }
    resolve(stdout.trim())
    })
  })
}
const getCommit = async () => {
  return new Promise((resolve, reject) => {
    exec('git rev-parse --short HEAD', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      if (stderr) {
        console.error(`Error from Git: ${stderr}`)
        return
      }
    resolve(stdout.trim())
    })
  })
}
const getSourceCommit = async () => {
  return new Promise((resolve, reject) => {
    exec('git log -1 --pretty=%B --author=Alphabiz-Team', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      if (stderr) {
        console.error(`Error from Git: ${stderr}`)
        return
      }
    const sha7 = /(?<=-)\w{7}(?=\s)|^\w{7}(?=\s)|^\w{7}/.exec(stdout.trim())
    resolve(sha7[0])
    })
  })
}
const updateVersionJSON = async () => {
  // console.log(unpackagedVersionObj)
  content.packageVer = unpackagedVersionObj.packageVer
  content.buildTime = await getBuildTime()
  content.channel = 'nightly'
  content.sourceCommit = await getSourceCommit()
  // 如果正式发布,则从argv传入新的tagname format: node update-version.js --newTag [newTagName] --SHA7 [newSHA7] --buildTime [buildTime]
  const argv = require('minimist')(process.argv.slice(2), {string : ['newTag', 'SHA7', 'buildTime']})
  console.log(argv)
  if(process.argv.includes('--buildTime')) content.buildTime = argv.buildTime
  // 如果正式发布buildCommit 为触发正式发布的sha7
  if(process.argv.includes('--SHA7')) content.buildCommit = argv.SHA7
  else content.buildCommit = await getCommit()
  // get newTag
  if(!process.argv.includes('--newTag')) {
    content.version = content.packageVer + '-' + content.channel + '-' + content.buildTime
  } else {
    if (process.argv.includes('--stable')) content.channel = 'stable'
    content.version = argv.newTag
  }
  const data = JSON.stringify(content, null, 2)
  fs.writeFileSync(versionJSON, data)
}

updateVersionJSON()
