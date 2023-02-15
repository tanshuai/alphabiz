const { program } = require('commander')
const path = require('path')
const fs = require('fs')

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
  const appDirectoryRootPath = require('./test.config.js').appDirectoryRootPath
  const appConfig = require('./developer/app')
  const productName = appConfig.displayName
  const arch = process.env.BUILD_ARCH || process.arch
  const platform = process.env.BUILD_PLATFORM || process.platform
  const packageDir = path.resolve(__dirname, `${appDirectoryRootPath}/electron/${productName}-${platform}-${arch}`)
  const destDir = path.resolve(__dirname, `out/${productName}-${platform}-${arch}`)
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
