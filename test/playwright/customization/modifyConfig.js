const fs = require('fs')
const path = require('path')
const testcfg = require('./testcfg')
function modifyConfig () {
  // modify app config
  const appCfgPath = path.resolve(__dirname, '../../../developer/app.js')
  const oldAppCfgContent = fs.readFileSync(appCfgPath, 'utf-8')
  let appCfgContent = oldAppCfgContent
  appCfgContent = appCfgContent
    .replace('APP = \'Alphabiz\'', `APP = '${testcfg.name}'`)
    .replace('<dev@alpha.biz>', testcfg.author)
    .replace('https://alpha.biz', testcfg.homepage)
    .replace('shortProtocol: \'ab\'', `shortProtocol: '${testcfg.shortProtocol}'`)
    .replace('@alphabiz', testcfg.twitterAccount)
    .replace('app.name // + \'-\' + SUB_VERSION', `'${testcfg.LIBDB_NAME}'`)
    .replace('primary: \'#d1994b\'', `primary: '${testcfg.primary}'`)
    .replace('secondary: \'#f3ce90\'', `secondary: '${testcfg.secondary}'`)
    .replace('accent: \'#fbbb4a\'', `accent: '${testcfg.accent}'`)
  // console.log(appCfgContent)
  fs.writeFileSync(appCfgPath, appCfgContent)

  // modify update config
  const updateCfgPath = path.resolve(__dirname, '../../../developer/update.js')
  const oldUpdateCfgContent = fs.readFileSync(updateCfgPath, 'utf-8')
  let updateCfgContent = oldUpdateCfgContent
  updateCfgContent = updateCfgContent
    .replace('username: \'tanshuai\'', `username: '${testcfg.username}'`)
    .replace('repo: \'alphabiz\'', `repo: '${testcfg.repo}'`)
    .replace(/branch:\s'\w+'/gm, `branch: '${testcfg.branch}'`)
  // console.log(updateCfgContent)
  fs.writeFileSync(updateCfgPath, updateCfgContent)

  // modify theme.scss
  // const themeCfgPath = path.resolve(__dirname, '../../../developer/theme.scss')
  // const oldThemeCfgContent = fs.readFileSync(themeCfgPath, 'utf-8')
  // let themeCfgContent = oldThemeCfgContent
  // themeCfgContent = themeCfgContent
  //   .replace('primary #66ccff #66ccff', `primary ${testcfg.primary} ${testcfg.primaryDark}`)
  //   .replace('secondary #66ccff #66ccff', `secondary ${testcfg.secondary} ${testcfg.secondaryDark}`)
  //   .replace('accent #66ccff #66ccff', `accent ${testcfg.accent} ${testcfg.accentDark}`)
  //   .replace('positive #66ccff #66ccff', `positive ${testcfg.positive} ${testcfg.positiveDark}`)
  //   .replace('negative #b03535 #b30f0f', `negative ${testcfg.negative} ${testcfg.negativeDark}`)
  // // console.log(updateCfgContent)
  // fs.writeFileSync(themeCfgPath, themeCfgContent)

  // modify terms-of-service.md
  const termsCfgPath = path.resolve(__dirname, '../../../developer/terms-of-service.md')
  const oldTermsCfgContent = fs.readFileSync(termsCfgPath, 'utf-8')
  let termsCfgContent = oldTermsCfgContent
  termsCfgContent = termsCfgContent
    .replace('Welcome to Use Alphabiz App (the "App").', testcfg.testContent)
  // console.log(termsCfgContent)
  fs.writeFileSync(termsCfgPath, termsCfgContent)
}
function modifyAssets () {
  [
    'assets',
    'icons',
    'platform-assets',
    'favicon.ico',
    'icon-1024.png'
  ].forEach(assetDir => {
    const src = path.resolve(__dirname, 'test-assets', assetDir)
    const dest = path.resolve(__dirname, '../../../developer/' + assetDir)
    if (!fs.existsSync(src)) return console.error('not found', src)
    // console.log('--- COPY ---\n', src, '\n', dest, '\n--- COPY END ---')
    // fs.rmSync not support low version
    const removeDir = (dir) => {
      const files = fs.readdirSync(dir) // 一个数组
      files.forEach((item) => {
        let file = dir + "/" + item
        if (fs.statSync(file).isFile()) {
          fs.unlinkSync(file)
        } else {
          removeDir(file)
        }
      })
      fs.rmdirSync(dir)
    }
    if (fs.existsSync(dest)) {
      const nodeVersion = /(?<=v)\d{1,2}(?=.)/.exec(process.version)
      if (nodeVersion[0] < 14) removeDir(dest)
      else fs.rmSync(dest, { recursive: true })
    }
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

modifyConfig()
modifyAssets()



