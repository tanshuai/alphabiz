#!/usr/bin/env node

const { closeSync, constants, existsSync, fstatSync, ftruncateSync, openSync, readFileSync, readdirSync, statSync, writeFileSync, writeSync } = require('fs')
const { resolve } = require('path')
const exit = reason => {
  console.log(reason)
  process.exit(0)
}

const example = require('./example/translations.json')

const check = (lang, overwrite = false) => {
  if (lang === 'example') return
  const file = resolve(__dirname, lang, 'translations.json')
  let fileFd
  let data
  try {
    const noFollow = constants.O_NOFOLLOW || 0
    const access = overwrite ? constants.O_RDWR : constants.O_RDONLY
    fileFd = openSync(file, access | noFollow)
    if (!fstatSync(fileFd).isFile()) {
      throw new Error(`Expected a regular translations file: ${file}`)
    }
    data = JSON.parse(readFileSync(fileFd, 'utf-8'))
  } catch (error) {
    if (fileFd !== undefined) closeSync(fileFd)
    if (error.code !== 'ENOENT') throw error
    console.log(`Cannot get translations.json from ${lang}`)
    if (overwrite) {
      let newFileFd
      try {
        const noFollow = constants.O_NOFOLLOW || 0
        newFileFd = openSync(
          file,
          constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | noFollow,
          0o600
        )
        writeFileSync(newFileFd, JSON.stringify(example, null, 2), 'utf-8')
        console.log(`(Overwrite) Write translations.json example file.`)
      } catch (createError) {
        if (createError.code === 'EEXIST') {
          throw new Error(`translations.json appeared while checking ${lang}; run the check again.`)
        }
        throw createError
      } finally {
        if (newFileFd !== undefined) closeSync(newFileFd)
      }
    }
    return
  }
  try {
    let changed = false
    let missingVar = false
    for (const key in example) {
      const value = example[key]
      if (!(key in data)) {
        console.log(`[${lang}] Missing key "${key}".${overwrite ? ` The key is added and you should translate it.` : ''}`)
        data[key] = value
        changed = true
      }
      const trans = data[key]
      const matches = value.match(/\{.+?}/g)
      if (!matches) continue
      matches.forEach(s => {
        if (!trans.includes(s)) {
          console.log(`[${lang}] key "${key}" does not have variable "${s}"`)
          missingVar = true
        }
      })
    }
    for (const key in data) {
      if (!(key in example)) {
        console.log(`[${lang}] The existed key "${key}" is not in example json.${overwrite ? ' This key will be removed.' : ''}`)
        delete data[key]
        changed = true
      }
    }
    if (missingVar) {
      console.log(`[${lang}] Some of vars are missing and you should change them manually.`)
    } else if (changed) {
      console.log(`[${lang}] Found something should be changed.`)
      if (overwrite) {
        ftruncateSync(fileFd, 0)
        writeSync(fileFd, JSON.stringify(data, null, 2), 0, 'utf-8')
        console.log(`[${lang}] The translations.json file was changed. Check the file for more infomations.`)
      }
    } else {
      console.log(`[${lang}] This language is perfectly ready for publish!`)
    }
  } finally {
    closeSync(fileFd)
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
