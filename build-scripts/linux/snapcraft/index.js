const { spawn } = require('child_process')
const { existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync, cpSync, renameSync } = require('fs')
const path = require('path')
const { resolve } = require('path')
const appConfig = require('../../../developer/app')
const publicVersion = require('../../../public/version.json').version
// console.log(publicVersion)
const __rootdir = resolve(__dirname, '../../..')

const checkCommand = (cmd, options = {}) => {
  return new Promise((resolve) => {
    const child = spawn('which', [cmd], Object.assign({
      stdio: ['inherit', 'pipe', 'inherit'],
      cwd: path.resolve(__dirname, '..')
    }, options))
    child.stdout.on('data', d => console.log('Using', d.toString().trim()))
    child.on('error', console.error)
    child.on('exit', (code) => {
      resolve(code)
    })
  })
}
const checkEnv = async () => {
  const missSnap = await checkCommand('snap')
  if (missSnap) throw new Error('Require installing snap before making. Try run `sudo apt install snapd`')
  const missSnapcraft = await checkCommand('snapcraft')
  if (missSnapcraft) throw new Error('Require installing snapcraft before making. Try run `sudo snap install snapcraft`')
  const missMultipasss = await checkCommand('multipass')
  if (missMultipasss) throw new Error('Require installing multipass before making. Try run `sudo snap install multipass`')
}

const prepareSnap = async () => {
  const snapAppPath = resolve(__rootdir, 'out/make/snapcraft', appConfig.name)
  if (existsSync(snapAppPath)) rmSync(snapAppPath, { recursive: true })
  mkdirSync(snapAppPath, { recursive: true })
  const buildDist = resolve(__rootdir, `dist/electron/${appConfig.displayName}-linux-x64`)
  console.log(buildDist)

  cpSync(buildDist, snapAppPath, { recursive: true })
  if (existsSync(resolve(snapAppPath, appConfig.displayName))) {
    renameSync(
      resolve(snapAppPath, appConfig.displayName),
      resolve(snapAppPath, appConfig.name)
    )
  }

  const snapDir = resolve(__rootdir, 'snap')
  if (existsSync(snapDir)) rmSync(snapDir, { recursive: true })
  if (!existsSync(snapDir)) mkdirSync(snapDir)
  const guiDir = resolve(snapDir, 'gui')
  if (!existsSync(guiDir)) mkdirSync(guiDir)

  copyFileSync(
    resolve(__rootdir, 'developer/icon-1024.png'),
    resolve(guiDir, 'icon.png')
  )

  /** @param { Buffer|string } str */
  const applyParams = (str) => {
    return str.toString('utf-8')
      .replace(/{{\s*version\s*}}/g, publicVersion)
      .replace(/{{\s*appName\s*}}/g, appConfig.name)
      .replace(/{{\s*displayName\s*}}/g, appConfig.displayName)
      .replace(/{{\s*snapName\s*}}/g, appConfig.snapName)
      .replace(/{{\s*description\s*}}/g, appConfig.description)
  }

  const snapcraftTemplate = resolve(__dirname, 'snapcraft.template')
  writeFileSync(
    resolve(snapDir, 'snapcraft.yaml'),
    applyParams(readFileSync(snapcraftTemplate))
  )
  const desktopTemplate = resolve(__dirname, 'desktop.template')
  writeFileSync(
    resolve(guiDir, `${appConfig.snapName}.desktop`),
    applyParams(readFileSync(desktopTemplate))
  )
}

const makeSnap = async () => {
  await checkEnv()
  await prepareSnap()
}

/**
 * The snap script cannot be run with node child-process so we cannot
 * specify the target filename when building snap. So we should move
 * the snap file to release directory manually.
 */
const postMakeSnap = async () => {
  const basePath = resolve(__rootdir, 'out/installers/app.snap')
  const targetDir = resolve(__rootdir, `out/installers/${publicVersion}`)
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true })
  const targetPath = resolve(targetDir, `${appConfig.snapName}-${publicVersion}.snap`)
  renameSync(basePath, targetPath)
  console.log(`Snapcraft build finished. Snap file:\n\t${targetPath}`)
}

module.exports = makeSnap
if (require.main === module) {
  if (process.argv.includes('--post')) {
    postMakeSnap()
  } else {
    makeSnap()
  }
}
