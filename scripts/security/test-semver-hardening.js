'use strict'

const assert = require('assert').strict
const crypto = require('crypto')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const rootManifest = JSON.parse(
  fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8')
)
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
  .replace(/\r\n/g, '\n')
const lockBlocks = lockfile.split('\n\n').filter((block) =>
  block && block.split('\n', 1)[0].endsWith(':')
)
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key)

function selectorsFor (block) {
  const header = block.split('\n', 1)[0]
  assert.ok(header.endsWith(':'), `Malformed yarn.lock header: ${header}`)

  return header.slice(0, -1).split(/,\s+/).map((selector) => {
    if (selector.startsWith('"') && selector.endsWith('"')) {
      return selector.slice(1, -1)
    }
    return selector
  })
}

function normalizedHeader (block) {
  return `${selectorsFor(block).join(', ')}:`
}

function lockValue (block, key) {
  const match = block.match(new RegExp(`\\n  ${key} (?:"([^"]+)"|(\\S+))`))
  assert.ok(match, `${normalizedHeader(block)} has no ${key}`)
  return match[1] || match[2]
}

function semverDependency (block) {
  const matches = [...block.matchAll(/\n    semver (?:"([^"]+)"|(\S+))/g)]
  assert.ok(
    matches.length <= 1,
    `${normalizedHeader(block)} declares semver more than once`
  )
  if (matches.length === 0) return undefined
  return matches[0][1] || matches[0][2]
}

const expectedResolutions = {
  '**/core-js-compat/semver': '7.5.4',
  '**/utf7/semver': '5.7.2'
}

const actualSemverResolutions = Object.fromEntries(
  Object.entries(rootManifest.resolutions || {}).filter(([resolution]) =>
    resolution.replace(/\\/g, '/').split('/').pop() === 'semver'
  )
)
assert.deepEqual(
  actualSemverResolutions,
  expectedResolutions,
  'Use only the two reviewed, consumer-scoped semver resolutions'
)

for (const dependencyGroup of [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]) {
  assert.equal(
    rootManifest[dependencyGroup] && rootManifest[dependencyGroup].semver,
    undefined,
    `Root ${dependencyGroup} must not add a direct semver pin`
  )
}

const expectedLockBlocks = [
  [
    '"semver@2 || 3 || 4 || 5", semver@^5.3.0, semver@^5.5.0, semver@^5.6.0:',
    '  version "5.7.2"',
    '  resolved "https://registry.yarnpkg.com/semver/-/semver-5.7.2.tgz#48d55db737c3287cd4835e17fa13feace1c41ef8"',
    '  integrity sha512-cBznnQ9KjJqU67B52RMC65CMarK2600WFnbkcaiwWq3xy/5haFJlshgnpjovMVJ+Hff49d8GEn0b87C5pDQ10g=='
  ].join('\n'),
  [
    'semver@7.0.0, semver@7.5.4:',
    '  version "7.5.4"',
    '  resolved "https://registry.yarnpkg.com/semver/-/semver-7.5.4.tgz#483986ec4ed38e1c6c48c34894a9182dbff68a6e"',
    '  integrity sha512-1bCSESV6Pv+i21Hvpxp3Dx+pSD8lIPt8uVjRrxAUt/nbswYc+tK6Y2btiULjd4+fnq15PX+nqQDC7Oft7WkwcA==',
    '  dependencies:',
    '    lru-cache "^6.0.0"'
  ].join('\n'),
  [
    'semver@7.x, semver@^7.0.0, semver@^7.1.1, semver@^7.1.3, semver@^7.2.1, semver@^7.3.2, semver@^7.3.5:',
    '  version "7.5.4"',
    '  resolved "https://registry.yarnpkg.com/semver/-/semver-7.5.4.tgz#483986ec4ed38e1c6c48c34894a9182dbff68a6e"',
    '  integrity sha512-1bCSESV6Pv+i21Hvpxp3Dx+pSD8lIPt8uVjRrxAUt/nbswYc+tK6Y2btiULjd4+fnq15PX+nqQDC7Oft7WkwcA==',
    '  dependencies:',
    '    lru-cache "^6.0.0"'
  ].join('\n'),
  [
    'semver@^6.0.0, semver@^6.1.1, semver@^6.1.2, semver@^6.2.0, semver@^6.3.0:',
    '  version "6.3.1"',
    '  resolved "https://registry.yarnpkg.com/semver/-/semver-6.3.1.tgz#556d2ef8689146e46dcea4bfdd095f3434dffcb4"',
    '  integrity sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA=='
  ].join('\n'),
  [
    'semver@5.7.2, semver@~5.3.0:',
    '  version "5.7.2"',
    '  resolved "https://registry.yarnpkg.com/semver/-/semver-5.7.2.tgz#48d55db737c3287cd4835e17fa13feace1c41ef8"',
    '  integrity sha512-cBznnQ9KjJqU67B52RMC65CMarK2600WFnbkcaiwWq3xy/5haFJlshgnpjovMVJ+Hff49d8GEn0b87C5pDQ10g=='
  ].join('\n')
]

const semverBlocks = lockBlocks.filter((block) =>
  selectorsFor(block).some((selector) => selector.startsWith('semver@'))
)
assert.equal(semverBlocks.length, 5, 'Unexpected semver lock block count')
for (const expectedBlock of expectedLockBlocks) {
  const header = expectedBlock.split('\n', 1)[0]
  const actualBlock = semverBlocks.find((block) => block.split('\n', 1)[0] === header)
  assert.ok(actualBlock, `Missing frozen semver lock block: ${header}`)
  assert.equal(actualBlock, expectedBlock, `${header} changed from its reviewed lock block`)
}

const expectedConsumerLocks = [
  { header: '"@babel/core@7.16.12":', version: '7.16.12', range: '^6.3.0' },
  { header: '"@babel/core@^7.1.0", "@babel/core@^7.12.3", "@babel/core@^7.7.2", "@babel/core@^7.8.0":', version: '7.17.5', range: '^6.3.0' },
  { header: '"@babel/helper-compilation-targets@^7.13.0", "@babel/helper-compilation-targets@^7.16.7":', version: '7.16.7', range: '^6.3.0' },
  { header: '"@babel/helper-define-polyfill-provider@^0.3.1":', version: '0.3.1', range: '^6.1.2' },
  { header: '"@babel/preset-env@^7.16.8":', version: '7.16.11', range: '^6.3.0' },
  { header: '"@electron-forge/cli@^6.0.0-beta.63":', version: '6.0.0-beta.63', range: '^7.2.1' },
  { header: '"@electron-forge/core@6.0.0-beta.63":', version: '6.0.0-beta.63', range: '^7.2.1' },
  { header: '"@electron/get@^1.13.0", "@electron/get@^1.6.0", "@electron/get@^1.9.0":', version: '1.13.1', range: '^6.2.0' },
  { header: '"@electron/get@^2.0.0":', version: '2.0.2', range: '^6.2.0' },
  { header: '"@electron/rebuild@^3.2.10":', version: '3.2.10', range: '^7.3.5' },
  { header: '"@npmcli/fs@^1.0.0":', version: '1.1.1', range: '^7.3.5' },
  { header: '"@npmcli/fs@^2.1.0":', version: '2.1.2', range: '^7.3.5' },
  { header: 'appium-adb@^8.16.2, appium-adb@^8.18.0, appium-adb@^8.8.0:', version: '8.18.0', range: '^7.0.0' },
  { header: 'appium-android-driver@^4.20.0, appium-android-driver@^4.51.0, appium-android-driver@^4.54.0:', version: '4.54.0', range: '^7.0.0' },
  { header: 'appium-chromedriver@^4.13.0, appium-chromedriver@^4.23.1:', version: '4.28.0', range: '^7.0.0' },
  { header: 'appium-ios-device@^0.10.0:', version: '0.10.5', range: '^6.1.2' },
  { header: 'appium-ios-device@^1.7.0, appium-ios-device@^1.7.1, appium-ios-device@^1.8.0:', version: '1.8.0', range: '^7.0.0' },
  { header: 'appium-ios-simulator@^3.14.0, appium-ios-simulator@^3.23.0, appium-ios-simulator@^3.24.0, appium-ios-simulator@^3.28.0:', version: '3.29.0', range: '^7.0.0' },
  { header: 'appium-support@2.x, appium-support@^2.11.1, appium-support@^2.28.0, appium-support@^2.30.0, appium-support@^2.33.1, appium-support@^2.35.0, appium-support@^2.36.0, appium-support@^2.4.0, appium-support@^2.41.0, appium-support@^2.44.0, appium-support@^2.46.0, appium-support@^2.47.1, appium-support@^2.48.1, appium-support@^2.49.0, appium-support@^2.54.1, appium-support@^2.54.4, appium-support@^2.8.0:', version: '2.55.0', range: '^7.0.0' },
  { header: 'appium-xcode@^3.1.0, appium-xcode@^3.8.0:', version: '3.11.0', range: '^7.0.0' },
  { header: 'appium-xcuitest-driver@^3.17.0, appium-xcuitest-driver@^3.27.4, appium-xcuitest-driver@^3.59.0:', version: '3.62.0', range: '^7.0.0' },
  { header: 'appium@^1.22.2:', version: '1.22.2', range: '^7.0.0' },
  { header: 'async-listener@^0.6.0:', version: '0.6.10', range: '^5.3.0' },
  { header: 'babel-plugin-polyfill-corejs2@^0.3.0:', version: '0.3.1', range: '^6.1.1' },
  { header: 'core-js-compat@^3.20.2, core-js-compat@^3.21.0:', version: '3.21.1', range: '7.0.0' },
  { header: 'cross-spawn@^6.0.0, cross-spawn@^6.0.5:', version: '6.0.6', range: '^5.5.0' },
  { header: 'cypress@^9.3.1:', version: '9.5.0', range: '^7.3.2' },
  { header: 'electron-installer-common@^0.10.2:', version: '0.10.3', range: '^7.1.1' },
  { header: 'electron-installer-snap@^5.1.0:', version: '5.2.0', range: '^7.1.1' },
  { header: 'electron-packager@^15.4.0:', version: '15.4.0', range: '^7.1.3' },
  { header: 'electron-packager@^17.1.1:', version: '17.1.1', range: '^7.1.3' },
  { header: 'electron-rebuild@^3.2.6, electron-rebuild@^3.2.7:', version: '3.2.7', range: '^7.3.5' },
  { header: 'electron-wix-msi@^3.0.6, electron-wix-msi@^4.0.0:', version: '4.0.0', range: '^7.3.5' },
  { header: 'global-agent@^3.0.0:', version: '3.0.0', range: '^7.3.2' },
  { header: 'istanbul-lib-instrument@^5.0.4, istanbul-lib-instrument@^5.1.0:', version: '5.1.0', range: '^6.3.0' },
  { header: 'jest-snapshot@^27.5.1:', version: '27.5.1', range: '^7.3.2' },
  { header: 'jsonwebtoken@^8.5.1:', version: '8.5.1', range: '^5.6.0' },
  { header: 'make-dir@^2.0.0:', version: '2.1.0', range: '^5.6.0' },
  { header: 'make-dir@^3.0.0:', version: '3.1.0', range: '^6.0.0' },
  { header: 'node-abi@^3.0.0:', version: '3.43.0', range: '^7.3.5' },
  { header: 'node-api-version@^0.1.4:', version: '0.1.4', range: '^7.3.5' },
  { header: 'node-gyp@^8.4.0:', version: '8.4.1', range: '^7.3.5' },
  { header: 'node-gyp@^9.0.0:', version: '9.3.1', range: '^7.3.5' },
  { header: 'node-simctl@^6.0.2, node-simctl@^6.3.2, node-simctl@^6.4.0, node-simctl@^6.6.0:', version: '6.6.0', range: '^7.0.0' },
  { header: 'normalize-package-data@^2.3.2:', version: '2.5.0', range: '2 || 3 || 4 || 5' },
  { header: 'patch-package@^6.4.7:', version: '6.4.7', range: '^5.6.0' },
  { header: 'ts-jest@^27.1.3:', version: '27.1.3', range: '7.x' },
  { header: 'utf7@>=1.0.2, utf7@^1.0.2:', version: '1.0.2', range: '~5.3.0' }
]

for (const expected of expectedConsumerLocks) {
  const block = lockBlocks.find((candidate) => candidate.split('\n', 1)[0] === expected.header)
  assert.ok(block, `Missing semver consumer lock block: ${expected.header}`)
  assert.equal(lockValue(block, 'version'), expected.version)
  assert.equal(semverDependency(block), expected.range)
}

const expectedConsumerEdges = expectedConsumerLocks.flatMap((expected) => {
  const block = lockBlocks.find((candidate) => candidate.split('\n', 1)[0] === expected.header)
  return selectorsFor(block).map((selector) => `${selector} -> ${expected.range}`)
}).sort()
const actualConsumerEdges = lockBlocks.flatMap((block) => {
  const dependency = semverDependency(block)
  if (!dependency) return []
  return selectorsFor(block).map((selector) => `${selector} -> ${dependency}`)
}).sort()
assert.equal(actualConsumerEdges.length, 92, 'Unexpected semver descriptor edge count')
assert.deepEqual(
  actualConsumerEdges,
  expectedConsumerEdges,
  'The semver consumer graph changed; review every new or removed edge'
)

const patchedVersions = new Set(['5.7.2', '6.3.1', '7.5.4'])

function assertSafeSemverVersion (version, label) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(version)
  assert.ok(match, `${label} has a malformed semver version: ${version}`)
  const major = Number(match[1])
  const minimum = { 5: [5, 7, 2], 6: [6, 3, 1], 7: [7, 5, 2] }[major]
  assert.ok(minimum, `${label} uses an unreviewed semver major: ${version}`)
  const parts = [Number(match[1]), Number(match[2]), Number(match[3])]
  const safe = parts[0] > minimum[0] ||
    (parts[0] === minimum[0] && parts[1] > minimum[1]) ||
    (parts[0] === minimum[0] && parts[1] === minimum[1] && parts[2] >= minimum[2])
  assert.equal(safe, true, `${label} remains vulnerable to GHSA-c2qf-rxjj-qqgw: ${version}`)
}

const unpackagedManifestPath = path.join(
  repositoryRoot,
  'dist',
  'electron',
  'UnPackaged',
  'package.json'
)
const unpackagedManifest = JSON.parse(fs.readFileSync(unpackagedManifestPath, 'utf8'))
assert.equal(unpackagedManifest.dependencies.semver, '7.5.3')
assertSafeSemverVersion(
  unpackagedManifest.dependencies.semver,
  'dist/electron/UnPackaged/package.json direct semver pin'
)

function portableRelative (file) {
  return path.relative(repositoryRoot, file).split(path.sep).join('/')
}

function visitPackage (packageDirectory, graph) {
  const stat = fs.lstatSync(packageDirectory)
  if (!stat.isDirectory() || stat.isSymbolicLink()) return

  const manifestPath = path.join(packageDirectory, 'package.json')
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    if (manifest.name === 'semver') {
      graph.installations.push({ directory: packageDirectory, manifest, manifestPath })
    }

    const declarations = [
      'dependencies',
      'optionalDependencies',
      'peerDependencies'
    ].flatMap((dependencyGroup) => {
      const dependencies = manifest[dependencyGroup] || {}
      if (!hasOwn(dependencies, 'semver')) return []
      return [{ dependencyGroup, range: dependencies.semver }]
    })

    assert.ok(
      declarations.length <= 1,
      `${portableRelative(manifestPath)} declares semver in multiple dependency groups`
    )
    if (declarations.length === 1) {
      graph.consumers.push({
        directory: packageDirectory,
        manifest,
        manifestPath,
        dependencyGroup: declarations[0].dependencyGroup,
        range: declarations[0].range
      })
    }
  }

  const nestedNodeModules = path.join(packageDirectory, 'node_modules')
  if (fs.existsSync(nestedNodeModules)) visitNodeModules(nestedNodeModules, graph)
}

function visitNodeModules (nodeModulesDirectory, graph) {
  for (const entry of fs.readdirSync(nodeModulesDirectory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || !entry.isDirectory()) continue
    const entryPath = path.join(nodeModulesDirectory, entry.name)
    if (entry.name.startsWith('@')) {
      for (const scopedEntry of fs.readdirSync(entryPath, { withFileTypes: true })) {
        if (scopedEntry.isDirectory()) visitPackage(path.join(entryPath, scopedEntry.name), graph)
      }
    } else {
      visitPackage(entryPath, graph)
    }
  }
}

const nodeModulesDirectory = path.join(repositoryRoot, 'node_modules')
assert.ok(fs.existsSync(nodeModulesDirectory), 'node_modules is missing; run the frozen install first')

const physicalGraph = { installations: [], consumers: [] }
visitNodeModules(nodeModulesDirectory, physicalGraph)
physicalGraph.installations.sort((left, right) =>
  portableRelative(left.manifestPath).localeCompare(portableRelative(right.manifestPath))
)
physicalGraph.consumers.sort((left, right) =>
  portableRelative(left.manifestPath).localeCompare(portableRelative(right.manifestPath))
)

const expectedPhysicalInstallations = [
  'node_modules/@babel/core/node_modules/semver/package.json -> 6.3.1',
  'node_modules/@babel/helper-compilation-targets/node_modules/semver/package.json -> 6.3.1',
  'node_modules/@babel/helper-define-polyfill-provider/node_modules/semver/package.json -> 6.3.1',
  'node_modules/@babel/preset-env/node_modules/semver/package.json -> 6.3.1',
  'node_modules/@electron-forge/maker-dmg/node_modules/@electron/get/node_modules/semver/package.json -> 6.3.1',
  'node_modules/@electron-forge/maker-snap/node_modules/@electron/get/node_modules/semver/package.json -> 6.3.1',
  'node_modules/@electron/get/node_modules/semver/package.json -> 6.3.1',
  'node_modules/@jest/transform/node_modules/semver/package.json -> 6.3.1',
  'node_modules/appium-remote-debugger/node_modules/semver/package.json -> 6.3.1',
  'node_modules/async-listener/node_modules/semver/package.json -> 5.7.2',
  'node_modules/babel-plugin-polyfill-corejs2/node_modules/semver/package.json -> 6.3.1',
  'node_modules/electron/node_modules/semver/package.json -> 6.3.1',
  'node_modules/execa/node_modules/semver/package.json -> 5.7.2',
  'node_modules/istanbul-lib-instrument/node_modules/semver/package.json -> 6.3.1',
  'node_modules/istanbul-lib-report/node_modules/semver/package.json -> 6.3.1',
  'node_modules/jest-config/node_modules/semver/package.json -> 6.3.1',
  'node_modules/jest-snapshot/node_modules/@babel/core/node_modules/semver/package.json -> 6.3.1',
  'node_modules/jsonwebtoken/node_modules/semver/package.json -> 5.7.2',
  'node_modules/make-dir/node_modules/semver/package.json -> 5.7.2',
  'node_modules/normalize-package-data/node_modules/semver/package.json -> 5.7.2',
  'node_modules/patch-package/node_modules/semver/package.json -> 5.7.2',
  'node_modules/semver/package.json -> 7.5.4',
  'node_modules/utf7/node_modules/semver/package.json -> 5.7.2',
  'node_modules/yarn-or-npm/node_modules/semver/package.json -> 5.7.2'
].sort()

const actualPhysicalInstallations = physicalGraph.installations.map((installation) =>
  `${portableRelative(installation.manifestPath)} -> ${installation.manifest.version}`
).sort()
assert.equal(actualPhysicalInstallations.length, 24, 'Unexpected physical semver copy count')
assert.deepEqual(
  actualPhysicalInstallations,
  expectedPhysicalInstallations,
  'Unexpected physical semver installation entered node_modules'
)
for (const installation of physicalGraph.installations) {
  assert.ok(patchedVersions.has(installation.manifest.version))
  assertSafeSemverVersion(installation.manifest.version, portableRelative(installation.manifestPath))
}

const expectedPhysicalConsumers = [
  'node_modules/@babel/core/package.json -> @babel/core@7.16.12 -> semver@^6.3.0',
  'node_modules/@babel/helper-compilation-targets/package.json -> @babel/helper-compilation-targets@7.16.7 -> semver@^6.3.0',
  'node_modules/@babel/helper-define-polyfill-provider/package.json -> @babel/helper-define-polyfill-provider@0.3.1 -> semver@^6.1.2',
  'node_modules/@babel/preset-env/package.json -> @babel/preset-env@7.16.11 -> semver@^6.3.0',
  'node_modules/@electron-forge/cli/package.json -> @electron-forge/cli@6.0.0-beta.63 -> semver@^7.2.1',
  'node_modules/@electron-forge/core/package.json -> @electron-forge/core@6.0.0-beta.63 -> semver@^7.2.1',
  'node_modules/@electron-forge/maker-dmg/node_modules/@electron/get/package.json -> @electron/get@2.0.2 -> semver@^6.2.0',
  'node_modules/@electron-forge/maker-dmg/node_modules/electron-packager/package.json -> electron-packager@17.1.1 -> semver@^7.1.3',
  'node_modules/@electron-forge/maker-snap/node_modules/@electron/get/package.json -> @electron/get@2.0.2 -> semver@^6.2.0',
  'node_modules/@electron-forge/maker-snap/node_modules/electron-packager/package.json -> electron-packager@17.1.1 -> semver@^7.1.3',
  'node_modules/@electron/get/package.json -> @electron/get@1.13.1 -> semver@^6.2.0',
  'node_modules/@electron/rebuild/node_modules/@npmcli/fs/package.json -> @npmcli/fs@2.1.2 -> semver@^7.3.5',
  'node_modules/@electron/rebuild/node_modules/node-gyp/package.json -> node-gyp@9.3.1 -> semver@^7.3.5',
  'node_modules/@electron/rebuild/package.json -> @electron/rebuild@3.2.10 -> semver@^7.3.5',
  'node_modules/@jest/transform/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> semver@^6.3.0',
  'node_modules/@npmcli/fs/package.json -> @npmcli/fs@1.1.1 -> semver@^7.3.5',
  'node_modules/appium-adb/package.json -> appium-adb@8.18.0 -> semver@^7.0.0',
  'node_modules/appium-android-driver/package.json -> appium-android-driver@4.54.0 -> semver@^7.0.0',
  'node_modules/appium-chromedriver/package.json -> appium-chromedriver@4.28.0 -> semver@^7.0.0',
  'node_modules/appium-ios-device/package.json -> appium-ios-device@1.8.0 -> semver@^7.0.0',
  'node_modules/appium-ios-simulator/package.json -> appium-ios-simulator@3.29.0 -> semver@^7.0.0',
  'node_modules/appium-remote-debugger/node_modules/appium-ios-device/package.json -> appium-ios-device@0.10.5 -> semver@^6.1.2',
  'node_modules/appium-support/package.json -> appium-support@2.55.0 -> semver@^7.0.0',
  'node_modules/appium-xcode/package.json -> appium-xcode@3.11.0 -> semver@^7.0.0',
  'node_modules/appium-xcuitest-driver/package.json -> appium-xcuitest-driver@3.62.0 -> semver@^7.0.0',
  'node_modules/appium/package.json -> appium@1.22.2 -> semver@^7.0.0',
  'node_modules/async-listener/package.json -> async-listener@0.6.10 -> semver@^5.3.0',
  'node_modules/babel-plugin-polyfill-corejs2/package.json -> babel-plugin-polyfill-corejs2@0.3.1 -> semver@^6.1.1',
  'node_modules/core-js-compat/package.json -> core-js-compat@3.21.1 -> semver@7.0.0',
  'node_modules/cypress/package.json -> cypress@9.5.0 -> semver@^7.3.2',
  'node_modules/electron-packager/package.json -> electron-packager@15.4.0 -> semver@^7.1.3',
  'node_modules/electron-rebuild/package.json -> electron-rebuild@3.2.7 -> semver@^7.3.5',
  'node_modules/electron-wix-msi/package.json -> electron-wix-msi@4.0.0 -> semver@^7.3.5',
  'node_modules/electron/node_modules/@electron/get/package.json -> @electron/get@2.0.2 -> semver@^6.2.0',
  'node_modules/execa/node_modules/cross-spawn/package.json -> cross-spawn@6.0.6 -> semver@^5.5.0',
  'node_modules/istanbul-lib-instrument/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> semver@^6.3.0',
  'node_modules/istanbul-lib-instrument/package.json -> istanbul-lib-instrument@5.1.0 -> semver@^6.3.0',
  'node_modules/istanbul-lib-report/node_modules/make-dir/package.json -> make-dir@3.1.0 -> semver@^6.0.0',
  'node_modules/jest-config/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> semver@^6.3.0',
  'node_modules/jest-snapshot/node_modules/@babel/core/package.json -> @babel/core@7.17.5 -> semver@^6.3.0',
  'node_modules/jest-snapshot/package.json -> jest-snapshot@27.5.1 -> semver@^7.3.2',
  'node_modules/jsonwebtoken/package.json -> jsonwebtoken@8.5.1 -> semver@^5.6.0',
  'node_modules/make-dir/package.json -> make-dir@2.1.0 -> semver@^5.6.0',
  'node_modules/node-abi/package.json -> node-abi@3.43.0 -> semver@^7.3.5',
  'node_modules/node-api-version/package.json -> node-api-version@0.1.4 -> semver@^7.3.5',
  'node_modules/node-gyp/package.json -> node-gyp@8.4.1 -> semver@^7.3.5',
  'node_modules/node-simctl/package.json -> node-simctl@6.6.0 -> semver@^7.0.0',
  'node_modules/normalize-package-data/package.json -> normalize-package-data@2.5.0 -> semver@2 || 3 || 4 || 5',
  'node_modules/patch-package/node_modules/cross-spawn/package.json -> cross-spawn@6.0.6 -> semver@^5.5.0',
  'node_modules/patch-package/package.json -> patch-package@6.4.7 -> semver@^5.6.0',
  'node_modules/ts-jest/package.json -> ts-jest@27.1.3 -> semver@7.x',
  'node_modules/utf7/package.json -> utf7@1.0.2 -> semver@~5.3.0',
  'node_modules/yarn-or-npm/node_modules/cross-spawn/package.json -> cross-spawn@6.0.6 -> semver@^5.5.0'
].sort()

const actualPhysicalConsumers = physicalGraph.consumers.map((consumer) => [
  `${portableRelative(consumer.manifestPath)} ->`,
  `${consumer.manifest.name}@${consumer.manifest.version} ->`,
  `semver@${consumer.range}`
].join(' ')).sort()
assert.equal(actualPhysicalConsumers.length, 53, 'Unexpected physical semver consumer count')
assert.deepEqual(
  actualPhysicalConsumers,
  expectedPhysicalConsumers,
  'Unexpected physical semver consumer entered node_modules'
)

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  const directory = path.dirname(manifestPath)
  const modulePath = require.resolve(name, { paths: [searchPath] })
  const relativeModule = path.relative(directory, modulePath)
  assert.ok(
    relativeModule && !relativeModule.startsWith(`..${path.sep}`) && !path.isAbsolute(relativeModule),
    `${name} resolved outside its physical package directory`
  )
  return {
    directory,
    manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath
  }
}

const installationByManifest = new Map(physicalGraph.installations.map((installation) => [
  fs.realpathSync(installation.manifestPath),
  installation
]))
const forcedConsumerPaths = new Map([
  ['node_modules/core-js-compat/package.json', '7.5.4'],
  ['node_modules/utf7/package.json', '5.7.2']
])
const incompatibleForcedConsumers = []

for (const consumer of physicalGraph.consumers) {
  const semverPackage = resolvePackage('semver', consumer.directory)
  const installation = installationByManifest.get(fs.realpathSync(semverPackage.manifestPath))
  const consumerPath = portableRelative(consumer.manifestPath)
  assert.ok(installation, `${consumerPath} resolves an untracked semver copy`)
  assertSafeSemverVersion(semverPackage.manifest.version, `${consumerPath} resolved semver`)

  const semverApi = require(semverPackage.modulePath)
  const satisfiesDeclaredRange = semverApi.satisfies(
    semverPackage.manifest.version,
    consumer.range
  )
  if (forcedConsumerPaths.has(consumerPath)) {
    assert.equal(semverPackage.manifest.version, forcedConsumerPaths.get(consumerPath))
    assert.equal(satisfiesDeclaredRange, false, `${consumerPath} no longer needs its scoped override`)
    incompatibleForcedConsumers.push(consumerPath)
  } else {
    assert.equal(
      satisfiesDeclaredRange,
      true,
      `${consumerPath} resolves semver ${semverPackage.manifest.version} outside ${consumer.range}`
    )
  }
}
assert.deepEqual(incompatibleForcedConsumers.sort(), [...forcedConsumerPaths.keys()].sort())

function packageTreeDigest (packageDirectory) {
  const files = []

  function visit (directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'node_modules') continue
      const entryPath = path.join(directory, entry.name)
      const stat = fs.lstatSync(entryPath)
      assert.equal(stat.isSymbolicLink(), false, `${portableRelative(entryPath)} is an unexpected symlink`)
      if (stat.isDirectory()) {
        visit(entryPath)
      } else {
        assert.equal(stat.isFile(), true, `${portableRelative(entryPath)} is not a regular file`)
        files.push(entryPath)
      }
    }
  }

  visit(packageDirectory)
  files.sort((left, right) => {
    const leftPath = path.relative(packageDirectory, left).split(path.sep).join('/')
    const rightPath = path.relative(packageDirectory, right).split(path.sep).join('/')
    return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0
  })

  const digest = crypto.createHash('sha256')
  let bytes = 0
  for (const file of files) {
    const relativeFile = path.relative(packageDirectory, file).split(path.sep).join('/')
    const contents = fs.readFileSync(file)
    bytes += contents.length
    digest.update(relativeFile)
    digest.update(Buffer.from([0]))
    digest.update(String(contents.length))
    digest.update(Buffer.from([0]))
    digest.update(contents)
    digest.update(Buffer.from([0]))
  }
  return { files: files.length, bytes, sha256: digest.digest('hex') }
}

const expectedPackageTrees = {
  '5.7.2': {
    files: 6,
    bytes: 63315,
    sha256: 'ce94db38fc3d0ba38581e7d75ae67a1c7cae9823c32361831f938e9941a40e1c'
  },
  '6.3.1': {
    files: 6,
    bytes: 68343,
    sha256: '128aed07bd5179d001aa214505e68cf59e512b726d5e72f33b6d0dab22d4e702'
  },
  '7.5.4': {
    files: 51,
    bytes: 93401,
    sha256: 'd25d39d0abb155e4587c00049325eb76f148c8b73549ef1a5021814019ac2339'
  }
}

for (const installation of physicalGraph.installations) {
  assert.deepEqual(
    packageTreeDigest(installation.directory),
    expectedPackageTrees[installation.manifest.version],
    `${portableRelative(installation.manifestPath)} differs from the reviewed npm package bytes`
  )
}

function runChildProbe (label, source, args, timeout = 5000) {
  const probe = spawnSync(process.execPath, [
    '--max-old-space-size=64',
    '-e',
    source,
    ...args
  ], {
    encoding: 'utf8',
    timeout,
    maxBuffer: 256 * 1024,
    windowsHide: true
  })

  assert.equal(
    probe.error,
    undefined,
    `${label} failed to execute within its resource bound: ${probe.error && probe.error.message}`
  )
  assert.equal(probe.signal, null, `${label} terminated by ${probe.signal}`)
  assert.equal(probe.status, 0, `${label} failed: ${probe.stderr}`)
}

const semverProbeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const semver = require(process.argv[1])',
  'const manifest = require(process.argv[2])',
  'const expectedVersion = process.argv[3]',
  'assert.equal(manifest.version, expectedVersion)',
  "assert.equal(semver.valid('1.2.3'), '1.2.3')",
  "assert.equal(semver.valid('v2.0.0-beta.1'), '2.0.0-beta.1')",
  "assert.equal(semver.valid('1.02.3'), null)",
  "assert.equal(semver.clean(' =v1.2.3 '), '1.2.3')",
  "assert.equal(semver.compare('1.2.3', '1.2.4'), -1)",
  "assert.equal(semver.rcompare('1.2.3', '1.2.4'), 1)",
  "assert.equal(semver.inc('1.2.3', 'minor'), '1.3.0')",
  "assert.equal(semver.diff('1.2.3', '2.0.0'), 'major')",
  "assert.equal(semver.satisfies('1.2.4', '^1.2.3'), true)",
  "assert.equal(semver.satisfies('2.0.0', '^1.2.3'), false)",
  "assert.equal(semver.maxSatisfying(['1.2.3', '1.4.0', '2.0.0'], '^1.0.0'), '1.4.0')",
  "assert.equal(semver.minSatisfying(['1.2.3', '1.4.0', '2.0.0'], '^1.0.0'), '1.2.3')",
  "assert.equal(semver.minVersion('>=1.2.3 <2').version, '1.2.3')",
  "assert.equal(semver.satisfies('2.0.0', '== 1.0.0 || foo', { loose: true }), false)",
  "const whitespace = ' '.repeat(500000)",
  "const range = `>=1.2.3 ${whitespace} <1.3.0`",
  "assert.equal(semver.satisfies('1.2.4', range), true)",
  "assert.equal(semver.satisfies('1.3.0', range), false)",
  "assert.equal(semver.validRange(`1.2.3${whitespace}-`), null)",
  "const comparator = new semver.Comparator(`>${whitespace}1.2.3`)",
  "assert.equal(comparator.test('1.2.4'), true)",
  "assert.equal(comparator.test('1.2.3'), false)",
  "assert.throws(() => new semver.Comparator(`>${whitespace}not-a-version`), TypeError)"
].join('\n')

const firstInstallationByVersion = new Map()
for (const installation of physicalGraph.installations) {
  if (!firstInstallationByVersion.has(installation.manifest.version)) {
    firstInstallationByVersion.set(
      installation.manifest.version,
      resolvePackage('semver', installation.directory)
    )
  }
}
for (const expectedVersion of patchedVersions) {
  const semverPackage = firstInstallationByVersion.get(expectedVersion)
  assert.ok(semverPackage, `No installed semver ${expectedVersion} copy was found`)
  runChildProbe(
    `semver ${expectedVersion} ReDoS and normal corpus`,
    semverProbeSource,
    [semverPackage.modulePath, semverPackage.manifestPath, expectedVersion],
    5000
  )
}

const rootSemverPackage = resolvePackage('semver', repositoryRoot)
assert.equal(rootSemverPackage.manifest.version, '7.5.4')
const rootSemver = require(rootSemverPackage.modulePath)
assert.equal(
  rootSemver.satisfies('2.0.0', '== 1.0.0 || foo', { loose: true }),
  false,
  'semver 7.x regressed the loose invalid-OR behavior fixed after 7.5.2'
)

const utf7Package = resolvePackage('utf7', repositoryRoot)
const imapPackage = resolvePackage('imap', repositoryRoot)
assert.equal(utf7Package.manifest.version, '1.0.2')
assert.equal(utf7Package.manifest.dependencies.semver, '~5.3.0')
assert.equal(imapPackage.manifest.version, '0.8.19')
assert.equal(imapPackage.manifest.dependencies.utf7, '>=1.0.2')
assert.equal(
  fs.realpathSync(require.resolve('semver/package.json', { paths: [utf7Package.directory] })),
  fs.realpathSync(path.join(utf7Package.directory, 'node_modules', 'semver', 'package.json'))
)

const utf7 = require(utf7Package.modulePath)
const mailboxName = '收件箱 & Archive'
const encodedMailbox = utf7.imap.encode(mailboxName)
assert.equal(encodedMailbox, '&ZTZO9nux- &- Archive')
assert.equal(utf7.imap.decode(encodedMailbox), mailboxName)

const ImapConnection = require(imapPackage.modulePath)
const imap = new ImapConnection({ user: 'fixture', password: 'fixture', host: '127.0.0.1' })
let imapCommand
imap._enqueue = (command) => { imapCommand = command }
imap.addBox(mailboxName, () => {})
assert.equal(imapCommand, 'CREATE "&ZTZO9nux- &- Archive"')

const coreJsCompatPackage = resolvePackage('core-js-compat', repositoryRoot)
assert.equal(coreJsCompatPackage.manifest.version, '3.21.1')
assert.equal(coreJsCompatPackage.manifest.dependencies.semver, '7.0.0')
assert.equal(
  fs.realpathSync(require.resolve('semver/package.json', { paths: [coreJsCompatPackage.directory] })),
  fs.realpathSync(path.join(repositoryRoot, 'node_modules', 'semver', 'package.json'))
)
const coreJsCompat = require(coreJsCompatPackage.modulePath)
const chrome80Compatibility = coreJsCompat({ targets: { chrome: '80' } })
assert.ok(chrome80Compatibility.list.length > 100)
assert.ok(chrome80Compatibility.list.includes('es.array.at'))
assert.ok(coreJsCompat.getModulesListForTargetVersion('3.20').length > 350)

const babelPackage = resolvePackage('@babel/core', repositoryRoot)
const presetEnvPackage = resolvePackage('@babel/preset-env', repositoryRoot)
const babel = require(babelPackage.modulePath)
const presetEnvExports = require(presetEnvPackage.modulePath)
const presetEnv = presetEnvExports.default || presetEnvExports
const transformed = babel.transformSync([
  'const result = globalThis.Promise.any([Promise.resolve(1)])',
  'const value = input?.nested ?? 7'
].join('\n'), {
  babelrc: false,
  configFile: false,
  presets: [[presetEnv, {
    targets: { chrome: '70' },
    modules: false,
    useBuiltIns: 'usage',
    corejs: '3.20'
  }]]
})
assert.ok(transformed.code.includes('core-js/modules/es.global-this.js'))
assert.equal(transformed.code.includes('?.'), false)
assert.equal(transformed.code.includes('??'), false)

const nodeAbiPackage = resolvePackage('node-abi', repositoryRoot)
const nodeApiVersionPackage = resolvePackage('node-api-version', repositoryRoot)
const nodeAbi = require(nodeAbiPackage.modulePath)
const nodeApiVersion = require(nodeApiVersionPackage.modulePath)
assert.equal(nodeAbi.getAbi('21.3.3', 'electron'), '109')
assert.equal(nodeAbi.getAbi('16.17.0', 'node'), '93')
assert.equal(nodeAbi.getTarget('109', 'electron'), '21.0.0')
assert.equal(nodeApiVersion.fromElectronVersion('21.3.3'), 8)
assert.equal(nodeApiVersion.fromNodeVersion('16.17.0'), 8)

const tsJestPackage = resolvePackage('ts-jest', repositoryRoot)
const tsJestVersionCheckerPath = path.join(
  tsJestPackage.directory,
  'dist',
  'utils',
  'version-checkers.js'
)
assert.equal(fs.existsSync(tsJestVersionCheckerPath), true)
const { VersionCheckers } = require(tsJestVersionCheckerPath)
assert.equal(VersionCheckers.jest.raise(), true)
assert.equal(VersionCheckers.babelJest.raise(), true)
assert.equal(VersionCheckers.babelCore.raise(), true)

let activeBuildFixtureDirectory

async function runBuildConsumerProbes () {
  const fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'alphabiz-semver-'))
  activeBuildFixtureDirectory = fixtureDirectory
  try {
    const electronDirectory = path.join(fixtureDirectory, 'node_modules', 'electron')
    fs.mkdirSync(electronDirectory, { recursive: true })
    const fixtureManifest = {
      name: 'alphabiz-semver-fixture',
      productName: 'AlphaBiz Semver Fixture',
      version: '2.7.4-beta.1',
      author: 'Alpha Biz',
      devDependencies: { electron: '^21.0.0' }
    }
    fs.writeFileSync(
      path.join(fixtureDirectory, 'package.json'),
      `${JSON.stringify(fixtureManifest, null, 2)}\n`
    )
    fs.writeFileSync(
      path.join(electronDirectory, 'package.json'),
      '{"name":"electron","version":"21.3.3","main":"index.js"}\n'
    )
    fs.writeFileSync(path.join(electronDirectory, 'index.js'), "'use strict'\nmodule.exports = {}\n")

    const forgeCorePackage = resolvePackage('@electron-forge/core', repositoryRoot)
    const forgeCore = require(forgeCorePackage.modulePath)
    assert.equal(
      await forgeCore.utils.getElectronVersion(fixtureDirectory, fixtureManifest),
      '21.3.3'
    )
    assert.equal(
      await forgeCore.utils.getElectronVersion(fixtureDirectory, {
        devDependencies: { electron: '21.3.3' }
      }),
      '21.3.3'
    )

    const electronPackagerPackage = resolvePackage('electron-packager', repositoryRoot)
    const inferPackageMetadata = require(path.join(electronPackagerPackage.directory, 'src', 'infer.js'))
    const packagerOptions = {}
    await inferPackageMetadata(['linux'], packagerOptions, fixtureDirectory)
    assert.equal(packagerOptions.name, 'AlphaBiz Semver Fixture')
    assert.equal(packagerOptions.appVersion, '2.7.4-beta.1')
    assert.equal(packagerOptions.electronVersion, '21.3.3')

    const wixPackage = resolvePackage('electron-wix-msi', repositoryRoot)
    const wixVersionUtils = require(path.join(wixPackage.directory, 'lib', 'utils', 'version-util.js'))
    assert.equal(wixVersionUtils.getWindowsCompliantVersion('2.7.4-beta.1'), '2.7.4.0')
    assert.equal(wixVersionUtils.getWindowsCompliantVersion('2.7.4.9'), '2.7.4.9')
    assert.throws(
      () => wixVersionUtils.getWindowsCompliantVersion('not-a-version'),
      /Could not parse semantic version/
    )
    const { MSICreator } = require(wixPackage.modulePath)
    const wixCreator = new MSICreator({
      appDirectory: fixtureDirectory,
      outputDirectory: fixtureDirectory,
      exe: 'AlphaBiz.exe',
      name: 'AlphaBiz',
      manufacturer: 'Alpha Biz',
      description: 'Semver fixture',
      version: '2.7.4-beta.1'
    })
    assert.equal(wixCreator.semanticVersion, '2.7.4-beta.1')
    assert.equal(wixCreator.windowsCompliantVersion, '2.7.4.0')
  } finally {
    fs.rmSync(fixtureDirectory, { recursive: true, force: true })
    activeBuildFixtureDirectory = undefined
  }
  assert.equal(fs.existsSync(fixtureDirectory), false, 'semver fixture was not cleaned up')
}

process.exitCode = 1
const buildConsumerTimeout = setTimeout(() => {
  if (activeBuildFixtureDirectory) {
    fs.rmSync(activeBuildFixtureDirectory, { recursive: true, force: true })
    activeBuildFixtureDirectory = undefined
  }
  console.error('semver build-consumer probes timed out')
  process.exit(1)
}, 10000)

runBuildConsumerProbes().then(() => {
  clearTimeout(buildConsumerTimeout)
  console.log('[semver] Frozen 5.x/6.x/7.x graph rejects ReDoS and preserves real consumers.')
  process.exitCode = 0
}).catch((error) => {
  clearTimeout(buildConsumerTimeout)
  console.error(error)
  process.exitCode = 1
})
