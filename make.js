const { exec, execSync } = require('child_process')
const { existsSync, copyFileSync, mkdirSync, unlinkSync } = require('fs')
const { resolve } = require('path')
const { version: pkgVersion } = require('./package.json')
let { productName } = require('./package.json')
productName = productName.toLocaleLowerCase()
const readline = require('readline')
const { copySync } = require('fs-extra')

const version = process.env.BUILD_VERSION || pkgVersion
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
  const packageDir = resolve(__dirname, `build/electron/${productName}-${platform}-${arch}`)
  if (!existsSync(packageDir)) {
    console.error('\x1b[41m Error \x1b[0m Cannot find packaged app. Run \x1b[90myarn build\x1b[0m before make.')
    console.log(`  Ensure that the build result contains a folder of\x1b[33m dist/electron/${productName}-${platform}-${arch}\x1b[0m`)
    process.exit(1)
  }
  const destDir = resolve(__dirname, `out/${productName}-${platform}-${arch}`)
  if (platform === 'linux') {
    /**
     * The @electron-forge/maker-deb use symlink linking files to /tmp,
     * so we cannot use symlink for it. Since `fs` does not have an
     * recursive copy method, we just exec copy here
     */
    // execSync(`cp -r "${packageDir}/" "${resolve(__dirname, 'out')}/"`)
    copySync(packageDir, destDir, { recursive: true })
  }
  else await symlinkDir(packageDir, destDir)
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
    toMoves.push([resolve(wixDir, `${productName}.msi`), resolve(destDir, `${productName}-${version}.msi`)])
    const squirrelDir = resolve(outDir, `squirrel.windows/${arch}`)
    const files = [
      `${productName}-${pkgVersion} Setup.exe`,
      `${productName}-${pkgVersion}-full.nupkg`,
      `${productName}-${pkgVersion}-delta.nupkg`,
      'RELEASES'
    ]
    files.forEach(file => {
      toMoves.push([resolve(squirrelDir, file), resolve(destDir, file.replace(' Setup', '').replace('-full', '').replace('-delta', '').replace(pkgVersion, version))])
    })
  } else if (platform === 'darwin') {
    // move darwin installers
    toMoves.push([
      resolve(outDir, `${productName}.dmg`),
      resolve(destDir, `${productName}-${version}.dmg`)
    ])
  } else if (platform === 'linux') {
    // move linux installers
    toMoves.push([
      resolve(outDir, `deb/${arch}/${productName.toLowerCase()}_${pkgVersion}_${arch === 'x64' ? 'amd64' : arch}.deb`),
      resolve(destDir, `${productName}-${version}.deb`)
    ])
  }
  for (const [src, tar] of toMoves) {
    if (existsSync(src)) {
      console.log(`Asset => \x1b[36m${tar}\x1b[0m`)
      copyFileSync(src, tar)
    }
  }
}

if (process.argv.includes('--make')) {
  doMake()
} else if (process.argv.includes('--postmake')) {
  doPostmake()
} else {
  console.warn('Require passing --make or --postmake')
  process.exit(1)
}
