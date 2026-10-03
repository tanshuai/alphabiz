'use strict'

const assert = require('assert').strict

const reviewed = {
  '1.0.2': {
    selectors: ['json5@1.0.2', 'json5@^0.5.1', 'json5@^1.0.1'],
    resolved: 'https://registry.yarnpkg.com/json5/-/json5-1.0.2.tgz#63d98d60f21b313b77c4d6da18bfa69d80e1d593',
    integrity: 'sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA=='
  },
  '2.2.2': {
    selectors: ['json5@2.2.0', 'json5@2.2.2', 'json5@2.x', 'json5@^2.1.2'],
    resolved: 'https://registry.yarnpkg.com/json5/-/json5-2.2.2.tgz#64471c5bdcc564c18f7c1d4df2e2297f2457c5ab',
    integrity: 'sha512-46Tk9JiOL2z7ytNQWFLpj99RZkVgeHf87yGQKsIkaPz1qSH9UczKH1rO7K3wgRselo0tYMUNfecYpm/p1vC7tQ=='
  }
}

function validateJson5Locks (lockfile) {
  const seen = new Map()
  const blocks = lockfile.replace(/\r\n/g, '\n').split('\n\n')
  for (const block of blocks) {
    const header = block.split('\n', 1)[0]
    if (!header.endsWith(':')) continue
    const selectors = header.slice(0, -1).split(/,\s*/).map((s) => s.replace(/^"|"$/g, ''))
    if (!selectors.some((s) => s.startsWith('json5@'))) continue
    assert.ok(selectors.every((s) => s.startsWith('json5@')), 'Mixed package lock block')
    const value = (key) => {
      const match = block.match(new RegExp(`\\n  ${key} (?:"([^"]+)"|(\\S+))`))
      assert.ok(match, `${header} has no ${key}`)
      return match[1] || match[2]
    }
    const version = value('version')
    const expected = reviewed[version]
    assert.ok(expected, `Unreviewed or vulnerable json5 version: ${version}`)
    assert.equal(value('resolved'), expected.resolved, 'JSON5 package source changed')
    assert.equal(value('integrity'), expected.integrity, 'JSON5 package integrity changed')
    const dependencies = [...block.matchAll(/\n    ([^\s]+) (?:"([^"]+)"|(\S+))/g)]
      .map((match) => [match[1], match[2] || match[3]])
    assert.deepEqual(dependencies, version === '1.0.2' ? [['minimist', '^1.2.0']] : [],
      'JSON5 package dependencies changed')
    for (const selector of selectors) {
      assert.ok(expected.selectors.includes(selector), `${selector} resolved to the wrong reviewed version`)
      assert.ok(!seen.has(selector), `Duplicate JSON5 selector: ${selector}`)
      seen.set(selector, version)
    }
  }
  const expectedSelectors = Object.values(reviewed).flatMap((entry) => entry.selectors).sort()
  assert.deepEqual([...seen.keys()].sort(), expectedSelectors, 'JSON5 selector coverage changed')
  return seen
}

module.exports = { validateJson5Locks }
