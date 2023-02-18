const { resolve } = require('path')
const {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
  rmSync,
  renameSync
} = require('fs-extra')
const readline = require('readline')
const { spawn } = require('child_process')
const uuid = require('uuid')
const Wix = require('electron-wix-msi/lib/creator')
const __rootdir = resolve(__dirname, '../../..')

const isTesting = !!process.env.WIX_TEST
// Write logs in one line, disabled when testing
/** @param { string[] } strs */
const logInfo = (...strs) => {
  if (isTesting) return console.log('[Msi]', ...strs)
  return new Promise(resolve => {
    readline.clearLine(process.stdout, 0, () => {
      readline.cursorTo(process.stdout, 0, () => {
        process.stdout.write('[Msi] ' + strs.join(' '), () => resolve())
      })
    })
  })
}
/** @param { string[] } strs */
const logError = (...strs) => {
  if (isTesting) return console.error('[Msi]', ...strs)
  return new Promise(resolve => {
    readline.clearLine(process.stderr, 0, () => {
      readline.cursorTo(process.stderr, 0, () => {
        process.stderr.write('[Msi] ' + strs.join(' '), () => resolve())
      })
    })
  })
}
const exitWith = code => {
  // console.log('\n[Msi] Process with code', code)
  process.exit(code)
}

const appConfig = require(resolve(__rootdir, 'developer/app'));
const productName = appConfig.displayName;
const displayName = appConfig.displayName;
const developerName = appConfig.developer;
const upgradeCode = appConfig.upgradeCode;

const { version, description } = require(resolve(__rootdir, 'package.json'))

const WiSubStg = resolve(__dirname, 'WiSubStg.vbs')
const WiLangId = resolve(__dirname, 'WiLangId.vbs')
const appDirectory = resolve(__rootdir, `dist/electron/${productName}-win32-x64`)
const outputDirectory = resolve(__rootdir, 'out/make/wix/', process.arch)

const ensureDirectory = async () => {
  if (!existsSync(appDirectory)) {
    await logError('Make Error: Cannot find appDirectory', appDirectory, '. run `yarn build` before make')
    exitWith(1)
  }
  const entryExe = resolve(appDirectory, `${productName}.exe`)
  if (!existsSync(entryExe)) {
    await logError(`Make Error: Cannot find ${productName}.exe. run \`yarn build\` before make`)
    exitWith(1)
  }
  if (existsSync(outputDirectory)) {
    rmSync(outputDirectory, { recursive: true })
  }
  mkdirSync(outputDirectory, { recursive: true })
}

const icoPath = resolve(__rootdir, 'developer/platform-assets/windows/icon.ico')
const iconTemplate = `<Icon Id="icon.ico" SourceFile="${icoPath}"/>
    <Property Id="ARPPRODUCTICON" Value="icon.ico" />`
const wixTemplate = readFileSync(resolve(__dirname, 'template.xml'))
  .toString()
  .replace('<!-- {{IconTemplate}} -->', iconTemplate)
  // .replace(/{{displayName}}/g, displayName)

/**
 * @typedef CultureOption
 * @property { number } code
 * @property { string } lang
 *
 * @typedef MakeResult
 * @property { CultureOption } culture
 * @property { string } msiFile
 */

/** @type { CultureOption[] } */
const cultures = [{
  code: 1028,
  lang: 'zh-TW'
}, {
  code: 2052,
  lang: 'zh-CN'
}, {
  code: 1033,
  lang: 'en-US'
}]
const allCulturesStr = cultures
  .map(i => i.lang.toLowerCase()).join(';')

let createdWxsContext = undefined
const wxsFilePath = resolve(outputDirectory, `${productName}.wxs`)
const applyWxsContext = (ctx, wix) => {
  Object.assign(wix, ctx)
}
/**
 * @function makeCulture
 * @param { CultureOption } culture
 */
const makeCulture = async (culture, asBase = false) => {
  const cultureStr = asBase
    ? allCulturesStr
    : culture.lang.toLowerCase()
  const localizationFile = resolve(__dirname, `localizations/${culture.lang}.wxl`)
  // if (!existsSync(localizationFile)) {
  //   console.warn('Not exist', localizationFile)
  // }
  const maker = new Wix.MSICreator({
    name: displayName,
    shortName: displayName,
    // name: productName,
    // shortName: productName,
    arch: process.arch,
    description,
    version,
    manufacturer: developerName,
    exe: productName,
    shortcutFolderName: '',
    programFilesFolderName: productName,
    appIconPath: icoPath,
    upgradeCode,
    cultures: cultureStr,
    appDirectory,
    outputDirectory,
    // specialFiles,
    // productCode,
    // language: 1033,
    ui: {
      chooseDirectory: true,
      images: {
        background: resolve(__rootdir, 'developer/platform-assets/windows/splash/background_493x312.png'),
        banner: resolve(__rootdir, 'developer/platform-assets/windows/splash/banner_493x58.png'),
        exclamationIcon: resolve(__rootdir, 'developer/icons/favicon-32x32.png'),
        infoIcon: resolve(__rootdir, 'developer/icons/favicon-32x32.png'),
        newIcon: resolve(__rootdir, 'developer/icons/favicon-16x16.png'),
        upIcon: resolve(__rootdir, 'developer/icons/favicon-16x16.png')
      },
      localizations: [localizationFile]
    }
  })

  // Customize templates
  maker.wixTemplate = wixTemplate
  // .replace('{{LanguageCode}}', culture.code)
  // maker.uiTemplate = maker.uiTemplate.replace('<DialogRef Id="MsiRMFilesInUse" />', '<!-- <DialogRef Id="MsiRMFilesInUse" /> -->')

  // Change registry data for icon in control panel
  const _getRegistryKeys = maker.getRegistryKeys
  maker.getRegistryKeys = (function getRegistryKeys (...args) {
    const registry = _getRegistryKeys.bind(maker)(...args)
    const icon = registry.find(i => i.id === 'UninstallDisplayIcon')
    if (icon) icon.value = `[APPLICATIONROOTDIRECTORY]${productName}.exe`
    // console.log(icon, registry.find)
    return registry
  }).bind(maker)

  if (!createdWxsContext) {
    await maker.create()
    createdWxsContext = maker.wxsContext
  } else {
    applyWxsContext(createdWxsContext, maker)
  }
  const wxsFile = readFileSync(wxsFilePath).toString()
  writeFileSync(wxsFilePath, wxsFile.replace('{{LanguageCode}}', culture.code))
  if (maker.specialFiles) specialFiles = maker.specialFiles
  const { msiFile } = await maker.compile()
  writeFileSync(wxsFilePath, wxsFile)
  // The electron-wix-msi has an internal console.log in compile(),
  // curse up to remove it.
  // readline.moveCursor(process.stdout, 0, -1)
  // await curseUp()
  if (asBase) return msiFile
  const distFile = msiFile.replace(/\.msi$/, `_${culture.lang}.msi`)
  renameSync(msiFile, distFile)
  return distFile
}

/**
 * @function runScript
 * @param { Parameters<spawn> } args
 * @returns { Promise<{ stdout: string, stderr: string, code: number }> }
 */
const runScript = (...args) => {
  // logInfo(`Running\n\t${args.join(' ')}\n`)
  return new Promise(resolve => {
    const fork = spawn(...args)
    let stdout = '', stderr = ''
    fork.stdout.on('data', d => stdout += d)
    fork.stderr.on('data', d => stderr += e)
    fork.on('close', code => {
      resolve({ stdout, stderr, code })
    })
  })
}

/**
 * @function postmake
 * @param { string } baseFile
 * @param { MakeResult[] } results
 */
const postMake = async (baseFile, results) => {
  // console.log(baseFile, results)
  for (const result of results) {
    await logInfo(`Creating MST for ${result.culture.lang}`)
    const mst = resolve(outputDirectory, `${result.culture.lang}.mst`)
    const torch = await runScript(
      'torch.exe',
      [baseFile, result.msiFile, '-o', mst]
    )
    if (torch.code !== 0) {
      await logError(torch.stderr)
      // torch.exe may put errors in stdout
      console.error('\n', torch.stderr, torch.stdout)
      exitWith(torch.code)
    }
    await logInfo(`Postmake MST ${mst}`)
    // cscript.exe WiSubStg.vbs setup.msi it-IT.mst 1040
    const cscript = await runScript(
      'cscript',
      [WiSubStg, baseFile, mst, result.culture.code]
    )
    if (cscript.code !== 0) {
      await logError(cscript.stderr)
      exitWith(cscript.code)
    }
    await runScript(
      'cscript',
      [WiSubStg, baseFile]
    )
    await logInfo(`Postmake WiSubStg ${result.culture.code}`)
  }

  const runLang = await runScript(
    'cscript',
    [WiLangId, baseFile, 'Package', cultures.map(i => i.code).join(',')]
  )
  if (runLang.code) {
    console.error(runLang.stderr, runLang.stdout)
    exitWith(runLang.code)
  }
}

const makeAllMsi = async () => {
  const results = []
  for (const culture of cultures) {
    await logInfo(`Making for ${culture.lang} ... `)
    const msiFile = await makeCulture(culture).catch(async error => {
      await logError(error.message || error)
      exitWith(1)
    })
    await logInfo(`Made ${msiFile} - ${culture.lang}`)
    results.push({ culture, msiFile })
    // en-US as based
    // if (msiFile.endsWith('en-US.msi')) {
    //   baseFile = msiFile.replace('_en-US', '')
    //   copyFileSync(msiFile, baseFile)
    // }
  }
  await logInfo('Making base msi ... ')
  const baseFile = await makeCulture(cultures[cultures.length - 1], true)
  await logInfo('Made base msi')
  return { baseFile, results }
}

const cleanOutput = async () => {
  const files = readdirSync(outputDirectory)
  await logInfo('Cleaning middle files...')
  files.filter(i => !i.endsWith('.msi')).forEach(file => {
    rmSync(resolve(outputDirectory, file))
  })
}

const runMake = async () => {
  await ensureDirectory()
  const { baseFile, results } = await makeAllMsi()
  await postMake(baseFile, results)
  // await cleanOutput()
  console.log('[Msi] Make completed.')
  exitWith(0)
}

runMake()
