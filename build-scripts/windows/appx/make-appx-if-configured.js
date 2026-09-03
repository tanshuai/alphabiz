'use strict'

const { spawnSync } = require('child_process')
const { validateBuildTarget } = require('../../common/command-boundary')
const { PATH_ENV, PASSWORD_ENV, FINGERPRINT_ENV } = require('./signing-certificate')

const REQUIRE_ENV = 'ALPHABIZ_REQUIRE_APPX'
const CERTIFICATE_ENVS = [PATH_ENV, PASSWORD_ENV, FINGERPRINT_ENV]

function isCertificateConfigured (environment) {
  return CERTIFICATE_ENVS.some(name => Boolean(environment[name]))
}

// `yarn make:win --arch <arch>` (see make.js) appends its trailing arguments to
// the last command of the make:win chain, which is this script. Only a
// validated `--arch` value is forwarded so the APPX target keeps the requested
// architecture; anything else is rejected before it can reach cmd.exe.
function parseArguments (argv) {
  const args = []
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== '--arch') {
      throw new Error(`[appx-signing] Unsupported argument: ${argv[index]}`)
    }
    index += 1
    args.push('--arch', validateBuildTarget(argv[index], 'win32').arch)
  }
  return args
}

function createAppxMakeInvocation ({ runtimePlatform, args = [] }) {
  if (runtimePlatform !== 'win32') {
    return {
      command: 'yarn',
      args: ['make:appx', ...args],
      options: { shell: false }
    }
  }

  return {
    command: 'C:\\Windows\\System32\\cmd.exe',
    args: ['/d', '/s', '/c', 'yarn.cmd', 'make:appx', ...args],
    options: { shell: false, windowsHide: true }
  }
}

function main () {
  const required = process.env[REQUIRE_ENV] === '1'
  if (!required && !isCertificateConfigured(process.env)) {
    console.log(`[appx-signing] No external APPX certificate configured; skipping make:appx (set ${REQUIRE_ENV}=1 to require it).`)
    return 0
  }

  const invocation = createAppxMakeInvocation({
    runtimePlatform: process.platform,
    args: parseArguments(process.argv.slice(2))
  })
  const result = spawnSync(invocation.command, invocation.args, {
    ...invocation.options,
    stdio: 'inherit'
  })
  if (result.error) {
    console.error(`[appx-signing] Failed to start Yarn: ${result.error.message}`)
    return 1
  }
  if (result.status === null) {
    console.error(`[appx-signing] make:appx was terminated by signal ${result.signal}.`)
    return 1
  }
  return result.status
}

if (require.main === module) {
  try {
    process.exitCode = main()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = {
  REQUIRE_ENV,
  createAppxMakeInvocation,
  isCertificateConfigured,
  parseArguments
}
