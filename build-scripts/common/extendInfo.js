const buildPlatform = process.env.BUILD_PLATFORM || process.platform
const isMas = buildPlatform === 'mas'

if (isMas && !process.env.APPLE_TEAM_ID) {
  console.warn('APPLE_TEAM_ID is not set in env. You need to change the `ElectronTeamID` in target Info.plist before sign.')
}
const teamId = process.env.APPLE_TEAM_ID || 'XXXXXXXXX'

const normalInfo = {
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
      CFBundleTypeExtensions: [
        'mp4',
        'mkv',
        'flv',
        'avi',
        'mov',
        'wmv',
        'rmvb',
        'flv',
        'webm'
      ],
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Audio',
      CFBundleTypeExtensions: [
        'mp3',
        'wav',
        'aac',
        'flac',
        'm4a',
        'wma'
      ],
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
  DTXcodeBuild: '14C18',
  CFBundleShortVersionString: '0.2.4',
  DTSDKName: 'macosx13.3',
  DTXcode: '1420',
  // The `electron-packager` use a build like `13.3` that is not supported by MAS
  DTSDKBuild: '22C55',
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
      CFBundleTypeExtensions: [
        'mp4',
        'mkv',
        'flv',
        'avi',
        'mov',
        'wmv',
        'rmvb',
        'flv',
        'webm'
      ],
      CFBundleTypeRole: 'Viewer',
      CFBundleTypeIconFile: 'electron.ico',
      LSHandlerRank: 'Owner'
    },
    {
      CFBundleTypeName: 'Audio',
      CFBundleTypeExtensions: [
        'mp3',
        'wav',
        'aac',
        'flac',
        'm4a',
        'wma'
      ],
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
