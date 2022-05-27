/* eslint-disable no-empty-pattern */
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const electronMainPath = require('../../test.config.js').electronMainPath
const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { sleep } = require('../utils/getCode')
const { parseCSV, get2DArray } = require('../utils/getCSV')
// get random email

let window, windows, electronApp, basePage, homePage
const ScreenshotsPath = 'test/output/playwright/main.spec/'
let from
let to
if (process.platform === 'win32') {
  from = 'test1'
  to = 'test2'
} else if (process.platform === 'linux') {
  from = 'test3'
  to = 'test4'
} else {
  from = 'test5'
  to = 'test6'
}
from = from + process.env.TEST_EMAIL_DOMAIN
to = to + process.env.TEST_EMAIL_DOMAIN
const taskGroup = [
  {
    groupName: 'group1',
    startNum: '10',
    endNum: '15'
  }, {
    groupName: 'group2',
    startNum: '18',
    endNum: '24'
  }
]
test.beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: [
      '--inspect=5858',
      electronMainPath
    ]
  })
  // Evaluation expression in the Electron context.
  await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath()
  })
  // Get the first window that the app opens, wait if necessary.
  window = await electronApp.firstWindow()

  await window.waitForTimeout(6000)
  // should main window
  windows = electronApp.windows()

  for (const win of windows) {
    if (await win.title() === 'Alphabiz') window = win
  }
  console.log('windows title:' + await window.title())
  // new Pege Object Model
  basePage = new BasePage(window)
  homePage = new HomePage(window)
})
test.beforeEach(async () => {
  await window.evaluate(() => localStorage.clear())
})
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    // await window.waitForTimeout(10000)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test('close set default', async () => {
  try {
    await basePage.defaultAppAlert.waitFor({ timeout: 3000 })
    await basePage.noShowAgainBtn.click()
    console.log('dont show again')
  } catch (error) {
    console.log('no wait for btn[dont show again]')
  }
})

for (const tg of taskGroup) {
  test.describe(`${tg.groupName}`, () => {
    test.beforeEach(async () => {
      await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
      await window.waitForLoadState()
      await sleep(2000)
    })
    test('reset task', async () => {
      await basePage.jumpPage('downloadingStatus')
      await homePage.searchBtn.click({ force: true })
      if (await homePage.downRemoveAllBtn.isEnabled()) {
        await homePage.downRemoveAllBtn.click()
        await homePage.deleteFileChk.click()
        await homePage.deleteBtn.click()
      }
      await basePage.jumpPage('uploadingStatus')
      if (await homePage.upRemoveAllBtn.isEnabled()) {
        await homePage.upRemoveAllBtn.click()
        await homePage.removeAutoUploadFilesChk.click()
        await homePage.deleteFileChk.click()
        await homePage.deleteBtn.click()
      }
    })
    test('add task', async () => {
      await basePage.jumpPage('downloadingStatus')
      await homePage.searchBtn.click({ force: true })
      const val = await parseCSV('test/samples/Movie list.csv')
      const magnetArray = get2DArray(val, 6)
      for (let j = 0, len = magnetArray.length; j < len; j++) {
        if ((j > tg.startNum && j <= tg.endNum) && magnetArray[j] !== '') {
          await homePage.downloadTorrent(magnetArray[j])
        }
      }
    })
    test('wait finish', async () => {
      test.setTimeout(60000 * 60)
      // 确认添加了5个任务，等待任务完成
      const allCard = await homePage.allCard
      const downloadNum = await allCard.count()
      console.log('downloadNum: ' + downloadNum)
      expect(downloadNum).toBe(5)
      await homePage.waitForAllHidden(allCard, 60000 * 60)
    })
    test('check task', async () => {
      await basePage.jumpPage('uploadingStatus')
      await window.waitForLoadState()
      await sleep(3000)

      const allCard = await homePage.allCard
      const uploadNum = await allCard.count()
      console.log('uploadNum: ' + uploadNum)
      expect(uploadNum).toBe(5)
    })
  })
}
