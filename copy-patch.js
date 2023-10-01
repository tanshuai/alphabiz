// UnPackaged files uploaded by private repository, webTorrent module without patch after 'YARN' installation.
// So you need to run this file, the root directory of modified webtorrent copied to build/electron/UnPackaged/node_modules, 
// then run the playwright test, effective download function
const fs = require('fs')
const path = require('path')

const copyModule = async () => {
  ['webtorrent',
    'bittorrent-tracker',
    'gun',
    'run-parallel-limit',
    'torrent-discovery', // this builds with self-dep bittorrent-tracker
    '@videojs'].forEach(dep => {
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
const copyDeveloper = async () => {
  const src = path.resolve(__dirname, 'developer')
  const dest = path.resolve(__dirname, 'build/electron/UnPackaged/node_modules/developer')
  const dest2 = path.resolve(__dirname, 'build/electron/UnPackaged/developer')
  // console.log('src:' + src)
  // console.log('dest:' + dest)
  if (!fs.existsSync(src)) return
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true })
  if (fs.existsSync(dest2)) fs.rmSync(dest2, { recursive: true })
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
  copyRecursive(src, dest2)
}

const copyVersionJSON = async () => {
  const src = path.resolve(__dirname, 'public/version.json')
  const dest = path.resolve(__dirname, 'node_modules/@zeeis/velectron/dist/resources/version.json')
  // console.log('src:' + src)
  // console.log('dest:' + dest)
  fs.copyFileSync(src, dest)
}
const deleteVersionJSON = async () => {
  const dest = path.resolve(__dirname, 'node_modules/@zeeis/velectron/dist/resources/version.json')
  if (!fs.existsSync(dest)) return
  fs.unlink(dest, (err) => {
    if (err) throw err;
    console.log('version.json was deleted');
  })
}

if (process.argv.includes('--pre')) {
  console.log('run copy-patch.js --pre')
  if (process.platform !== 'darwin') copyVersionJSON()
  copyModule()
  copyDeveloper()
} else if (process.argv.includes('--post')) {
  console.log('run copy-patch.js --post')
  if (process.platform === 'darwin') deleteVersionJSON()
  const dest = path.resolve(__dirname, 'build/electron/UnPackaged/node_modules/developer')
  const dest2 = path.resolve(__dirname, 'build/electron/UnPackaged/developer')
  if (fs.existsSync(dest)) {
    console.log(dest)
    fs.rmSync(dest, { recursive: true })
  }
  if (fs.existsSync(dest2)) {
    console.log(dest2)
    fs.rmSync(dest2, { recursive: true })
  }
}