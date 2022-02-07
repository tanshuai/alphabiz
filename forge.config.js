const package = require('./package.json')
const fs = require('fs')
const { resolve } = require('path')
const { default: rebuild } = require('electron-rebuild')
const bVersion = require('./package.json').version
const buildVersion = process.env.BUILD_VERSION || bVersion
const { name, version, description, author, productName } = package

// The .deb package requires a .desktop template, see here:
// node_modules/electron-installer-debian/resources/desktop.ejs
// We just change the `Exec` for file association
const debDesktopTemplate = resolve(__dirname, 'out/desktop.template')
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
module.exports = {
  hooks: {
    packageAfterPrune: (conf, buildPath, electronVersion, platform, arch, callback) => {
      console.log('forge conf', conf)
      // console.log('---App Build Path---\n', buildPath)
      ['webtorrent', '@quasar/app'].forEach(dep => {
        const src = resolve(__dirname, 'node_modules', dep)
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
        electronVersion: '11.5.0'
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
      name: 'alphabiz', schemes: ['alphabiz://']
    }, {
      name: 'magnet', schemes: ['magnet://']
    }, {
      name: 'thunder', schemes: ['thunder://']
    }]
  },
  plugins: [
    ['@electron-forge/plugin-local-electron', {
      electronPath: resolve(__dirname, 'node_modules/@zeeis/velectron/dist')
    }]
  ],
  publishers: [],
  buildIdentifier: 'Alphabiz'
}