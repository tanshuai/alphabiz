const packager = require('electron-packager')
const fs = require('fs')
const path = require('path')
const { default: rebuild } = require('electron-rebuild')

const version = require('./package.json').version
const publicVersion = require('./public/version.json').version

const buildVersion = publicVersion || version
const buildArch = process.env.BUILD_ARCH || process.arch

const app = require('./developer/app')
const appName = app.name

const { getPackageDetailsFromPatchFilename } = require('patch-package/dist/PackageDetails')
const { resolve } = require('path')
const { execSync } = require('child_process')
const patches = fs.readdirSync(path.resolve(__dirname, 'patches'))
  .map(getPackageDetailsFromPatchFilename)
  .filter(i => i && !i.isDevOnly)
  .map(i => i.name)

const packagePath = path.resolve(__dirname, './package.json')
const package = fs.readFileSync(packagePath)
const packageJson = JSON.parse(package)
packageJson.productName = appName
// fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
// process.on('exit', () => {
//   console.log('Restore package.json before quasar build exit')
//   fs.writeFileSync(packagePath, package)
// })
const unsupportedModules = [
  'lzma-native',
  'utp-native'
]
const pruneNative = dir => {
  if (!fs.existsSync(dir)) return
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const p = resolve(dir, file)
    if (fs.statSync(p).isDirectory()) return pruneNative(p)
    if (
      /(\.node|\.mk|\.a|\.o|\.h)$/gm.test(p)
      // p.endsWith('.node')
      // || (
      //   unsupportedModules.some(m => p.includes(`node_modules/${m}`)) &&
      //   !p.includes('arm') && !p.includes('x64')
      // )
    ) {
      fs.rmSync(p)
      console.log('[Prune] remove', p)
    }
  })
}

const beforeBuild = async () => {
  const { platform, arch } = process
  const destDir = path.resolve(__dirname, `build/electron/${app.displayName}-${platform}-${buildArch}`)
  console.log('Before build', destDir)
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true })
    console.log('删除成功！')
  }
}

beforeBuild()
packager({
  dir: './build/electron/UnPackaged',
  out: './build/electron',
  name: app.displayName,
  appVersion: buildVersion,
  buildVersion: buildVersion,
  arch: buildArch,
  // `BUILD_PLATFORM=mas yarn build` for building Mac App Store target
  platform: process.env.BUILD_PLATFORM || process.platform,
  extraResource: [
    path.resolve(__dirname, 'developer/icon-1024.png'),
    path.resolve(__dirname, 'developer/favicon.ico'),
    path.resolve(__dirname, 'developer/platform-assets/mac/trayiconTemplate.png'),
    path.resolve(__dirname, 'public/version.json')
  ],
  icon: process.platform === 'darwin'
    ? path.resolve(__dirname, 'developer/platform-assets/mac/app.icns')
    : path.resolve(__dirname, 'developer/platform-assets/windows/icon.ico'),
  // patch-package does not work in quasar production mode
  // we should manually copy our patched webtorrent to build path
  // NOTE: this requires `yarn` before `yarn build`
  afterPrune: [(buildPath, electronVersion, platform, arch, callback) => {
    // console.log('---App Build Path---\n', buildPath)
    [
      // ...patches,
      'torrent-discovery', // this builds with self-dep bittorrent-tracker
      '@videojs'
    ].forEach(dep => {
      const src = path.resolve(__dirname, 'node_modules', dep)
      const dest = path.resolve(buildPath, 'node_modules', dep)
      if (!fs.existsSync(src)) return console.error('not found', src)
      // console.log('--- COPY ---\n', src, '\n', dest, '\n--- COPY END ---')
      // fs.rmSync not support low version
      const removeDir = (dir) => {
        const files = fs.readdirSync(dir) // 一个数组
        files.forEach((item) => {
          let file = dir + "/" + item
          if (fs.statSync(file).isFile()) {
            fs.unlinkSync(file)
          } else {
            removeDir(file)
          }
        })
        fs.rmdirSync(dir)
      }
      if (fs.existsSync(dest)) {
        const nodeVersion = /(?<=v)\d{1,2}(?=.)/.exec(process.version)
        if (nodeVersion[0] < 14) removeDir(dest)
        else fs.rmSync(dest, { recursive: true })
      }
      const copyRecursive = (src, dest) => {
        if (fs.statSync(src).isDirectory()) {
          fs.readdirSync(src).forEach(dir => {
            copyRecursive(path.resolve(src, dir), path.resolve(dest, dir))
          })
        } else {
          // ensure directory exists
          if (!fs.existsSync(path.dirname(dest))) {
            fs.mkdirSync(path.dirname(dest), { recursive: true })
          }
          fs.copyFileSync(src, dest)
        }
      }
      copyRecursive(src, dest)
    })
    ;[
      'assets',
      'icons',
      'platform-assets',
      '.'
    ].forEach(assetDir => {
      const src = path.resolve(__dirname, 'developer', assetDir)
      const dest = path.resolve(buildPath, assetDir === '.' ? 'node_modules/developer' : 'developer/' + assetDir)
      if (!fs.existsSync(src)) return console.error('not found', src)
      // console.log('--- COPY ---\n', src, '\n', dest, '\n--- COPY END ---')
      // fs.rmSync not support low version
      const removeDir = (dir) => {
        const files = fs.readdirSync(dir) // 一个数组
        files.forEach((item) => {
          let file = dir + "/" + item
          if (fs.statSync(file).isFile()) {
            fs.unlinkSync(file)
          } else {
            removeDir(file)
          }
        })
        fs.rmdirSync(dir)
      }
      if (fs.existsSync(dest)) {
        const nodeVersion = /(?<=v)\d{1,2}(?=.)/.exec(process.version)
        if (nodeVersion[0] < 14) removeDir(dest)
        else fs.rmSync(dest, { recursive: true })
      }
      const copyRecursive = (src, dest) => {
        if (fs.statSync(src).isDirectory()) {
          fs.readdirSync(src).forEach(dir => {
            copyRecursive(path.resolve(src, dir), path.resolve(dest, dir))
          })
        } else {
          // ensure directory exists
          if (!fs.existsSync(path.dirname(dest))) {
            fs.mkdirSync(path.dirname(dest), { recursive: true })
          }
          fs.copyFileSync(src, dest)
        }
      }
      copyRecursive(src, dest)
    })
    const packageJsonPath = path.resolve(buildPath, 'package.json')
    fs.writeFileSync(packageJsonPath, fs.readFileSync(packageJsonPath).toString().replace(/Alphabiz/g, appName))
    const indexPath = path.resolve(buildPath, 'index.html')
    if (fs.existsSync(indexPath)) {
      const index = fs.readFileSync(indexPath).toString('utf-8')
      fs.writeFileSync(indexPath, index.replace(/Alphabiz/g, appName))
    }
    callback()
  }],
  afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    console.log('Copy patches to', buildPath)
    fs.cpSync(resolve(__dirname, 'patches'), resolve(buildPath, 'patches'), { recursive: true })
    if (platform !== 'win32') {fs.rmSync(resolve(buildPath, 'patches/electron-wix-msi+4.0.0.dev.patch'))}
    const result = execSync('npx patch-package', { cwd: buildPath })
    console.log(`Patch package result: ${result.toString()}`)
    // const yarnResult = execSync('yarn install --production', { cwd: buildPath })
    // console.log(`Yarn result: ${yarnResult.toString()}`)
    if (platform === 'darwin') {
      unsupportedModules.forEach(mod => {
        const prebuildDir = resolve(buildPath, 'node_modules', mod, 'prebuilds')
        if (fs.existsSync(prebuildDir)) {
          console.log('[Darwin] Remove prebuilds directory for', mod)
          fs.rmSync(prebuildDir, { recursive: true })
        }
        const buildDir = resolve(buildPath, 'node_modules', mod, 'build')
        if (fs.existsSync(buildDir)) {
          console.log('[Darwin] Remove build directory for', mod)
          fs.rmSync(buildDir, { recursive: true })
        }
      })
    }
    const buildName = `${app.displayName}-${platform}-${buildArch}`
    const basePath = buildPath.split(buildName)?.[0]
    // #894 `node-gyp` throws errors when path includes spaces
    const hasSpace = /\s/.test(buildName)
    if (hasSpace) {
      console.log(`The displayName "${app.displayName}" includes spaces. Use appName ${appName} for rebuild`)
      fs.cpSync(resolve(basePath, buildName), resolve(basePath, appName), { recursive: true, verbatimSymlinks: true })
    }
    rebuild({
      buildPath: hasSpace ? buildPath.replace(buildName, appName) : buildPath,
      arch,
      electronVersion
    })
      .then(() => {
        console.log('Rebuilt native module', platform, arch)
        if (hasSpace) {
          console.log('Copy rebuild results to build path', buildPath)
          fs.cpSync(resolve(basePath, appName), resolve(basePath, buildName), {
            recursive: true,
            verbatimSymlinks: true
          })
        }
        const modules = fs.readdirSync(resolve(buildPath, 'node_modules'))
        for (const module of modules) {
          const moduleDir = resolve(buildPath, 'node_modules', module)
          const releaseDir = resolve(moduleDir, 'build/Release')
          if (fs.existsSync(releaseDir)) {
            console.log(`Module [${module}] releases:`, fs.readdirSync(releaseDir))
            pruneNative(resolve(moduleDir, 'build'))
            pruneNative(resolve(moduleDir, 'node-addon-api'))
          }
        }
        callback()
      })
      .catch(e => callback(e))
  }],
  // downloader for our velectron build
  download: {
    mirrorOptions: {
      mirror: 'https://github.com/zeeis/velectron/releases/download/'
    },
    downloader: require('@zeeis/velectron/downloader')
  },
  // asar compress all resources to app.asar, which is
  // not an accessable directory for __statics, set to
  // `false` to use __statics in electron
  asar: {
    unpack: '*.{node,dll}'
  },
  // asar: false,

  // not dependencies in production mode
  ignore: [
    // /aws-/,
    /@zeeis\/velectron/,
    /^exe-icon-extractor$/,
    /@types/
  ],
  protocols: [{
    name: 'alphabiz', schemes: ['alphabiz://']
  },
  {
    name: 'magnet', schemes: ['magnet://']
  }, {
    name: 'thunder', schemes: ['thunder://']
  }]
})