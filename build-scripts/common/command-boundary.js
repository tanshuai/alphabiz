'use strict'

function normalizeArchitecture (arch) {
  switch (arch) {
    case 'arm': return 'arm'
    case 'arm64': return 'arm64'
    case 'armv7l': return 'armv7l'
    case 'ia32': return 'ia32'
    case 'mips64el': return 'mips64el'
    case 'universal': return 'universal'
    case 'x64': return 'x64'
    default: throw new Error(`Unsupported BUILD_ARCH: ${arch}`)
  }
}

function normalizePlatform (platform) {
  switch (platform) {
    case 'darwin': return 'darwin'
    case 'linux': return 'linux'
    case 'mas': return 'mas'
    case 'win32': return 'win32'
    default: throw new Error(`Unsupported BUILD_PLATFORM: ${platform}`)
  }
}

function getMakeScript (platform) {
  switch (platform) {
    case 'darwin': return 'make:dmg'
    case 'linux': return 'make:deb'
    case 'mas': return 'make:dmg'
    case 'win32': return 'make:win'
    default: throw new Error(`Unsupported BUILD_PLATFORM: ${platform}`)
  }
}

function validateBuildTarget (arch, platform) {
  return {
    arch: normalizeArchitecture(arch),
    platform: normalizePlatform(platform)
  }
}

function createYarnInvocation ({ arch, platform, runtimePlatform }) {
  const target = validateBuildTarget(arch, platform)
  const script = getMakeScript(target.platform)
  if (runtimePlatform !== 'win32') {
    return {
      command: 'yarn',
      args: [script, '--arch', target.arch],
      options: { shell: false }
    }
  }

  return {
    command: 'C:\\Windows\\System32\\cmd.exe',
    args: ['/d', '/s', '/c', 'yarn.cmd', script, '--arch', target.arch],
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
  validateBuildTarget
}
