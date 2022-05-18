/* eslint-disable no-empty-pattern */
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const electronMainPath = require('../../test.config.js').electronMainPath
const { Commands } = require('./models/commands')
const { sleep } = require('../utils/getCode')
const { parseCSV, get2DArray } = require('../utils/getCSV')
// get random email

let window, windows, electronApp, commands
const ScreenshotsPath = 'test/output/playwright/main.spec/'

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
  commands = new Commands(window)
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
test.afterAll(async () => {
  // // Exit app.
  // await window.evaluate(() => localStorage.clear())

  // await electronApp.close()
})

test('close set default', async () => {
  await window.waitForLoadState()
  await sleep(1000)
  const notification = await window.locator('.q-notification__message >> text=Alphabiz is not')
  if (await notification.isVisible()) {
    const alert = await notification.innerText()
    console.log(alert)
    const targetAlert = 'DON\'T SHOW AGAIN'
    console.log(targetAlert)
    if (/Alphabiz is not your default app for torrent and media/.test(alert)) {
      await window.click('text=DON\'T SHOW AGAIN')
    }
    await notification.waitFor('hidden')
  }
})
test('read .csv add five torrent task', async () => {
  test.setTimeout(60000 * 60)
  const val = await parseCSV('test/samples/Movie list.csv')
  const magnetArray = get2DArray(val, 6)
  for (let j = 0, len = magnetArray.length; j < len; j++) {
    if (j <= 30 && magnetArray[j] !== '') {
      // await commands.jumpPage('downloadingStatus')
      await commands.downloadTorrent(magnetArray[j])
    }
  }
  await window.waitForTimeout(5000)
})
test('5min screenshot task status', async () => {
  test.setTimeout(60000 * 60 * 2)
  // 切换列表模式
  const listMode = await window.locator('button:has-text("view_agenda")')
  if (await listMode.isVisible()) {
    await listMode.click()
  }
  await window.click('text=Created timeSort')
  await window.click('div[role="option"]:has-text("Status")')
  await window.waitForTimeout(5 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-5min-task-downloading-status.png` })
  await window.waitForTimeout(5 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-10min-task-downloading-status.png` })
  await window.waitForTimeout(10 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-20min-task-downloading-status.png` })
  await window.waitForTimeout(10 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-30min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-30min-task-uploading-status.png` })
  await commands.jumpPage('downloadingStatus')
  await window.waitForTimeout(5 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-35min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-35min-task-uploading-status.png` })
  await commands.jumpPage('downloadingStatus')
  await window.waitForTimeout(5 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-40min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-40min-task-uploading-status.png` })

  await commands.jumpPage('downloadingStatus')
  await window.waitForTimeout(5 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-45min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-45min-task-uploading-status.png` })

  await commands.jumpPage('downloadingStatus')
  await window.waitForTimeout(5 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-50min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-50min-task-uploading-status.png` })

  await commands.jumpPage('downloadingStatus')
  await window.waitForTimeout(10 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-60min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-60min-task-uploading-status.png` })

  await commands.jumpPage('downloadingStatus')
  await window.waitForTimeout(10 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-70min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-70min-task-uploading-status.png` })

  await commands.jumpPage('downloadingStatus')
  await window.waitForTimeout(10 * 60000)
  await window.screenshot({ path: `${ScreenshotsPath}1-80min-task-downloading-status.png` })
  await commands.jumpPage('uploadingStatus')
  await window.waitForTimeout(2000)
  await window.screenshot({ path: `${ScreenshotsPath}2-80min-task-uploading-status.png` })
})
