'use strict'

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repositoryRoot = path.resolve(__dirname, '..', '..')
const lockfile = fs.readFileSync(path.join(repositoryRoot, 'yarn.lock'), 'utf8')
  .replace(/\r\n/g, '\n')
const braceBlocks = lockfile.split('\n\n')
  .filter((block) => /^"?brace-expansion@/.test(block))

assert.equal(braceBlocks.length, 2, 'Unexpected brace-expansion selector entered the lockfile')

function assertLockedVersion (selector, version) {
  const block = braceBlocks.find((candidate) => {
    const header = candidate.split('\n', 1)[0]
    return header === selector || header === `"${selector.slice(0, -1)}":`
  })
  assert.ok(block, `Missing frozen brace-expansion selector: ${selector}`)
  assert.ok(
    block.includes(`\n  version "${version}"`),
    `${selector} is not frozen to brace-expansion ${version}`
  )
}

assertLockedVersion('brace-expansion@^1.1.7:', '1.1.18')
assertLockedVersion('brace-expansion@^2.0.1:', '2.1.4')

const lockedVersions = braceBlocks.map((block) => {
  const match = block.match(/\n  version "([^"]+)"/)
  assert.ok(match, 'brace-expansion lock block has no version')
  return match[1]
}).sort()

assert.deepEqual(lockedVersions, ['1.1.18', '2.1.4'])

function resolvePackage (name, searchPath) {
  const manifestPath = require.resolve(`${name}/package.json`, { paths: [searchPath] })
  return {
    directory: path.dirname(manifestPath),
    manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    modulePath: require.resolve(name, { paths: [searchPath] })
  }
}

const rootMinimatch = resolvePackage('minimatch', repositoryRoot)
const playwright = resolvePackage('@playwright/test', repositoryRoot)
const playwrightMinimatch = resolvePackage('minimatch', playwright.directory)
const electronRebuild = resolvePackage('@electron/rebuild', repositoryRoot)
const electronMinimatch = resolvePackage('minimatch', electronRebuild.directory)

const installations = [
  {
    label: 'minimatch 3.x runtime graph',
    expectedVersion: '1.1.18',
    package: resolvePackage('brace-expansion', rootMinimatch.directory)
  },
  {
    label: 'Playwright minimatch 3.x graph',
    expectedVersion: '1.1.18',
    package: resolvePackage('brace-expansion', playwrightMinimatch.directory)
  },
  {
    label: 'electron-rebuild minimatch 5.x graph',
    expectedVersion: '2.1.4',
    package: resolvePackage('brace-expansion', electronMinimatch.directory)
  }
]

const probeSource = [
  "'use strict'",
  "const assert = require('assert').strict",
  'const expand = require(process.argv[1])',
  'const manifest = require(process.argv[2])',
  'const expectedVersion = process.argv[3]',
  'const NativeString = String',
  'function countStringCalls (run) {',
  '  let calls = 0',
  '  function CountingString (value) {',
  '    calls += 1',
  '    return NativeString(value)',
  '  }',
  '  Object.setPrototypeOf(CountingString, NativeString)',
  '  CountingString.prototype = NativeString.prototype',
  '  const previous = global.String',
  '  global.String = CountingString',
  '  try {',
  '    return { output: run(), calls }',
  '  } finally {',
  '    global.String = previous',
  '  }',
  '}',
  'function totalLength (values) {',
  '  return values.reduce((total, value) => total + value.length, 0)',
  '}',
  'assert.equal(manifest.version, expectedVersion)',
  "assert.deepEqual(expand('a{b,c}d'), ['abd', 'acd'])",
  "assert.deepEqual(expand('file{1..3}.txt'), ['file1.txt', 'file2.txt', 'file3.txt'])",
  "assert.deepEqual(expand('{1..3..0}'), ['1', '2', '3'])",
  "const nonExpanding = 'a' + Array(24).fill('{}').join(',')",
  'assert.deepEqual(expand(nonExpanding, { max: 100, maxLength: 4096 }), [nonExpanding])',
  'const boundedCases = [',
  "  ['{a,b}{c,d}{e,f}', 10],",
  "  ['{a,b,c,d,e,f,g,h}', 4],",
  "  ['{0001..0010}', 12]",
  ']',
  'for (const [input, maxLength] of boundedCases) {',
  '  const output = expand(input, { max: 100, maxLength })',
  '  const totalLength = output.reduce((total, value) => total + value.length, 0)',
  '  assert.ok(output.length > 0)',
  '  assert.ok(totalLength <= maxLength, `${input} exceeded maxLength`)',
  '}',
  "const sequence = '{0000000001..2}'",
  'function alternativesProbe (count) {',
  '  return countStringCalls(() => expand(',
  "    '{' + Array(count).fill(sequence).join(',') + '}',",
  '    { max: 1000, maxLength: 64 }',
  '  ))',
  '}',
  'const tenAlternatives = alternativesProbe(10)',
  'const hundredAlternatives = alternativesProbe(100)',
  'assert.ok(totalLength(tenAlternatives.output) <= 64)',
  'assert.ok(totalLength(hundredAlternatives.output) <= 64)',
  'assert.deepEqual(hundredAlternatives.output, tenAlternatives.output)',
  'assert.ok(tenAlternatives.calls <= 10)',
  'assert.ok(hundredAlternatives.calls <= tenAlternatives.calls + 2)',
  "const paddedSequence = '{' + '0'.repeat(63) + '1..1000}'",
  'const paddedProbe = countStringCalls(() => expand(',
  '  paddedSequence,',
  '  { max: 1000, maxLength: 128 }',
  '))',
  'assert.equal(paddedProbe.output.length, 2)',
  'assert.equal(totalLength(paddedProbe.output), 128)',
  'assert.ok(paddedProbe.calls <= 4)'
].join('\n')

for (const installation of installations) {
  assert.equal(installation.package.manifest.version, installation.expectedVersion)

  const probe = spawnSync(process.execPath, [
    '--max-old-space-size=64',
    '-e',
    probeSource,
    installation.package.modulePath,
    installation.package.manifestPath,
    installation.expectedVersion
  ], {
    encoding: 'utf8',
    timeout: 2000
  })

  assert.equal(probe.error, undefined)
  assert.equal(
    probe.status,
    0,
    `${installation.label} failed its resource or compatibility boundary: ${probe.stderr}`
  )
}

for (const minimatchPackage of [rootMinimatch, playwrightMinimatch, electronMinimatch]) {
  const minimatch = require(minimatchPackage.modulePath)
  assert.equal(minimatch('src/a.js', 'src/{a,b}.js'), true)
  assert.equal(minimatch('src/c.js', 'src/{a,b}.js'), false)
}

console.log('[brace-expansion] Patched 1.x and 2.x graphs pass bounded-expansion and minimatch compatibility checks.')
