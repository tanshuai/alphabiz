const appConfig = require('../../developer/app')
const { buildVersion } = require('./electron-packager')
const buildPlatform = process.env.BUILD_PLATFORM || process.platform
const isMas = buildPlatform === 'mas'

if (isMas && !process.env.APPLE_TEAM_ID) {
  console.warn('APPLE_TEAM_ID is not set in env. You need to change the `ElectronTeamID` in target Info.plist before sign.')
}
/**
 * Specify `ElectronTeamID` helps macOS to determine unique apps.
 * This is also used for MAS build. The signed app will crash without
 * setting `ElectronTeamID` in `Info.plist`.
 * You can find your teamId in App Store Connect, or check your distribution keys.
 * @see https://appstoreconnect.apple.com/
 */
const teamId = process.env.APPLE_TEAM_ID || appConfig.appIdentifier

const videoExts = [
  'mp4',
  'mkv',
  'flv',
  'avi',
  'mov',
  'wmv',
  'rmvb',
  'flv',
  'webm'
]
const audioExts = [
  'mp3',
  'wav',
  'aac',
  'flac',
  'm4a',
  'wma'
]

const normalInfo = {
  ElectronTeamID: teamId,
  CFBundleDocumentTypes: [{
      CFBundleTypeName: 'BitTorrent Document',
      CFBundleTypeExtensions: [
        'torrent'
      ],
      CFBundleTypeRole: 'Editor',
      LSItemContentTypes: [
        'org.bittorrent.torrent'
      ],
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Video',
      CFBundleTypeExtensions: videoExts,
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Audio',
      CFBundleTypeExtensions: audioExts,
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: `${appConfig.name} Downloading File`,
      CFBundleTypeExtensions: `${appConfig.shortProtocol}-downloading`,
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Any',
      CFBundleTypeOSTypes: [
        '****'
      ],
      CFBundleTypeRole: 'Editor',
      LSTypeIsPackage: false,
      LSHandlerRank: 'Owner'
    }
  ],
  LSApplicationCategoryType: 'public.app-category.entertainment',
  UTExportedTypeDeclarations: [{
      UTTypeIdentifier: 'org.bittorrent.torrent',
      UTTypeIconFile: 'electron.ico',
      UTTypeDescription: 'BitTorrent Document',
      UTTypeConformsTo: [
        'public.data',
        'public.item',
        'com.bittorrent.torrent'
      ],
      UTTypeTagSpecification: {
        'com.apple.ostype': 'TORR',
        'public.mime-type': 'application\/x-bittorrent',
        'public.filename-extension': [
          'torrent'
        ]
      }
    },
    {
      UTTypeIdentifier: 'org.zeeis.alphabiz.key',
      UTTypeIconFile: 'electron.ico',
      UTTypeDescription: 'Alphabiz Encrypted Key',
      UTTypeConformsTo: [
        'public.text'
      ],
      UTTypeTagSpecification: {
        'public.mime-type': 'application\/x-alphabizkey',
        'public.filename-extension': [
          'abk'
        ]
      }
    }
  ]
}
const masInfo = {
  // This avoids MAS reporting encryption compliance requirements
  ITSAppUsesNonExemptEncryption: false,
  /**
   * The XCode props should match current version of XCode. Values can be
   * found at [XCode Releases](https://xcodereleases.com).
   * The target version must be in `Release` channel (not `RC` or `Beta`).
   * It is recommended to use latest version, since MAS requires recent versions.
   */
  DTXcodeBuild: '14C18',
  DTSDKName: 'macosx13.1',
  DTXcode: '1420', // 14.2
  // The `electron-packager` uses a build like `13.3` that is not supported by MAS
  DTSDKBuild: '22C55',
  /**
   * The `buildVersion` must be formatted as `x.x.x` not including any tails.
   * `0.2.4-internal` is invalid and will be rejected by MAS package check.
   * To upload a same version again, you need a different `CFBundleVersion`
   * You can open the `Info.plist ` in build result and edit `CFBundleVersion`.
   * The value can be a single number or a semver string, but must be increased
   * for every uploads.
   */
  CFBundleShortVersionString: buildVersion,
  UTExportedTypeDeclarations: [{
    UTTypeIdentifier: 'org.zeeis.alphabiz.key',
    UTTypeIconFile: 'electron.ico',
    UTTypeDescription: 'Alphabiz Encrypted Key',
    UTTypeConformsTo: [
      'public.text'
    ],
    UTTypeTagSpecification: {
      'public.mime-type': 'application\/x-alphabizkey',
      'public.filename-extension': [
        'abk'
      ]
    }
  }],
  LSApplicationCategoryType: 'public.app-category.entertainment',
  ElectronTeamID: teamId,
  CFBundleDocumentTypes: [{
      CFBundleTypeName: 'Video',
      CFBundleTypeExtensions: videoExts,
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Audio',
      CFBundleTypeExtensions: audioExts,
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: `${appConfig.name} Downloading File`,
      CFBundleTypeExtensions: `${appConfig.shortProtocol}-downloading`,
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Any',
      CFBundleTypeOSTypes: [
        '****'
      ],
      CFBundleTypeRole: 'Editor',
      LSTypeIsPackage: false,
      LSHandlerRank: 'Owner'
    }
  ]
}

module.exports = isMas ? masInfo : normalInfo
