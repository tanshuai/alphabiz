/**
 * Configure app basic info.
 */

/** App name is used everywhere. */
const APP = 'Alphabiz'

const app = {
  /**
   * App name.
   * Recommend using only a-z and A-Z without spaces
   */
  name: APP,
  /**
   * Display name
   * Used for App title
   * `appx` target (Microsoft Store)
   */
  displayName: APP,
  /**
   * file name
   * A brief display name. Used for Installation package file name
   * when display name is too long
   */
  fileName: APP,
  /**
   * Application ID for android/ios app. The format should be something like
   * `org.author.appname`
   */
  appId: 'com.zeeis.alphabiz',
  /**
   * The bin name for snapcraft, which can be used to launch your app
   * via terminal. Default: `alphabiz`
   */
  snapName: APP.toLowerCase(),
  /**
   * Author name
   */
  author: `${APP} Team <dev@alpha.biz>`,
  /**
   * Developer name for windows.
   * Note that this key should not contain special characters(like `<>` above)
   */
  developer: `${APP} Team`,
  /**
   * The app identifier you 've registered for MAS(Mac App Store) in https://developer.apple.com/account.
   * It is recommended to use `com.YOUR_COMPANY.YOUR_APP_NAME`, with no special characters(spaces, etc).
   * Different identifiers will be recognized as different apps.
   */
  appIdentifier: 'org.zeeis.alphabiz',
  description: `${APP} Blockchain Cryptocurrency Application`,
  /**
   * Used to unify locally generated installation packages and the Microsoft Store
   */
  appxPackageIdentityName: APP,
  /**
   * The default .pfx file uses publisher: 'CN=zeeis'.
   * If you want to use .appx file after modifying publisher,
   * please manually modify app.pfx file
   */
  publisher: 'CN=zeeis',
  /**
   * Publishers display names that comply with Microsoft Store registration
   */
  publisherDisplayName: `${APP} Team`,
  /**
   * Website for your app. Used in linux debian package.
   */
  homepage: 'https://alpha.biz',
  webEditionUrl: 'https://web.alpha.biz',
  /**
   * Upgrade code for windows.
   * If two app have a same code, windows will remove old one when installing.
   * You can create your own code by running command `npx uuid v4`.
   */
  upgradeCode: '4d8a65aa-fc5b-421c-94ab-cb722ef737e2',
  /**
   * App binding protocol scheme.
   * By default the app will register `alphabiz://` as its url protocol
   */
  protocol: APP.toLowerCase(),
  /**
   * Short url protocol.
   * By default using `ab://`
   */
  shortProtocol: 'ab',
  /**
   * An url to a version.json file, which allows you to add min-version for your app.
   * See this file for more detail.
   */
  versionsUrl: 'https://raw.githubusercontent.com/tanshuai/alphabiz/main/versions.json',
  /**
   * Twitter account for feedback
   */
  twitterAccount: '@alphabiz_app',
  /**
   * Configure who can register accounts in your app
   */
  register: {
    /**
     * @type { 'none' | 'blacklist' | 'whitelist' }
     * - `none`: any one can register
     * - `blacklist`: countries in list will be disabled
     * - `whitelist`: only countries in list will be enabled
     */
    mode: 'none',
    /**
     * @type { string[] }
     * Country code list. Must be geoip ISO 3166-1-alpha-2 code
     * @see http://www.geonames.org/countries/
     */
    // list: ['US', 'CN']
    list: []
  },
  library: {
    /**
     * Add channel id list here to auto-select recommend channels.
     * The location is determined by `navigator.language`, not the
     * language user set in settings.
     */
    recommends: {
      default: [
        'fxpebrsi9ij5pzinwdky', // Public short films
        'cut44dbbfxjpqka39qix' // New Film Express
      ],
      'zh-CN': [
        'vs52l0yqtqqpqtw33ycx', // 最新电影速递
        'cut44dbbfxjpqka39qix' // New Film Express
      ]
    }
  },
  update: require('./update'),
  takedown: require('./take-down'),
  /**
   * App Theme Config
   */
  theme: {
    color: {
      primary: '#d1994b',
      secondary: '#f3ce90',
      accent: '#fbbb4a'
      // primary: '#a2c1f3',
      // secondary: '#97afc4',
      // accent: '#5800dc'
    },
    /**
     * CSS for app icon in left-top corner as background
     */
    cornerLogoStyle: {
      /**
       * Uncomment following lines to customize your logo
       */
      // filter: 'brightness(1.2) saturate(1.2)',
      // opacity: '0.3',
      left: '-72px',
      top: '-92px',
      height: '245px'
    }
  },
  dynamicConfig: require('./dynamicConfig'),
  /**
   * Microsoft Store Product ID
   */
  microsoftStoreProductId: '9PBCCV3MHK04'
}

console.log('INIT APP CONFIG')
global._app_config_ = app
/**
 * If `alphabiz-libdb` finds LIBDB_NAME in global, it will use the name as
 * internal category, so different builds will have seperated libraries.
 * If you use same appName for different builds, you can add a tail to the
 * LIBDB_NAME to seperate libs.
 */
global.LIBDB_NAME = app.name // + '-' + SUB_VERSION
module.exports = app
/**
 * Check short protocol
 */
// if (app.name.toLowerCase() === app.shortProtocol) {
//   throw new Error(`Cannot set short protocol as same as appName ${app.name}`)
// }
require('./validateAppConfig')(app)
