'use strict'

const { execFile } = require('child_process')
const fs = require('fs')
const minimist = require('minimist')
const {
  runtimeVersion,
  validateBuildTime,
  validateReleaseMetadata,
  validateReleaseRequest,
  validateSha
} = require('./scripts/release/version-contract')

const versionJSON = './public/version.json'
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const release = JSON.parse(fs.readFileSync('release.json', 'utf8'))
const releaseMetadata = validateReleaseMetadata(packageJson, release)
const unpackagedVersionObj = JSON.parse(
  fs.readFileSync('dist/electron/UnPackaged/version.json', 'utf8')
)

function git (...args) {
  return new Promise((resolve, reject) => {
    execFile('git', args, {
      env: { ...process.env, TZ: 'UTC-8' },
      encoding: 'utf8'
    }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Git failed: ${stderr.trim() || error.message}`))
        return
      }
      resolve(stdout.trim())
    })
  })
}

async function getBuildTime () {
  return validateBuildTime(await git(
    'log',
    '-1',
    '--date=format-local:%Y%m%d%H%M',
    '--format=%cd'
  ))
}

async function getCommit () {
  return validateSha(await git('rev-parse', '--short=8', 'HEAD'), 'buildCommit')
}

async function assertCurrentCommit (value) {
  const resolved = await git('rev-parse', '--verify', `${value}^{commit}`)
  const head = await git('rev-parse', 'HEAD')
  if (resolved !== head) {
    throw new Error(`buildCommit must resolve to current HEAD: ${head}`)
  }
}

async function updateVersionJSON () {
  const argv = minimist(process.argv.slice(2), {
    string: ['newTag', 'SHA7', 'sourceSHA7', 'buildTime'],
    boolean: ['stable']
  })

  validateReleaseRequest({
    newTag: argv.newTag,
    expectedVersion: releaseMetadata.version,
    buildCommit: argv.SHA7,
    sourceCommit: argv.sourceSHA7,
    stable: argv.stable
  })

  const buildTime = argv.buildTime === undefined
    ? await getBuildTime()
    : validateBuildTime(argv.buildTime)
  const buildCommit = argv.SHA7 === undefined
    ? await getCommit()
    : validateSha(argv.SHA7, 'buildCommit')
  if (argv.SHA7 !== undefined) await assertCurrentCommit(buildCommit)
  if (argv.newTag !== undefined && argv.buildTime !== undefined) {
    const commitBuildTime = await getBuildTime()
    if (buildTime !== commitBuildTime) {
      throw new Error(`release buildTime must match current HEAD: ${commitBuildTime}`)
    }
  }

  let sourceCommit
  if (argv.sourceSHA7 !== undefined) {
    sourceCommit = validateSha(argv.sourceSHA7, 'sourceCommit')
  } else if (/^[0-9a-f]{7,40}$/.test(unpackagedVersionObj.sourceCommit || '')) {
    sourceCommit = unpackagedVersionObj.sourceCommit
  } else {
    sourceCommit = buildCommit
  }

  const content = runtimeVersion({
    packageVersion: packageJson.version,
    newTag: argv.newTag,
    buildTime,
    buildCommit,
    sourceCommit
  })
  fs.writeFileSync(versionJSON, `${JSON.stringify(content, null, 2)}\n`)
}

updateVersionJSON().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
