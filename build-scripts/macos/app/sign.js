const { signApp } = require('@electron/osx-sign')
const { existsSync } = require('fs')
const { resolve } = require('path')

const app = process.argv[2]
const identity = process.argv[3]
if (!existsSync(app)) {
  console.error(`Cannot find ${app}. The target may not able to be located`)
  process.exit(1)
}
if (!identity) {
  console.error(`Cannot get identity for codesign`)
  process.exit(1)
}
const version = process.env.BUILD_VERSION ||
  process.env.VERSION ||
  require('../../../public/version.json').version ||
  require('../../../package.json').version

/**
 * @type { import('@electron/osx-sign/dist/cjs/types').SignOptions }
 * Using custom entitlements file by `optionsForFile` is only available
 * in js usage. So we call this js script from shell.
 * @usage
 * ```sh
 * node sign.js path/to/target.app path/to/entitlements.plist
 * ```
 * Use `DEBUG=electron-osx-sign` to print details. This can also be set
 * by `DEV=true` in `.env` when using `sign.sh` script.
 */
const signOptions = {
  app,
  identity,
  version,
  // entitlements: resolve(__dirname, 'entitlements.mas.plist'),
  /**
   * Only the main app needs to add entitlements with custom metadata.
   * The nullable returned object will be merged to main options, so we
   * just return `null` for other entries.
   */
  optionsForFile(filepath) {
    if (filepath.endsWith(app)) {
      return {
        entitlements: resolve(__dirname, 'entitlements.mas.plist')
      }
    }
    return null
  }
}
signApp(signOptions).then(() => {
  console.log(`Successfully signed ${app}`)
  process.exit(0)
}).catch(e => {
  console.error(`Error signing ${app}. Error:\n${e}`)
  process.exit(1)
})
