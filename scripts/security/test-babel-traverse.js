'use strict'

const assert = require('assert').strict
const babel = require('@babel/core')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

assert.equal(require('@babel/traverse/package.json').version, '7.23.2')

function evaluateExpression (source) {
  const ast = parser.parse(source)
  let evaluation

  traverse(ast, {
    ExpressionStatement (path) {
      evaluation = path.get('expression').evaluate()
      path.stop()
    }
  })

  assert.ok(evaluation, `Babel did not visit expression: ${source}`)
  return evaluation
}

const ownMethod = evaluateExpression('Math.min(3, 1)')
assert.equal(ownMethod.confident, true)
assert.equal(ownMethod.value, 1)

const inheritedMethod = evaluateExpression("Math.hasOwnProperty('min')")
assert.equal(
  inheritedMethod.confident,
  false,
  'Babel evaluated an inherited global method while compiling untrusted syntax'
)

const transformed = babel.transformSync('const square = (value) => value ** 2', {
  babelrc: false,
  configFile: false,
  presets: [[require.resolve('@babel/preset-env'), {
    modules: 'commonjs',
    targets: { ie: '11' }
  }]]
})

assert.ok(transformed && transformed.code, 'Babel did not produce compatibility output')
assert.ok(
  /function square/.test(transformed.code) && /Math\.pow/.test(transformed.code),
  'The pinned traversal graph is incompatible with the repository Babel toolchain'
)

console.log('[babel-traverse] Traversal fails closed and remains compatible with the Babel toolchain.')
