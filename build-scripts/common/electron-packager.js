const fs = require('fs')
const { resolve, dirname } = require('path')
const { default: rebuild } = require('electron-rebuild')
const __rootdir = resolve(__dirname, '../..')

const { execSync } = require('child_process')

const app = require('../../developer/app')
const appName = app.name

const basePath = process.env.PROD
  ? process.resourcesPath
  : process.cwd()
const versionJSONPath = process.env.PROD ? 'version.json' : 'public/version.json'
const versionJSON = fs.readFileSync(resolve(basePath, versionJSONPath))
const versionObj = JSON.parse(versionJSON)
const buildVersion = process.env.BUILD_VERSION || versionObj.version
const buildArch = process.env.BUILD_ARCH || process.arch
const buildPlatform = process.env.BUILD_PLATFORM || process.platform
const isMas = buildPlatform === 'mas'

const packagePath = resolve(__rootdir, './package.json')
const package = fs.readFileSync(packagePath)
const packageJson = JSON.parse(package)
packageJson.productName = appName

const unsupportedModules = [
  'lzma-native',
  'utp-native'
]

const removeDir = (dir = '') => {
  const nodeVersion = /(?<=v)\d{1,2}(?=.)/.exec(process.version)
  if (nodeVersion > 14) return fs.rmSync(dir, { recursive: true })
  const files = fs.readdirSync(dir)
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
const copyRecursive = (src = '', dest = '') => {
  if (fs.statSync(src).isDirectory()) {
    fs.readdirSync(src).forEach(dir => {
      copyRecursive(resolve(src, dir), resolve(dest, dir))
    })
  } else {
    // ensure directory exists
    if (!fs.existsSync(dirname(dest))) {
      fs.mkdirSync(dirname(dest), {
        recursive: true
      })
    }
    fs.copyFileSync(src, dest)
  }
}
const pruneNative = (dir = '') => {
  if (!fs.existsSync(dir)) return
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const p = resolve(dir, file)
    if (fs.statSync(p).isDirectory()) return pruneNative(p)
    if (!p.endsWith('.node')) {
      fs.rmSync(p)
    }
  })
}
/**
 * @type { import('@types/electron-packager').Options }
 */
// https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html
const options = {
  name: app.displayName,
  appVersion: buildVersion,
  buildVersion: buildVersion,
  arch: buildArch,
  // `BUILD_PLATFORM=mas yarn build` for building Mac App Store target
  platform: buildPlatform,
  appBundleId: app.appIdentifier,

  win32metadata: {
    /**
     * In some cases the process name may be changed to `Electron` in windows.
     * This tells windows to show process name as `displayName` correctly.
     */
    FileDescription: app.displayName,
    CompanyName: app.developer
  },

  /**
   * The extended `Info.plist` includes some file associations for macOS build.
   * This file also sets application category to "public.app-category.entertainment".
   * @see https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype
   */
  extendInfo: resolve(
    __rootdir,
    'build-scripts/macos/app/',
    // The plist for mas does not include bindings to magnet url and torrent file
    isMas ? 'Info.mas.plist' : 'Info.plist'
  ),
  extraResource: [
    resolve(__rootdir, 'developer/icon-1024.png'),
    resolve(__rootdir, 'developer/favicon.ico'),
    resolve(__rootdir, 'developer/platform-assets/mac/trayiconTemplate.png'),
    resolve(__rootdir, 'public/version.json')
  ],
  icon: process.platform === 'darwin' ?
    resolve(__rootdir, 'developer/platform-assets/mac/app.icns') :
    resolve(__rootdir, 'developer/platform-assets/windows/icon.ico'),
  afterPrune: [(buildPath, electronVersion, platform, arch, callback) => {
    [
      'torrent-discovery', // this builds with self-dep bittorrent-tracker
      '@videojs'
    ].forEach(dep => {
      const src = resolve(__rootdir, 'node_modules', dep)
      const dest = resolve(buildPath, 'node_modules', dep)
      if (!fs.existsSync(src)) return console.error('not found', src)
      if (fs.existsSync(dest)) removeDir(dest)
      copyRecursive(src, dest)
    })
    ;[
      'assets',
      'icons',
      'platform-assets',
      '.'
    ].forEach(assetDir => {
      const src = resolve(__rootdir, 'developer', assetDir)
      const dest = resolve(buildPath, assetDir === '.' ? 'node_modules/developer' : 'developer/' + assetDir)
      if (!fs.existsSync(src)) return console.error('not found', src)
      if (fs.existsSync(dest)) removeDir(dest)
      copyRecursive(src, dest)
    })
    const packageJsonPath = resolve(buildPath, 'package.json')
    fs.writeFileSync(packageJsonPath, fs.readFileSync(packageJsonPath).toString().replace(/Alphabiz/g, app.displayName))
    const indexPath = resolve(buildPath, 'index.html')
    if (fs.existsSync(indexPath)) {
      const index = fs.readFileSync(indexPath).toString('utf-8')
      fs.writeFileSync(indexPath, index.replace(/Alphabiz/g, app.displayName))
    }
    callback()
  }],
  afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    console.log('Copy patches to', buildPath)
    const patches = fs.readdirSync(resolve(__rootdir, 'patches'))
    for (const patch of patches) {
      if (!/\.dev\.patch$/gm.test(patch)) {
        copyRecursive(resolve(__rootdir, `patches/${patch}`), resolve(buildPath, `patches/${patch}`))
      }
    }
    // copyRecursive(resolve(__rootdir, 'patches'), resolve(buildPath, 'patches'))
    // patch-package does not work in quasar production mode
    // we should manually copy our patched webtorrent to build path
    const result = execSync('npx patch-package', {
      cwd: buildPath
    })
    console.log(`Patch package result: ${result.toString()}`)
    // const yarnResult = execSync('yarn install --production', { cwd: buildPath })
    // console.log(`Yarn result: ${yarnResult.toString()}`)
    if (platform === 'darwin' || platform === 'mas') {
      unsupportedModules.forEach(mod => {
        const prebuildDir = resolve(buildPath, 'node_modules', mod, 'prebuilds')
        if (fs.existsSync(prebuildDir)) {
          console.log('[Darwin] Remove prebuilds directory for', mod)
          removeDir(prebuildDir)
        }
        const buildDir = resolve(buildPath, 'node_modules', mod, 'build')
        if (fs.existsSync(buildDir)) {
          console.log('[Darwin] Remove build directory for', mod)
          removeDir(buildDir)
        }
      })
    }
    const buildName = `${app.displayName}-${platform}-${buildArch}`
    const basePath = buildPath.split(buildName)?. [0]
    // #894 `node-gyp` throws errors when path includes spaces
    const hasSpace = /\s/.test(buildName)
    if (hasSpace) {
      console.log(`The displayName "${app.displayName}" includes spaces. Use appName ${appName} for rebuild`)
      fs.cpSync(resolve(basePath, buildName), resolve(basePath, appName), {
        recursive: true,
        // This prevent link errors in electron framework symlinks
        verbatimSymlinks: true
      })
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
  ]
}

module.exports = options
