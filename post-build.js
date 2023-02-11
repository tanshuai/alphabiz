/**
 * @description
 * A post-build script for adding extension settings
 */
const { existsSync, readFileSync, writeFileSync, copyFileSync } = require('fs')
const { resolve } = require('path')
const audioExt = [
  'mp3', 'wav', 'aac', 'flac', 'm4a', 'wma'
]
const videoExt = [
  'mp4', 'mkv', 'flv', 'avi', 'mov', 'wmv', 'rmvb', 'flv', 'webm'
]
const srcIconPath = resolve(__dirname, 'developer/favicon.ico')
const iconPath = 'favicon.ico'

const appConfig = require('./developer/app');
const appName = appConfig.name;

const buildDarwin = () => {
  const plist = require('plist')
  const appPath = resolve(__dirname, `build/electron/${appName}-darwin-x64/${appName}.app`)
  const contentsPath = resolve(appPath, 'Contents')
  const resourcesPath = resolve(contentsPath, 'Resources')
  const infoPlistPath = resolve(contentsPath, 'Info.plist')
  if (!existsSync(infoPlistPath)) return console.warn(`Cannot find info.plist at ${infoPlistPath}`)
  const infoPlist = plist.parse(readFileSync(infoPlistPath, 'utf-8'))
  infoPlist.CFBundleDocumentTypes = [
    {
      CFBundleTypeExtensions: ['torrent'],
      CFBundleTypeIconFile: iconPath,
      CFBundleTypeName: 'BitTorrent Document',
      CFBundleTypeRole: 'Editor',
      LSHandlerRank: 'Owner',
      LSItemContentTypes: ['org.bittorrent.torrent']
    },
    {
      CFBundleTypeExtensions: videoExt,
      CFBundleTypeIconFile: iconPath,
      CFBundleTypeRole: 'Viewer',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeExtensions: audioExt,
      CFBundleTypeIconFile: iconPath,
      CFBundleTypeRole: 'Viewer',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Any',
      CFBundleTypeOSTypes: ['****'],
      CFBundleTypeRole: 'Editor',
      LSHandlerRank: 'Owner',
      LSTypeIsPackage: false
    }
  ]
  infoPlist.CFBundleURLTypes = [
    {
      CFBundleTypeRole: 'Editor',
      CFBundleURLIconFile: iconPath,
      CFBundleURLName: 'BitTorrent Magnet URL',
      CFBundleURLSchemes: ['magnet']
    },
    {
      CFBundleTypeRole: 'Editor',
      CFBundleURLIconFile: iconPath,
      CFBundleURLName: 'BitTorrent Stream-Magnet URL',
      CFBundleURLSchemes: ['stream-magnet']
    }
  ]
  infoPlist.UTExportedTypeDeclarations = [
    {
      UTTypeConformsTo: [
        'public.data',
        'public.item',
        'com.bittorrent.torrent'
      ],
      UTTypeDescription: 'BitTorrent Document',
      UTTypeIconFile: iconPath,
      UTTypeIdentifier: 'org.bittorrent.torrent',
      UTTypeReferenceURL: 'http://www.bittorrent.org/beps/bep_0000.html',
      UTTypeTagSpecification: {
        'com.apple.ostype': 'TORR',
        'public.filename-extension': ['torrent'],
        'public.mime-type': 'application/x-bittorrent'
      }
    }
  ]
  writeFileSync(infoPlistPath, plist.build(infoPlist))
  copyFileSync(srcIconPath, resolve(resourcesPath, iconPath))
}

switch (process.platform) {
  case 'darwin':
    buildDarwin()
    break;

  default:
    break;
}
