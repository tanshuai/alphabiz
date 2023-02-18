const packager = require('electron-packager')
const fs = require('fs')
const path = require('path')

const app = require('./developer/app')
const appName = app.name
const buildArch = process.env.BUILD_ARCH || process.arch

const packagerOptions = require('./build-scripts/common/electron-packager')
packagerOptions.dir = `./dist/electron/UnPackaged`
packagerOptions.out = `./dist/electron`

const beforeBuild = async () => {
  const { platform, arch } = process
  const destDir = path.resolve(__dirname, `dist/electron/${app.displayName}-${platform}-${buildArch}`)
  console.log('Before build', destDir)
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true })
    console.log('删除成功！')
  }
}

beforeBuild()
packager(packagerOptions)