'use strict'

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const { validateJson5Locks } = require('./json5-lock-contract')

const original = fs.readFileSync(path.join(__dirname, '..', '..', 'yarn.lock'), 'utf8')
const blocks = original.replace(/\r\n/g, '\n').split('\n\n')
const one = blocks.find((block) => block.startsWith('json5@1.0.2,'))
const separate = blocks.find((block) => block.startsWith('json5@^1.0.1:'))
assert.ok(one, 'Regression fixture requires the reviewed 1.x resolution')
const coalesced = blocks.filter((block) => block !== separate)
  .map((block) => block === one ? block.replace(/^.*\n/, 'json5@^1.0.1, json5@1.0.2, json5@^0.5.1:\n') : block)
  .reverse().join('\n\n')
assert.deepEqual([...validateJson5Locks(original)].sort(), [...validateJson5Locks(coalesced)].sort())
const mergedOne = coalesced.split('\n\n').find((block) => block.startsWith('json5@^1.0.1,'))
const split = coalesced.replace(mergedOne,
  mergedOne.replace(/^.*\n/, 'json5@1.0.2, json5@^0.5.1:\n') + '\n\n' +
  mergedOne.replace(/^.*\n/, 'json5@^1.0.1:\n'))
assert.deepEqual([...validateJson5Locks(split)].sort(), [...validateJson5Locks(coalesced)].sort())
assert.deepEqual([...validateJson5Locks(coalesced.replace(/\n/g, '\r\n'))].sort(),
  [...validateJson5Locks(original)].sort())

const changeOne = (before, after) => coalesced.replace(mergedOne, mergedOne.replace(before, after))
for (const [reason, invalid] of [
  ['vulnerable version', changeOne('  version "1.0.2"', '  version "1.0.1"')],
  ['source substitution', changeOne('json5-1.0.2.tgz#', 'json5-1.0.1.tgz#')],
  ['integrity substitution', changeOne('sha512-g1MW', 'sha512-AAAA')],
  ['missing selector', changeOne('json5@^1.0.1, ', '')],
  ['wrong major', changeOne('json5@^1.0.1, ', 'json5@2.2.0, ')],
  ['duplicate selector', `${coalesced}\n\n${one}`],
  ['unexpected dependency', changeOne('    minimist "^1.2.0"', '    minimist "^1.2.0"\n    extra "1.0.0"')]
]) {
  assert.throws(() => validateJson5Locks(invalid), assert.AssertionError, reason)
}
console.log('[json5-lock] Coalesced/reordered locks preserve all selectors; seven unsafe changes rejected.')
