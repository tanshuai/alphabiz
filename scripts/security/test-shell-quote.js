'use strict'

const assert = require('assert').strict
const { parse, quote } = require('shell-quote')

assert.equal(require('shell-quote/package.json').version, '1.8.4')

const safeArguments = [
  'echo',
  'AlphaBiz shell quote regression',
  'literal;$HOME',
  'line-without-terminator'
]
assert.deepEqual(parse(quote(safeArguments)), safeArguments)

const validOperators = [
  '||', '&&', ';;', '|&', '<(', '<<<', '>>', '>&', '<&',
  '&', ';', '(', ')', '|', '<', '>'
]
for (const op of validOperators) {
  assert.doesNotThrow(() => quote([{ op }]))
}

const lineTerminators = ['\n', '\r', '\u2028', '\u2029']
const invalidOperators = lineTerminators
  .map((terminator) => `;${terminator}id`)
  .concat(['$(id)', 'unknown'])
for (const op of invalidOperators) {
  assert.throws(
    () => quote([{ op }]),
    TypeError,
    `shell-quote accepted an unsafe operator: ${JSON.stringify(op)}`
  )
}

assert.throws(() => quote([{ op: 1 }]), TypeError)
assert.throws(() => quote([{ unknown: 'shape' }]), TypeError)

const envTokens = parse('echo $X', () => ({ op: ';\nid' }))
assert.throws(
  () => quote(envTokens),
  TypeError,
  'shell-quote accepted an unsafe operator returned by envFn'
)

const globOutput = quote([{ op: 'glob', pattern: '*.js' }])
assert.equal(globOutput, '*.js')

for (const terminator of lineTerminators) {
  assert.throws(
    () => quote([{ comment: `safe${terminator}second-command` }]),
    TypeError
  )
  assert.throws(
    () => quote([{ op: 'glob', pattern: `*.js${terminator}second-command` }]),
    TypeError
  )
}

console.log('[shell-quote] Operator, comment, glob, and envFn injection boundaries passed.')
