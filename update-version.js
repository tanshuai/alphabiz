'use strict'

const { exec } = require('child_process')
const fs = require('fs')

const versionJSON = './public/version.json'
const releaseJSON = './release.json'
const releaseObj = require(releaseJSON)

const unpackagedVersionJSON = fs.readFileSync('build/electron/UnPackaged/version.json')
const unpackagedVersionObj = JSON.parse(unpackagedVersionJSON)
const content = {
    "packageVer": "",
    "channel": "",
    "buildTime": "",
    "buildCommit": "",
    "sourceCommit": "",
    "version": ""
}
// get last commit modify file list
const isModifiedFile = async () => {
  return new Promise((resolve, reject) => {
    exec('git show --pretty="format:" --name-only', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      if (stderr) {
        console.error(`Error from Git: ${stderr}`)
        return
      }
      resolve(/release.json/.test(stdout.trim()))
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
const updateVersionJSON = async () => {
  // console.log(unpackagedVersionObj)
  content.packageVer = unpackagedVersionObj.packageVer
  content.buildTime = unpackagedVersionObj.buildTime
  content.buildCommit = await getCommit()
  content.sourceCommit = unpackagedVersionObj.sourceCommit
  
  const isModifyReleaseJSON = await isModifiedFile()
  if (!isModifyReleaseJSON) {
      content.channel = 'nightly'
      content.version = content.packageVer + '-' + content.channel + '-' + content.buildTime
  } else {
    content.channel = 'release'
    content.version = releaseObj.newTagName
  }
  const data = JSON.stringify(content, null, 2)
  fs.writeFileSync(versionJSON, data)
}
updateVersionJSON()