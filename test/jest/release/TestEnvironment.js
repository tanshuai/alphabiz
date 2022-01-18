const path = require('path')

const AlphabizAppId = path.resolve(__dirname, './alphabiz/electron/Alphabiz-win32-x64/Alphabiz.exe')
// 'C:/alphabiz/electron/Alphabiz-win32-x64/Alphabiz.exe'

export const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    browserName: '',
    platformName: 'Windows',
    deviceName: 'WindowsPC',
    appWaitDuration: 60000,
    createSessionTimeout: 60000,
    app: AlphabizAppId
  },
  logLevel: 'error'
  // afterTest: function (test) {
  // if (test.error !== undefined) {
  //   const name = 'ERROR-' + Date.now()
  //   browser.saveScreenshot('./errorShots/' + name + '.png')
  // }
  // }
}
