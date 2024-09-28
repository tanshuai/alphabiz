const { signApp } = require('@electron/osx-sign')
const { existsSync } = require('fs')
const { resolve } = require('path')
const { minVersion } = require('semver')

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

// const version = process.env.BUILD_VERSION ||
//   process.env.VERSION ||
//   require('../../../public/version.json').version ||
//   require('../../../package.json').version
const { version } = minVersion(require('../../../package.json').devDependencies.electron)
console.log('Electron version:', version)

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
  // This is the electron version, not the app version.
  version,
  // provisioningProfile: resolve(__dirname, '../../../developer/embeded.provisionprofile'),
  // entitlements: resolve(__dirname, 'entitlements.mas.plist'),
  /**
   * Only the main app needs to add entitlements with custom metadata.
   * The nullable returned object will be merged to main options, so we
   * just return `null` for other entries.
   */
  optionsForFile(filepath) {
    /** @type { import('@electron/osx-sign/dist/cjs/types').PerFileSignOptions } */
    // const opt = {
    //   hardenedRuntime: true,
    // }
    if (filepath.endsWith(app)) {
      return {
        // hardenedRuntime: true,
        entitlements: resolve(__dirname, 'entitlements.mas.plist')
      }
    } else if (filepath.endsWith('.app') || filepath.endsWith('.framework')) {
      return {
        // hardenedRuntime: true,
        entitlements: resolve(__dirname, 'entitlements.inherit.plist')
      }
    }
    return null
  }
}

const sign = () => {
  signApp(signOptions).then(() => {
    console.log(`Successfully signed ${app}`)
    process.exit(0)
  }).catch(e => {
    console.error(`Error signing ${app}. Error:\n${e}`)
    process.exit(1)
  })
}

const provisioningProfile = resolve(__dirname, '../../../developer/embedded.provisionprofile')
console.log('Sign options:', signOptions)

if (existsSync(provisioningProfile)) {
  signOptions.provisioningProfile = provisioningProfile
  sign()
} else {
  console.warn('Missing provisioning profile for codesign.')
  console.warn(`You may need to put an 'embedded.provisionprofile' file in 'developer' folder before sign app.`)
  console.warn('This script will continue after 5 seconds without an provisioning profile, and may cause unexpected errors.')
  setTimeout(sign, 5000)
}
