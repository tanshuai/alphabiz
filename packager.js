const packager = require('electron-packager')
const fs = require('fs')
const path = require('path')

const buildArch = process.env.BUILD_ARCH || process.arch
const buildPlatform = process.env.BUILD_PLATFORM || process.platform
console.log('Packager Build!', buildPlatform, buildArch)

const app = require('./developer/app')
const appName = app.name

const packagerOptions = require('./build-scripts/common/electron-packager')
packagerOptions.dir = `./dist/electron/UnPackaged`
packagerOptions.out = `./dist/electron`

const beforeBuild = async () => {
  const { platform, arch } = process
  const destDir = path.resolve(__dirname, `dist/electron/${app.displayName}-${platform}-${buildArch}`)
  console.log('Before build', destDir)
  if (fs.existsSync(destDir)) {
    deleteFolderRecursive(destDir)
  }
}

const deleteFolderRecursive = function (directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
       // recurse
        deleteFolderRecursive(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(directoryPath)
  }
}

beforeBuild()
packager(packagerOptions)