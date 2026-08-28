'use strict'

const fs = require('fs')
const path = require('path')

const ENV_NAME = 'ALPHABIZ_APPX_PFX_PATH'
const repositoryRoot = path.resolve(__dirname, '../../..')

function isInsideRepository (candidate) {
  const relativePath = path.relative(repositoryRoot, candidate)
  return relativePath === '' || (
    relativePath !== '..' &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  )
}

function getAppxSigningCertificatePath ({ required = false } = {}) {
  const configuredPath = process.env[ENV_NAME]

  if (!configuredPath) {
    if (required) {
      throw new Error(
        `[appx-signing] ${ENV_NAME} is required. Set it to an absolute .pfx path outside the repository.`
      )
    }
    return undefined
  }

  if (!path.isAbsolute(configuredPath)) {
    throw new Error(`[appx-signing] ${ENV_NAME} must be an absolute path.`)
  }

  if (!fs.existsSync(configuredPath)) {
    throw new Error(`[appx-signing] The configured certificate does not exist.`)
  }

  const certificatePath = fs.realpathSync(configuredPath)
  const certificate = fs.statSync(certificatePath)

  if (!certificate.isFile()) {
    throw new Error(`[appx-signing] The configured certificate must be a file.`)
  }

  if (path.extname(certificatePath).toLowerCase() !== '.pfx') {
    throw new Error(`[appx-signing] The configured certificate must use the .pfx extension.`)
  }

  if (isInsideRepository(certificatePath)) {
    throw new Error(`[appx-signing] The signing certificate must be stored outside the repository.`)
  }

  return certificatePath
}

if (require.main === module) {
  try {
    getAppxSigningCertificatePath({ required: true })
    console.log('[appx-signing] External signing certificate is configured.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = {
  ENV_NAME,
  getAppxSigningCertificatePath
}
