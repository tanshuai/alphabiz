const { exec, execSync } = require('child_process')
const { existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, rmSync, cpSync, readdirSync, statSync } = require('fs')
const { resolve } = require('path')
const { version: pkgVersion } = require('./package.json')
const publicVersion = require('./public/version.json').version
const versionHeader = publicVersion.match(/\d+\.\d+\.\d+/gm)
const appDirectoryRootPath = require('./test.config.js').appDirectoryRootPath
const appConfig = require('./developer/app');
const productName = appConfig.displayName;
const displayName = appConfig.displayName;
const description = appConfig.description;
const author = appConfig.author;
const { makeUniversalApp } = require('@electron/universal')

const readline = require('readline')
const { copySync } = require('fs-extra')

const version = publicVersion || pkgVersion
console.log(`version: ${version}`)

// const { platform } = process
const arch = process.env.BUILD_ARCH || process.arch
const platform = process.env.BUILD_PLATFORM || process.platform

const unsupportedModules = [
  /**
   * Fixed by removing arch-based node-gyp config.
   * See `patches` directory for details.
   */
  // 'bufferutil',
  // 'utf-8-validate'
]
const treatMacFiles = (arm, x64) => {
  const files = [...new Set(readdirSync(arm).concat(readdirSync(x64)))]
  files.forEach(file => {
    const armFile = resolve(arm, file)
    const x64File = resolve(x64, file)
    if (existsSync(armFile)) {
      if (!existsSync(x64File)) {
        if (file.includes('arm') || armFile.includes('node_modules')) return
        rmSync(armFile, { recursive: true })
        console.log(`Warn: Removed ${armFile} since it is not existed in x64 build`)
        return
      }
      const isArmDir = statSync(armFile).isDirectory()
      const isX64Dir = statSync(x64File).isDirectory()
      if (isArmDir !== isX64Dir) {
        rmSync(armFile, { recursive: true })
        rmSync(x64File, { recursive: true })
        console.log(`Warn: The ${file} is not same type in arm and x64`)
        console.log(armFile, 'is', isArmDir ? 'directory' : 'file')
        console.log(x64File, 'is', isX64Dir ? 'directory' : 'file')
      }
      if (isArmDir && isX64Dir) {
        return treatMacFiles(armFile, x64File)
      }
      if (file === 'Info.plist') {
        cpSync(armFile, x64File)
        // console.log(`Use ${armFile} for common Info.plist`)
      }
      if (file.endsWith('.node')) {
        if (unsupportedModules.some(mod => armFile.includes(`node_modules/${mod}`))) {
          console.log(`Remove ${file} since it is not supported in universal.`)
          console.log(armFile)
          console.log(x64File)
          rmSync(armFile, { recursive: true })
          rmSync(x64File, { recursive: true })
        }
        // copyFileSync(x64File, armFile)
        // console.log(`Found same .node file ${file}. Use x64 one\n${x64File}`)
      }
    } else if (existsSync(x64File) && !file.includes('x64') && !file.includes('x86') && !x64File.includes('node_modules')) {
      rmSync(x64File, { recursive: true })
      console.log(`Warn: Removed ${x64File} since it is not existed in arm build`)
    }
  })
}
const makeMacUniversal = async () => {
  if (platform === 'darwin' || platform === 'mas') {
    const dist = resolve(__dirname, `${appDirectoryRootPath}/electron`)
    const x64Dist = resolve(dist, `${productName}-${platform}-x64`)
    const armDist = resolve(dist, `${productName}-${platform}-arm64`)
    if (existsSync(x64Dist) && existsSync(armDist)) {
      const outAppPath = resolve(dist, `${productName}-${platform}-universal/${productName}.app`)
      treatMacFiles(armDist, x64Dist)
      await makeUniversalApp({
        x64AppPath: resolve(x64Dist, `${productName}.app`),
        arm64AppPath: resolve(armDist, `${productName}.app`),
        outAppPath,
        mergeASARs: true,
        singleArchFiles: '{.*,*}',
        force: true
      })
      console.log('Generated universal app:', outAppPath)
      return
    }
    throw new Error('Require buiding both x64 and arm64 targets before building universal app')
  }
  throw new Error('Build mac universal is only available in macOS')
}

const doMake = async () => {
  const arg = platform === 'darwin'
    ? 'make:dmg'
    : platform === 'win32'
      ? 'make:win'
      : 'make:deb'
  // console.log('make:win')
  console.log(`Make for \x1b[36m${platform}-${arch}\x1b[0m`)
  const packageDir = resolve(__dirname, `${appDirectoryRootPath}/electron/${productName}-${platform}-${arch}`)
  if (!existsSync(packageDir)) {
    console.error('\x1b[41m Error \x1b[0m Cannot find packaged app. Run \x1b[90myarn build\x1b[0m before make.')
    console.log(`  Ensure that the build result contains a folder of\x1b[33m ${appDirectoryRootPath}/electron/${productName}-${platform}-${arch}\x1b[0m`)
    process.exit(1)
  }
  const destDir = resolve(__dirname, `out/${productName}-${platform}-${arch}`)
  // if (platform === 'darwin') {
  /**
   * The @electron-forge/maker-deb use symlink linking files to /tmp,
   * so we cannot use symlink for it. Since `fs` does not have an
   * recursive copy method, we just exec copy here
   */
  // execSync(`cp -r "${packageDir}/" "${resolve(__dirname, 'out')}/"`)
  // MacOS builds includes recursivee subdirectories which cannot be overwritten.
  // So we remove old directory first, If it exists.
  if (existsSync(destDir)) rmSync(destDir, { recursive: true })
  copySync(packageDir, destDir, { recursive: true })
  // } else copySync(packageDir, destDir, { recursive: true })
  // } else await symlinkDir(packageDir, destDir)
  console.log(`Executing: \x1b[32myarn ${arg}\x1b[0m`)
  const prefix = '\x1b[32m  * make \x1b[0m'
  const res = exec(`yarn ${arg} --arch ${arch}`)
  res.stdout.on('data', d => {
    // process.stdout.clearLine()
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0, null)
    process.stdout.write(prefix + d.toString().trim())
  })
  // res.stdout.pipe(process.stdout)
  res.stderr.on('data', e => {
    // process.stderr.clearLine()
    readline.clearLine(process.stderr, 0)
    readline.cursorTo(process.stderr, 0, null)
    process.stderr.write(prefix + e.toString().trim())
  })
  // res.stderr.pipe(process.stderr)
  res.on('exit', code => {
    // process.stdout.clearLine()
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0, null)
    process.stdout.write(prefix + 'Exit.\n')
    process.exit(code)
  })
}

const doPostmake = () => {
  const outDir = resolve(__dirname, 'out/make')
  const destDir = resolve(__dirname, `out/installers/${version}`)
  mkdirSync(destDir, { recursive: true })
  /** @type { Array<[string, string]> } */
  const toMoves = []
  if (platform === 'win32') {
    const wixDir = resolve(outDir, `wix/${arch}`)
    toMoves.push([resolve(wixDir, `${productName}.msi`), resolve(destDir, `${appConfig.fileName.toLowerCase()}-${version}.msi`)])
    const squirrelDir = resolve(outDir, `squirrel.windows/${arch}`)
    const appxDir = resolve(outDir, `appx/${arch}`)
    // appx format must start with a letter, so use appConfig.name
    toMoves.push([resolve(appxDir, `${appConfig.name}.appx`), resolve(destDir, `${appConfig.fileName.toLowerCase()}-${version}.appx`)])
    const files = [
      `${productName}-${versionHeader[0]} Setup.exe`,
      `${appConfig.name}-${versionHeader[0]}-full.nupkg`,
      `${productName}-${versionHeader[0]}-delta.nupkg`,
      'RELEASES'
    ]
    files.forEach(file => {
      toMoves.push([resolve(squirrelDir, file), resolve(destDir, file.replace(' Setup', '').replace(appConfig.name, appConfig.fileName.toLowerCase()).replace(productName, appConfig.fileName.toLowerCase()).replace('-full', '').replace('-delta', '').replace(versionHeader[0], version))])
    })
  } else if (platform === 'darwin' || platform === 'mas') {
    // move darwin installers
    toMoves.push([
      resolve(outDir, `${productName}.dmg`),
      resolve(destDir, `${appConfig.fileName.toLowerCase()}-${arch}-${version}.dmg`)
    ])
  } else if (platform === 'linux') {
    // move linux installers
    toMoves.push([
      resolve(outDir, `deb/${arch}/${productName.toLowerCase().replace(/\s/gm, '-')}_${versionHeader[0]}_${arch === 'x64' ? 'amd64' : arch}.deb`),
      resolve(destDir, `${appConfig.fileName.toLowerCase()}-${version}.deb`)
    ])
    console.log('NOTE: To build snapcraft target, you need to run `yarn make:snap` manually.')
  }
  for (const [src, tar] of toMoves) {
    if (existsSync(src)) {
      console.log(`Asset => \x1b[36m${tar}\x1b[0m`)
      copyFileSync(src, tar)
    }
  }
}

const doReset = () => {
  const res = exec(`git checkout -- appx/template.xml package.json`)
  res.stdout.on('data', d => {
    process.stdout.write(d.toString().trim())
  })
  res.stderr.on('data', e => {
    process.stderr.write(e.toString().trim())
  })
  res.on('exit', code => {
    process.stdout.write('reset appx/template.xml package.json end.\n')
    process.exit(code)
  })
}

if (process.argv.includes('--make')) {
  // modify package.json version for Update the installation package version
  const packagePath = resolve(__dirname, './package.json')
  const packageObj = readFileSync(packagePath)
  const pkg = JSON.parse(packageObj)
  pkg.version = versionHeader[0]
  pkg.productName = productName
  pkg.description = description
  pkg.author = author
  writeFileSync(packagePath, JSON.stringify(pkg, null, 2))
  process.on('exit', () => {
    writeFileSync(packagePath, packageObj)
    console.log('Restored package.json before exit')
  })
  // if windows modify appxManifest
  if (platform === 'win32') {
    const xmlFilePath = resolve(__dirname, 'appx/template.xml')
    const oldAppxTemplate = readFileSync(resolve(__dirname, 'appx/template.xml'), 'utf-8')
    let appxTemplate = oldAppxTemplate
    const pkgConfig = require('./forge.config').makers.find(maker => maker.name === '@electron-forge/maker-appx')
    if (pkgConfig) {
      for (const key in pkgConfig.config) {
        const val = pkgConfig.config[key]
        if (typeof val === 'string') {
          console.log(key, '=>', val)
          appxTemplate = appxTemplate.replace(new RegExp(`{{${key}}}`, 'g'), val);
        }
      }
    }
    appxTemplate = appxTemplate.replace('{{pkgVersion}}', versionHeader[0] + '.0').replace('{{description}}', description).replace('{{appxPackageIdentityName}}', appConfig.appxPackageIdentityName)
    writeFileSync(xmlFilePath, appxTemplate)
    process.on('exit', () => {
      writeFileSync(xmlFilePath, oldAppxTemplate)
      console.log('Restored appx/template.xml before exit')
    })
  }
  doMake()
} else if (process.argv.includes('--postmake')) {
  doPostmake()
} else if (process.argv.includes('--reset')) {
  doReset()
} else if (process.argv.includes('--make-universal')) {
  makeMacUniversal().catch(error => {
    console.error('Error making universal app.', error && error.message, error)
    process.exit(1)
  })
} else {
  console.warn('Require passing --make or --postmake')
  process.exit(1)
}
