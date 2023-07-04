/**
 * This script is used to export i18n key-value pairs for external i18n files.
 * Some files in this repo requires compiling. You should use following command:
 * ```
 * npx @babel/node --presets '@babel/env' build-scripts/common/export-i18n-json.js
 * ```
 * to run it. After that you will get `translations.json` in `dist`.
 * Copy it to YOUR_PUBLIC_API/LOCALE_CODE/translations.json to add an external locale.
 */

const { resolve } = require('path')

import { messages } from '../../src/i18n/index.js'
import { writeFileSync } from 'fs'
import { displayName } from '../../src/utils/appConfig'
const raw = messages['en-US']

// const __dirname = dirname(fileURLToPath(import.meta.url))
for (const key in raw) {
  while (raw[key].includes(displayName)) {
    raw[key] = raw[key].replace(displayName, '${displayName}')
  }
}
const distJson = resolve(__dirname, '../../dist/translations.json')
writeFileSync(distJson, JSON.stringify(raw, null, 2))
