// UnPackaged files uploaded by private repository, webTorrent module without patch after 'YARN' installation.
// So you need to run this file, the root directory of modified webtorrent copied to build/electron/UnPackaged/node_modules, 
// then run the playwright test, effective download function
const fs = require('fs')
const path = require('path')

const copyModule = async () => {
  ['webtorrent', '@videojs'].forEach(dep => {
    const src = path.resolve(__dirname, 'node_modules', dep)
    const dest = path.resolve(__dirname, 'build/electron/UnPackaged/node_modules', dep)
    if (!fs.existsSync(src)) return
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true })
    const copyRecursive = (src, dest) => {
      if (fs.statSync(src).isDirectory()) {
        fs.readdirSync(src).forEach(dir => {
          copyRecursive(path.resolve(src, dir), path.resolve(dest, dir))
        })
      } else {
      // ensure directory exists
        if (!fs.existsSync(path.dirname(dest))) {
          fs.mkdirSync(path.dirname(dest), { recursive: true })
        }
        fs.copyFileSync(src, dest)
      }
    }
    copyRecursive(src, dest)
  })
}
const copyVersionJSON = async () => {
  const src = path.resolve(__dirname, 'public/version.json')
  const dest = path.resolve(__dirname, 'version.json')
  // console.log('src:' + src)
  // console.log('dest:' + dest)
  fs.copyFileSync(src, dest)
}
const deleteVersionJSON = async () => {
  fs.unlink(path.resolve(__dirname, 'version.json'), (err) => {
    if (err) throw err;
    console.log('version.json was deleted');
  })
}

if (process.argv.includes('--pre')) {
  console.log('run copy-patch.js --pre')
  copyVersionJSON()
  copyModule()
} else if(process.argv.includes('--post')) {
  console.log('run copy-patch.js --post')
  deleteVersionJSON()
}

