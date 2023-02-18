const { program } = require('commander')
const path = require('path')
const fs = require('fs')
const __rootdir = path.resolve(__dirname, '../../')

program
  .option('-f, --format <char>', 'package format', 'unknown')
program.parse()
const { format } = program.opts()

const main = async () => {
  if (!['msi', 'appx', 'exe', 'dmg', 'deb', 'snap'].includes(format)) return
  const dirList = getTargetDirList()
  for (const dir of dirList) {
    const filename = path.join(dir, 'resources/version.json')
    if (fs.existsSync(filename)) {
      await updateVersionFile(filename, format)
    } else {
      console.warn('[warn] file not found:', filename)
    }
  }
}

main()

function getTargetDirList () {
  const appConfig = require(path.resolve(__rootdir, 'developer/app'))
  const productName = appConfig.displayName
  const arch = process.env.BUILD_ARCH || process.arch
  const platform = process.env.BUILD_PLATFORM || process.platform
  const packageDir = process.platform ==='darwin' ? path.resolve(__rootdir, `dist/electron/${productName}-${platform}-${arch}/${productName}.app/Contents`)
    : path.resolve(__rootdir, `dist/electron/${productName}-${platform}-${arch}`)
  const destDir =  process.platform ==='darwin' ? path.resolve(__rootdir, `out/${productName}-${platform}-${arch}/${productName}.app/Contents`)
    : path.resolve(__rootdir, `out/${productName}-${platform}-${arch}`)
  return [
    packageDir,
    destDir
  ]
}

async function updateVersionFile (filename, format) {
  const data = await fs.promises.readFile(filename).then(data => JSON.parse(data.toString()))
  Object.assign(data, {
    packageFormat: format
  })
  await fs.promises.writeFile(filename, JSON.stringify(data))
}
