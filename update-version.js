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
    exec('set TZ=UTC-8 && git log -1 --date=format-local:"%Y%m%d%H%M" --format="%cd"', (error, stdout, stderr) => {
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
  // 如果正式发布buildCommit 为触发正式发布的sha7
  if (!process.argv[3]) content.buildCommit = await getCommit()
  else content.buildCommit = process.argv[3]
  content.sourceCommit = await getSourceCommit()
  
  // 如果正式发布,则从argv传入新的tagname format: node update-version.js [newTagName] [newSHA7]
  if (!process.argv[2]){
    content.channel = 'nightly'
    content.version = content.packageVer + '-' + content.channel + '-' + content.buildTime
  } else {
    if (process.argv.includes('--stable')) content.channel = 'stable'
    else content.channel = 'nightly'
    content.version = process.argv[2]
  }
  
  
  const data = JSON.stringify(content, null, 2)
  fs.writeFileSync(versionJSON, data)
}

updateVersionJSON()

