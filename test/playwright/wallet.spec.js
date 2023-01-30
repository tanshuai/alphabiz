const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const electronMainPath = require('../../test.config.js').electronMainPath
const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { WalletPage } = require('./models/walletPage')
const { DevelopmentPage } = require('./models/developmentPage')

const app = require('../../developer/app.js')

let window, windows, electronApp, basePage, homePage, walletPage, developmentPage
const ScreenshotsPath = 'test/output/playwright/wallet.spec/'
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
    console.log(await win.title())
    if (await win.title() === 'Alphabiz') window = win
  }
  // new Pege Object Model
  basePage = new BasePage(window)
  homePage = new HomePage(window)
  walletPage = new WalletPage(window)
  developmentPage = new DevelopmentPage(window)

  // window.on('console', msg => {
  //   if (msg.type() === "error") {
  //     if (msg.text().includes('WebSocket connection')) return
  //     if (msg.text().includes('get channel list')) return
  //     if (msg.text().includes('wire')) return
  //     if (msg.text().includes('recommends.txt')) return
  //     console.log(`Console log: ${msg.text()} \n ${msg.location().url} \n lineNumber:${msg.location().lineNumber} \n columnNumber:${msg.location().columnNumber} \n`)
  //   }
  // })
})
test.afterAll(async () => {
})
test.beforeEach(async () => {
  await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
})
test.afterEach(async ({ }, testInfo) => {
  if (testInfo.title === 'create test env') return
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test('create test env', async () => {
  await basePage.waitForAllHidden(await basePage.alert)
  await developmentPage.openTools()
})

test.describe('wallet', () => {
  let firstKey, secondKey
  test.beforeEach(async ({ }, testInfo) => {
    if (testInfo.title === 'copy') test.skip()
    test.setTimeout(60000 * 15)
    await developmentPage.openWalletPage()
    const headerTitle = await basePage.headerTitle.innerText()
    console.log('headerTitle: [ ', headerTitle, ' ]')
    if (!/Wallet/.test(headerTitle)) await walletPage.jumpPage('walletLink')
    await window.waitForTimeout(5000)
    const afterHeaderTitle = await basePage.headerTitle.innerText()
    if (!/Wallet/.test(afterHeaderTitle)) {
      console.log('afterHeaderTitle: [ ', afterHeaderTitle, ' ]')
      await walletPage.jumpPage('walletLink')
    }
    await expect(walletPage.connectionStatus).toHaveText(/online/, { timeout: 60000 })
    await window.waitForTimeout(7000)
    await walletPage.ensureClearKey()

    if (typeof firstKey === 'undefined' && typeof secondKey === 'undefined') {
      firstKey = await walletPage.createKey()
      await window.waitForTimeout(3000)
      firstKey.coin = await walletPage.getCoin()

      await walletPage.ensureClearKey()

      secondKey = await walletPage.createKey()
      await window.waitForTimeout(3000)
      secondKey.coin = await walletPage.getCoin()

      await walletPage.ensureClearKey()
    }
  })

  test('copy', async () => {
    await walletPage.recoveryKey(firstKey.privateKey)
    await walletPage.checkCollectionLink('homeLink', firstKey.address)
    await walletPage.checkCollectionLink('downloadingStatus', firstKey.address)
    // await walletPage.checkCollectionLink('uploadingStatus', firstKey.address)
    await walletPage.checkCollectionLink('playerLink', firstKey.address)
    await walletPage.checkCollectionLink('accountSettingLink', firstKey.address)
    // await walletPage.checkCollectionLink('basicLink', firstKey.address)
    await walletPage.checkCollectionLink('walletLink', firstKey.address, { isCloseDialog: false })
    //验证转账功能
    const amount = 100
    await walletPage.dwcAmountInput.fill(amount.toString())
    await walletPage.dwcTransferBtn.click()
    await walletPage.checkWalletAlert('dwcAlertText')

    await window.waitForTimeout(10000)
    await walletPage.walletPageHeader.click({ force: true })
    expect(walletPage.dialogWalletCard).toHaveCount(0)

    await window.waitForTimeout(5000)
    // 检查账单信息
    await walletPage.checkTransferItem({
      senderAddress: firstKey.address,
      recipientAddress: firstKey.address,
      amount: amount
    })
      // .toBeLessThan toBeGreatedThen
    expect(await walletPage.getCoin()).toBeLessThan(firstKey.coin - amount)
    firstKey.coin = await walletPage.getCoin()
  })

  test('transfer', async () => {
    const amount = 150
    // 转账用户
    await walletPage.recoveryKey(firstKey.privateKey)
    await walletPage.transfer(secondKey.address, amount)
    await window.waitForTimeout(10000)
    // 检查账单信息
    await walletPage.checkTransferItem({
      senderAddress: firstKey.address,
      recipientAddress: secondKey.address,
      amount: amount
    })
    expect(await walletPage.getCoin()).toBeLessThanOrEqual(firstKey.coin - amount)
    firstKey.coin = await walletPage.getCoin()
    // 退出账号
    await walletPage.ensureClearKey()

    // 收款用户
    await walletPage.recoveryKey(secondKey.privateKey)
    await window.waitForTimeout(5000)
    // 检查账单信息
    await walletPage.checkTransferItem({
      senderAddress: firstKey.address,
      recipientAddress: secondKey.address,
      amount: amount
    })
    expect(await walletPage.getCoin()).toBeGreaterThanOrEqual(secondKey.coin + amount)
  })
})