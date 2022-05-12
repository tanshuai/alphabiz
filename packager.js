const packager = require('electron-packager')
const fs = require('fs')
const path = require('path')
const { default: rebuild } = require('electron-rebuild')

const version = require('./package.json').version
const publicVersion = require('./public/version.json').version

const buildVersion = publicVersion || version
const packagePath = path.resolve(__dirname, './package.json')
const package = fs.readFileSync(packagePath)
console.log(path.resolve(__dirname, 'alphabiz-icon-1024.png'))

const beforeBuild = async () => {
  // console.log('run beforeBuild')
  // const pkg = JSON.parse(package)
  // pkg.version = buildVersion
  // console.log('Build version:', pkg.version)
  // fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2))
  // process.on('exit', () => {
  //   fs.writeFileSync(packagePath, package)
  //   console.log('Restored package.json before exit')
  // })
}

beforeBuild()
packager({
  dir: './build/electron/UnPackaged',
  out: './build/electron',
  appVersion: buildVersion,
  buildVersion: buildVersion,
  extraResource: [
    path.resolve(__dirname, 'alphabiz-icon-1024.png'),
    path.resolve(__dirname, 'public/favicon.ico'),
    path.resolve(__dirname, 'public/platform-assets/mac/trayiconTemplate.png'),
    path.resolve(__dirname, 'public/version.json')
  ],
  icon: process.platform === 'darwin'
    ? path.resolve(__dirname, 'public/platform-assets/mac/app.icns')
    : path.resolve(__dirname, 'public/platform-assets/windows/icon.ico'),
  // patch-package does not work in quasar production mode
  // we should manually copy our patched webtorrent to build path
  // NOTE: this requires `yarn` before `yarn build`
  afterPrune: [(buildPath, electronVersion, platform, arch, callback) => {
    // console.log('---App Build Path---\n', buildPath)
    [
      'webtorrent',
      'bittorrent-tracker',
      'gun',
      'torrent-discovery', // this builds with self-dep bittorrent-tracker
      '@videojs'
    ].forEach(dep => {
      const src = path.resolve(__dirname, 'node_modules', dep)
      const dest = path.resolve(buildPath, 'node_modules', dep)
      if (!fs.existsSync(src)) return console.error('not found', src)
      // console.log('--- COPY ---\n', src, '\n', dest, '\n--- COPY END ---')
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true })
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
    callback()
  }],
  afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    rebuild({
      buildPath,
      arch,
      electronVersion: '17.0.0'
    })
      .then(() => {
        console.log('Rebuilt native module')
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