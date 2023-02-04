const { exec, execSync } = require('child_process')
const { existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, rmSync } = require('fs')
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

const readline = require('readline')
const { copySync } = require('fs-extra')

const version = publicVersion || pkgVersion
console.log(`version: ${version}`)

const { platform, arch } = process

const symlinkDir = require('symlink-dir')

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
  const prefix = `\x1b[32m  * make \x1b[0m`
  const res = exec(`yarn ${arg}`)
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
  } else if (platform === 'darwin') {
    // move darwin installers
    toMoves.push([
      resolve(outDir, `${productName}.dmg`),
      resolve(destDir, `${appConfig.fileName.toLowerCase()}-${version}.dmg`)
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
} else {
  console.warn('Require passing --make or --postmake')
  process.exit(1)
}
