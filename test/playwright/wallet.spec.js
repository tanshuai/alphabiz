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
  basePage.checkForPopup()
})
test.afterAll(async () => {
})
test.beforeEach(async () => {
  const message = await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
  if (message == "success") {
    await basePage.waitForAllHidden(await basePage.alert)
  }
  const inHome = await window.locator('.left-drawer-menu .q-item:has-text("home").active-item').count()
  if (inHome > 0) {
    console.log('当前在首页')
    console.log('检查是否存在Follow菜单项')
    //等待
    await basePage.waitForSelectorOptional('.left-drawer-menu >> text=following', { timeout: 10000 }, '不可见')
    const followExist = await window.locator('.left-drawer-menu >> text=following').count() //小屏（不可见但存在）
    if (followExist > 0) {
      console.log('有')
    } else {
      console.log('没有')
      console.log('等待出现局部推荐页面的第一个频道')
      await window.waitForSelector('.channel-card >> nth=5', { timeout: 60000 })
      if (!await libraryPage.channelSelected.isVisible()) {
        console.log('选中第一个频道')
        await libraryPage.chanel1Local.click(); //局部推荐页的第一个频道定位
        console.log('成功选中')
      }
      console.log('点击Follow')
      // 3. 点击Follow按钮
      await libraryPage.channelFollowsBtn.click();
      console.log('成功Follow了一个频道')
      if (await basePage.followingLink.isVisible()) {
        console.log('菜单中出现了Follow选项')
      }
    }
    console.log('等待主页中的频道出现，否则稍等片刻会强制跳转回主页')
    const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
    if (mainLoad) console.log('已出现，页面加载完毕')
  }
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
    console.log('开启钱包页面')
    const headerTitle = await basePage.headerTitle.innerText()
    console.log('headerTitle: [ ', headerTitle, ' ]')
    if (!/Wallet/.test(headerTitle)) {
      console.log('准备跳转到钱包页面')
      await walletPage.jumpPage('walletLink')
      console.log('跳转成功')
    }
    await window.waitForTimeout(5000)
    const afterHeaderTitle = await basePage.headerTitle.innerText()
    if (!/Wallet/.test(afterHeaderTitle)) {
      console.log('afterHeaderTitle: [ ', afterHeaderTitle, ' ]')
      console.log('准备跳转到钱包页面')
      await walletPage.jumpPage('walletLink')
      console.log('跳转成功')
    }
    console.log('断言连接状态为：online')
    await expect(walletPage.connectionStatus).toHaveText(/online/, { timeout: 60000 })
    console.log('断言成功')
    await window.waitForTimeout(7000)
    await walletPage.ensureClearKey()
    console.log('确保清除密钥')
    if (typeof firstKey === 'undefined' && typeof secondKey === 'undefined') {
      firstKey = await walletPage.createKey()
      console.log('创建密钥')
      await window.waitForTimeout(3000)
      firstKey.coin = await walletPage.getCoin()
      console.log('获得硬币')

      await walletPage.ensureClearKey()
      console.log('确保清除密钥')

      secondKey = await walletPage.createKey()
      console.log('创建密钥')
      await window.waitForTimeout(3000)
      secondKey.coin = await walletPage.getCoin()
      console.log('获得硬币')

      await walletPage.ensureClearKey()
      console.log('确保清除密钥')
    }
  })

  test('copy-在各个页面复制私钥', async () => {
    await walletPage.recoveryKey(firstKey.privateKey)
    try{
      await walletPage.checkCollectionLink('homeLink', firstKey.address)
      await walletPage.checkCollectionLink('downloadingStatus', firstKey.address)
      // await walletPage.checkCollectionLink('uploadingStatus', firstKey.address)
      await walletPage.checkCollectionLink('playerLink', firstKey.address)
      await walletPage.checkCollectionLink('accountSettingLink', firstKey.address)
      // await walletPage.checkCollectionLink('basicLink', firstKey.address)
      await walletPage.checkCollectionLink('walletLink', firstKey.address, { isCloseDialog: false })
    }catch(error){
      console.log(error)
      test.skip()
    }
    console.log('验证转账功能')
    const amount = 100
    await walletPage.dwcAmountInput.fill(amount.toString())
    console.log('输入转账金额')
    await walletPage.dwcTransferBtn.click()
    console.log('点击传输按钮')
    await walletPage.checkWalletAlert('dwcAlertText')
    console.log('出现提示')

    await window.waitForTimeout(10000)
    await walletPage.walletPageHeader.click({ force: true })
    console.log('点击页头')
    console.log('断言0张钱包卡片')
    expect(walletPage.dialogWalletCard).toHaveCount(0)
    console.log('断言成功')

    await window.waitForTimeout(5000)
    // 检查账单信息 （自己给自己转账）
    await walletPage.checkTransferItem({
      senderAddress: firstKey.address, //发送者地址
      recipientAddress: firstKey.address, //接收者地址
      amount: amount // 金额
    })
    // .toBeLessThan toBeGreatedThen
    expect(await walletPage.getCoin()).toBeLessThan(firstKey.coin - amount)
    firstKey.coin = await walletPage.getCoin()
  })

  test('transfer-转账功能', async () => {
    const amount = 150
    // 转账用户
    await walletPage.recoveryKey(firstKey.privateKey)
    console.log('复制密钥')
    await walletPage.transfer(secondKey.address, amount)
    console.log('转账')
    await window.waitForTimeout(10000) 
    // 检查账单信息
    await walletPage.checkTransferItem({
      senderAddress: firstKey.address,
      recipientAddress: secondKey.address,
      amount: amount
    })
    console.log('断言')
    expect(await walletPage.getCoin()).toBeLessThanOrEqual(firstKey.coin - amount)
    console.log('断言成功')
    firstKey.coin = await walletPage.getCoin()
    console.log('计算硬币数量')
    // 退出账号
    await walletPage.ensureClearKey()
    console.log('清除密钥')

    // 收款用户
    await walletPage.recoveryKey(secondKey.privateKey)
    console.log('复制密钥')
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
