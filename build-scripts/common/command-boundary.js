'use strict'

const path = require('path')

const supportedArchitectures = new Set([
  'arm',
  'arm64',
  'armv7l',
  'ia32',
  'mips64el',
  'universal',
  'x64'
])
const makeScripts = new Map([
  ['darwin', 'make:dmg'],
  ['linux', 'make:deb'],
  ['mas', 'make:dmg'],
  ['win32', 'make:win']
])

function validateBuildTarget (arch, platform) {
  if (!supportedArchitectures.has(arch)) {
    throw new Error(`Unsupported BUILD_ARCH: ${arch}`)
  }
  if (!makeScripts.has(platform)) {
    throw new Error(`Unsupported BUILD_PLATFORM: ${platform}`)
  }
  return { arch, platform }
}

function createYarnInvocation ({ arch, platform, runtimePlatform, commandInterpreter }) {
  validateBuildTarget(arch, platform)
  const script = makeScripts.get(platform)
  if (runtimePlatform !== 'win32') {
    return {
      command: 'yarn',
      args: [script, '--arch', arch],
      options: { shell: false }
    }
  }

  const command = commandInterpreter || process.env.ComSpec || 'cmd.exe'
  if (
    command !== 'cmd.exe' &&
    (!path.win32.isAbsolute(command) || path.win32.basename(command).toLowerCase() !== 'cmd.exe')
  ) {
    throw new Error('Invalid Windows command interpreter')
  }
  return {
    command,
    args: ['/d', '/s', '/c', 'yarn.cmd', script, '--arch', arch],
    options: { shell: false, windowsHide: true }
  }
}

function createGitRestoreInvocation () {
  return {
    command: 'git',
    args: [
      'restore',
      '--worktree',
      '--',
      'build-scripts/windows/appx/template.xml',
      'package.json'
    ],
    options: { shell: false }
  }
}

module.exports = {
  createGitRestoreInvocation,
  createYarnInvocation,
  makeScripts,
  supportedArchitectures,
  validateBuildTarget
}
