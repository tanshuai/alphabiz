'use strict'

const SHA_PATTERN = /^[0-9a-f]{7,40}$/
const BUILD_TIME_PATTERN = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/

function parseVersion (value, label = 'version') {
  if (typeof value !== 'string' || value.startsWith('v')) {
    throw new Error(`${label} must be a strict SemVer string without a v prefix`)
  }

  const match = SEMVER_PATTERN.exec(value)
  if (!match) {
    throw new Error(`${label} is not strict SemVer: ${value}`)
  }
  return {
    raw: value,
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split('.') : [],
    build: match[5] ? match[5].split('.') : []
  }
}

function releaseChannel (value) {
  const parsed = parseVersion(value)
  return parsed.prerelease.length ? String(parsed.prerelease[0]) : 'stable'
}

function nativeVersion (value) {
  const parsed = parseVersion(value)
  return `${parsed.major}.${parsed.minor}.${parsed.patch}`
}

function validateSha (value, label) {
  if (typeof value !== 'string' || !SHA_PATTERN.test(value)) {
    throw new Error(`${label} must be a 7-40 character lowercase Git SHA`)
  }
  return value
}

function validateBuildTime (value) {
  const match = typeof value === 'string' && BUILD_TIME_PATTERN.exec(value)
  if (!match) {
    throw new Error('buildTime must use YYYYMMDDHHmm')
  }
  const [year, month, day, hour, minute] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute))
  if (year < 1970 ||
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day ||
      date.getUTCHours() !== hour ||
      date.getUTCMinutes() !== minute) {
    throw new Error(`buildTime is not a real calendar date and time: ${value}`)
  }
  return value
}

function validateReleaseRequest ({ newTag, expectedVersion, buildCommit, sourceCommit, stable = false }) {
  if (newTag === undefined) {
    if (stable) throw new Error('--stable requires --newTag')
    return
  }

  const parsedTag = parseVersion(newTag, 'release tag')
  if (newTag !== expectedVersion) {
    throw new Error(`Release tag must match declared version: ${expectedVersion}`)
  }
  if (buildCommit === undefined) {
    throw new Error('--newTag requires --SHA7 so release provenance is immutable')
  }
  if (sourceCommit === undefined) {
    throw new Error('--newTag requires --sourceSHA7 so source provenance is explicit')
  }
  validateSha(buildCommit, 'buildCommit')
  validateSha(sourceCommit, 'sourceCommit')
  if (stable && parsedTag.prerelease.length) {
    throw new Error('--stable cannot be used with a prerelease tag')
  }
}

function runtimeVersion ({ packageVersion, newTag, buildTime, buildCommit, sourceCommit }) {
  const parsedPackage = parseVersion(packageVersion, 'package version')
  const timestamp = validateBuildTime(buildTime)
  const commit = validateSha(buildCommit, 'buildCommit')
  const source = validateSha(sourceCommit, 'sourceCommit')

  if (newTag !== undefined) {
    const parsedTag = parseVersion(newTag, 'release tag')
    return {
      packageVer: newTag,
      channel: releaseChannel(newTag),
      buildTime: timestamp,
      buildCommit: commit,
      sourceCommit: source,
      version: parsedTag.raw
    }
  }

  const coreVersion = parsedPackage.prerelease.length
    ? `${parsedPackage.major}.${parsedPackage.minor}.${parsedPackage.patch}`
    : `${parsedPackage.major}.${parsedPackage.minor}.${parsedPackage.patch + 1}`

  return {
    packageVer: parsedPackage.raw,
    channel: 'nightly',
    buildTime: timestamp,
    buildCommit: commit,
    sourceCommit: source,
    version: `${coreVersion}-nightly-${timestamp}`
  }
}

function validateReleaseMetadata (packageJson, release) {
  if (!packageJson || !release) throw new Error('Missing release metadata')
  if (release.targetTagName !== 'main') {
    throw new Error('release.targetTagName must be main')
  }

  const packageVersion = parseVersion(packageJson.version, 'package version').raw
  const releaseVersion = parseVersion(release.newTagName, 'release tag').raw
  if (packageVersion !== releaseVersion) {
    throw new Error(`Version mismatch: package=${packageVersion}, release=${releaseVersion}`)
  }

  return {
    version: releaseVersion,
    channel: releaseChannel(releaseVersion),
    nativeVersion: nativeVersion(releaseVersion),
    target: release.targetTagName
  }
}

function validateBuiltVersion (packageJson, release, appManifest, runtimeVersions) {
  const metadata = validateReleaseMetadata(packageJson, release)
  if (!appManifest || appManifest.version !== metadata.version) {
    throw new Error(`Packaged app version mismatch: ${appManifest && appManifest.version}`)
  }
  if (!Array.isArray(runtimeVersions) || runtimeVersions.length === 0) {
    throw new Error('At least one generated runtime version is required')
  }

  for (const entry of runtimeVersions) {
    const label = entry && entry.label
    const value = entry && entry.value
    if (!label || !value) throw new Error('Malformed runtime version input')
    if (value.packageVer !== metadata.version || value.version !== metadata.version) {
      throw new Error(`${label} version does not match ${metadata.version}`)
    }
    if (value.channel !== metadata.channel) {
      throw new Error(`${label} channel does not match ${metadata.channel}`)
    }
    validateBuildTime(value.buildTime)
    validateSha(value.buildCommit, `${label} buildCommit`)
    validateSha(value.sourceCommit, `${label} sourceCommit`)
  }

  return metadata
}

module.exports = {
  nativeVersion,
  parseVersion,
  releaseChannel,
  runtimeVersion,
  validateBuiltVersion,
  validateBuildTime,
  validateReleaseMetadata,
  validateReleaseRequest,
  validateSha
}
