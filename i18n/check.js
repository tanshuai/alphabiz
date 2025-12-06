#!/usr/bin/env node

const { readdirSync, statSync, existsSync, writeFileSync, readFileSync } = require('fs')
const { resolve } = require('path')
const exit = reason => {
  console.log(reason)
  process.exit(0)
}

const example = require('./example/translations.json')

const check = (lang, overwrite = false) => {
  if (lang === 'example') return
  const file = resolve(__dirname, lang, 'translations.json')
  if (!existsSync(file)) {
    console.log(`Cannot get translations.json from ${lang}`)
    if (overwrite) {
      writeFileSync(file, JSON.stringify(example, null, 2))
      console.log(`(Overwrite) Write translations.json example file.`)
    }
    return
  }
  const data = JSON.parse(readFileSync(file, 'utf-8'))
  let changed = false
  for (const key in example) {
    if (!(key in data)) {
      const value = example[key]
      console.log(`[${lang}] Missing key "${key}".${overwrite ? ` The key is added and you should translate it.` : ''}`)
      data[key] = value
      changed = true
    }
  }
  for (const key in data) {
    if (!(key in example)) {
      console.log(`[${lang}] The existed key "${key}" is not in example json.${overwrite ? ' This key will be removed.' : ''}`)
      delete data[key]
      changed = true
    }
  }
  if (changed) {
    console.log(`[${lang}] Found something should be changed.`)
    if (overwrite) {
      writeFileSync(file, JSON.stringify(data, null, 2))
      console.log(`[${lang}] The translations.json file was changed. Check the file for more infomations.`)
    }
  } else {
    console.log(`[${lang}] This language is perfectly ready for publish!`)
  }
}

module.exports = check
if (require.main === module) {
  let langs = [], overwrite = false
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i]
    if (['--overwrite', '-O'].includes(arg)) overwrite = true
    else if (!langs.includes(arg)) {
      if (existsSync(resolve(__dirname, arg))) {
        langs.push(arg)
      } else {
        console.warn(`Cannot add checking for ${arg}. If you are creating new language, add a folder for it first.`)
      }
    }
  }
  // if (overwrite) {
  //   console.log('Overwrite translations.json after check.')
  // }
  if (!langs.length) {
    const dirs = readdirSync(__dirname).filter(i => statSync(resolve(__dirname, i)).isDirectory())
    langs.push(...dirs)
    console.log(`You have not passed any language code. Now checking for all langs.`)
  }
  for (const lang of langs) {
    check(lang, overwrite)
  }
  exit('Done')
}
