const package = require('../../package.json')
const fs = require('fs')
const { resolve } = require('path')
const { default: rebuild } = require('electron-rebuild')
const __rootdir = resolve(__dirname, '../..')

const publicVersion = require(resolve(__rootdir, 'public/version.json')).version
const versionHeader = publicVersion.match(/\d+\.\d+\.\d+/gm)
const { version } = package
const appConfig = require('../../developer/app');
const productName = appConfig.displayName;
const author = appConfig.author;
const protocol = appConfig.protocol;
const homepage = appConfig.homepage;
const publisher = appConfig.publisher;
const description = appConfig.description;

const defaultPfxPath = resolve(__dirname, '../windows/appx/default.pfx')
const appxPfxPath = resolve(__rootdir, 'developer/appx.pfx')
const appxPfx = fs.existsSync(appxPfxPath) ? appxPfxPath : defaultPfxPath

// The .deb package requires a .desktop template, see here:
// node_modules/electron-installer-debian/resources/desktop.ejs
// We just change the `Exec` for file association
const debDesktopTemplate = resolve(__rootdir, 'out/desktop.template')
// overwrites the default template for opending files
if (process.platform === 'linux') fs.writeFileSync(debDesktopTemplate, `[Desktop Entry]
<% if (productName) { %>Name=<%= productName %>
<% } %><% if (description) { %>Comment=<%= description %>
<% } %><% if (genericName) { %>GenericName=<%= genericName %>
<% } %><% if (name) { %>Exec=<%= name %> -- %U
Icon=<%= name %>
<% } %>Type=Application
StartupNotify=true
<% if (categories && categories.length) { %>Categories=<%= categories.join(';') %>;
<% } %><% if (mimeType && mimeType.length) { %>MimeType=<%= mimeType.join(';') %>;
<% } %>
`)

// patch-package throws error if dependency is optional.
// We can do nothing with it, so we have to patch manually.
const controlTemplate = `<% if (name) { %>Package: <%= name %>
<% } %><% if (version) { %>Version: <%= version %><% if (revision) { %>-<%= revision %><% } %>
<% } %><% if (section) { %>Section: <%= section %>
<% } %><% if (priority) { %>Priority: <%= priority %>
<% } %><% if (arch) { %>Architecture: <%= arch %>
<% } %><% if (depends && depends.length) { %>Depends: <%= depends.join(', ') %>
<% } %><% if (recommends && recommends.length) { %>Recommends: <%= recommends.join(', ') %>
<% } %><% if (suggests && suggests.length) { %>Suggests: <%= suggests.join(', ') %>
<% } %><% if (enhances && enhances.length) { %>Enhances: <%= enhances.join(', ') %>
<% } %><% if (preDepends && preDepends.length) { %>Pre-Depends: <%= preDepends.join(', ') %>
<% } %><% if (size) { %>Installed-Size: <%= size %>
<% } %><% if (maintainer) { %>Maintainer: <%= maintainer %>
<% } %><% if (name) { %>Provides: <%= name %>
<% } %><% if (name) { %>Conflicts: <%= name %>
<% } %><% if (name) { %>Replaces: <%= name %>
<% } %><% if (homepage) { %>Homepage: <%= homepage %>
<% } %><% if (description) { %>Description: <%= description %>
<% } %><% if (productDescription) { %><%= productDescription %><% } %>
`
if (process.platform === 'linux') {
  fs.writeFileSync(
    resolve(__rootdir, 'node_modules/electron-installer-debian/resources/control.ejs'),
    controlTemplate
  )
}

const buildArch = process.env.BUILD_ARCH || process.arch
const buildPlatform = process.env.BUILD_PLATFORM || process.platform
console.log(resolve(__rootdir, `out/${productName}-${buildPlatform}-${buildArch}/${productName}.app`))

module.exports = {
  hooks: {
    packageAfterPrune: (conf, buildPath, electronVersion, platform, arch, callback) => {
      console.log('forge conf', conf)
      // console.log('---App Build Path---\n', buildPath)
      ['webtorrent', '@quasar/app'].forEach(dep => {
        const src = resolve(__rootdir, 'node_modules', dep)
        const dest = resolve(buildPath, 'node_modules', dep)
        if (!fs.existsSync(src)) return
        const copyRecursive = (src, dest) => {
          if (fs.statSync(src).isDirectory()) {
            fs.readdirSync(src).forEach(dir => {
              copyRecursive(resolve(src, dir), resolve(dest, dir))
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
    },
    packageAfterCopy: (conf, buildPath, electronVersion, platform, arch, callback) => {
      rebuild({
        buildPath,
        arch,
        electronVersion
      })
        .then(() => {
          console.log('Rebuilt native module')
          callback()
        })
        .catch(e => callback(e))
    }
  },
  packagerConfig: {
    download: {
      mirrorOptions: {
        mirror: 'https://github.com/zeeis/velectron/releases/download/'
      },
      downloader: require('@zeeis/velectron/downloader')
    },
    asar: {
      unpack: '*.{node,dll}'
    },

    // not dependencies in production mode
    ignore: [
      // /aws-/,
      /@zeeis\/velectron/
    ],
    protocols: [{
      name: protocol, schemes: [`${protocol}`]
    }, {
      name: 'magnet', schemes: ['magnet']
    }, {
      name: 'thunder', schemes: ['thunder']
    }]
  },
  plugins: [
    ['@electron-forge/plugin-local-electron', {
      electronPath: resolve(__rootdir, 'node_modules/@zeeis/velectron/dist')
    }]
  ],
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: appConfig.name,
        title: productName,
        setupExe: `${productName}-${version} Setup.exe`,
        productName,
        author,
        description,
        version,
        iconUrl: resolve(__rootdir, 'developer/favicon.ico'),
        setupIcon: resolve(__rootdir, 'developer/favicon.ico'),
        loadingGif: resolve(__rootdir, 'developer/platform-assets/windows/splash/InstallSplash.gif'),
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: productName,
        title: `${appConfig.fileName}-${version} Setup`,
        icon: resolve(__rootdir, 'developer/platform-assets/mac/volume-icon.icns'),
        iconSize: 96,
        overwrite: true,
        arch: buildArch,
        background: resolve(__rootdir, 'developer/platform-assets/mac/background.png'),
        contents: [
          { x: 460, y: 256, type: 'link', path: '/Applications' },
          { x: 200, y: 256, type: 'file', path: resolve(__rootdir, `out/${productName}-${buildPlatform}-${buildArch}/${productName}.app`) }
        ]
      }
    },
    // {
    //   name: "@electron-forge/maker-zip",
    //   platforms: [
    //     "darwin"
    //   ]
    // },
    {
      name: "@electron-forge/maker-deb",
      config: {
        name: productName,
        bin: productName,
        genericName: productName,
        categories: ['AudioVideo', 'Network', 'Utility'],
        description,
        productDescription: description,
        version,
        homepage,
        icon: resolve(__rootdir, 'developer/platform-assets/linux/512x512.png'),
        maintainer: author,
        // TODO: add file associations here
        mimeType: ['audio/*', 'video/mp4', 'video/*', 'application/x-bittorrent', `x-scheme-handler/${protocol}`],
        desktopTemplate: debDesktopTemplate
      }
    },
    {
      name: "@electron-forge/maker-snap",
      config: {
        version
      }
    },
    {
      name: '@electron-forge/maker-appx',
      config: {
        publisher,
        publisherName: publisher,
        publisherDisplayName: appConfig.publisherDisplayName,
        assets: resolve(__rootdir, 'developer/platform-assets/windows/icon'),
        devCert: appxPfx,
        deploy: false,
        makePri: true,
        packageName: appConfig.name,
        packageDisplayName: appConfig.displayName,
        packageDescription: description,
        packageVersion: versionHeader[0] + '.0', // appx uses a version like 1.2.3.4
        packageExecutable: `app\\${productName}.exe`,
        manifest: resolve(__dirname, '../windows/appx/template.xml')
      }
    }
    // {
    //   name: "@electron-forge/maker-rpm",
    //   config: {}
    // },
    // {
    //   name: "@electron-forge/maker-wix",
    //   config: {
    //     name: productName,
    //     shortName: productName,
    //     arch: 'x64',
    //     description,
    //     exe: productName,
    //     manufacturer: 'Alphabiz Team',
    //     shortcutFolderName: '',
    //     programFilesFolderName: productName,
    //     appIconPath: resolve(__dirname, 'public/platform-assets/windows/icon.ico'),
    //     /**
    //      * This code is randomly generate by [uuid](https://www.npmjs.com/package/uuid).
    //      * The Windows MSI installer uses it to upgrade an existed software.
    //      * Do NOT change this unless you know what will happen.
    //     */
    //     upgradeCode: '4d8a65aa-fc5b-421c-94ab-cb722ef737e2',
    //     version,
    //     cultures: 'zh-cn;zh-tw;en-us',
    //     ui: {
    //       chooseDirectory: true,
    //       images: {
    //         background: resolve(__dirname, 'public/platform-assets/windows/splash/background_493x312.png'),
    //         banner: resolve(__dirname, 'public/platform-assets/windows/splash/banner_493x58.png'),
    //         exclamationIcon: resolve(__dirname, 'public/icons/favicon-32x32.png'),
    //         infoIcon: resolve(__dirname, 'public/icons/favicon-32x32.png'),
    //         newIcon: resolve(__dirname, 'public/icons/favicon-16x16.png'),
    //         upIcon: resolve(__dirname, 'public/icons/favicon-16x16.png')
    //       },
    //       localizations: wixLocalizationFiles
    //     },
    //     beforeCreate (wix) {
    //       // console.log(wix.wixTemplate || wix)
    //       // Remove appName tail created by wix
    //       if (wix.wixTemplate) {
    //         const iconTemplate = `\n<Icon Id="icon.ico" SourceFile="${icoPath}"/>`
    //           + `\n<Property Id="ARPPRODUCTICON" Value="icon.ico" />`
    //         // console.log(wix.getRegistryKeys)
    //         const _getRegistryKeys = wix.getRegistryKeys
    //         wix.getRegistryKeys = (function getRegistryKeys (...args) {
    //           const registry = _getRegistryKeys.bind(wix)(...args)
    //           const icon = registry.find(i => i.id === 'UninstallDisplayIcon')
    //           if (icon) icon.value = '[APPLICATIONROOTDIRECTORY]Alphabiz.exe'
    //           // console.log(icon, registry.find)
    //           return registry
    //         }).bind(wix)
    //         wix.uiTemplate = wix.uiTemplate
    //           .replace('<DialogRef Id="MsiRMFilesInUse" />', '<!-- <DialogRef Id="MsiRMFilesInUse" /> -->')
    //         wix.wixTemplate = wix.wixTemplate
    //           .replace('"{{ApplicationName}} (Machine - MSI)"','"{{ApplicationName}}"')
    //           .replace('"{{ApplicationName}} (Machine)"','"{{ApplicationName}}"')
    //           .replace('</Product>', iconTemplate +'\n</Product>')
    //       }
    //     }
    //   }
    // }
  ],
  publishers: []
}
