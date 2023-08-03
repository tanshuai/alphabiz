const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const electronMainPath = require('../../test.config.js').electronMainPath

const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { LibraryPage } = require('./models/libraryPage')
const { PlayerPage } = require('./models/playerPage')
const { BasicPage } = require('./models/basicPage')
const { AccountPage } = require('./models/accountPage')

const app = require('../../developer/app.js')
let window, windows, electronApp, basePage, homePage, libraryPage, playerPage, basicPage, accountPage
const ScreenshotsPath = 'test/output/playwright/library_key.spec/'

let name, checkName
if (process.platform === 'win32') {
  name = 'test7'
} else if (process.platform === 'linux') {
  name = 'test8'
} else {
  name = 'test9'
}
name = name + process.env.TEST_EMAIL_DOMAIN
const accountPassword = process.env.TEST_PASSWORD
const accountResetPassword = process.env.TEST_RESET_PASSWORD


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
  libraryPage = new LibraryPage(window)
  playerPage = new PlayerPage(window)
  basicPage = new BasicPage(window)
  accountPage = new AccountPage(window)
})

test.beforeEach(async () => {
  test.setTimeout(60000 * 4)
})

test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test.describe('key', () => {
  test.beforeEach(async () => {
  })
  test.describe('independent password', () => {  //暂时跳过
    const inPassword = process.env.TEST_RESET_PASSWORD
    const newPassword = process.env.TEST_PASSWORD

    test.skip('importing a Local Key', async () => { // 此用例已不可用
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await window.waitForTimeout(20000)
      if (await accountPage.recommendTitle.isVisible()) await accountPage.recommendPage()
      await accountPage.ckImportChk.waitFor()
      const taskAbk = './test/cypress/fixtures/samples/test.abk'
      await window.locator('[name="input-file"][accept=".abk"]').setInputFiles(taskAbk, { timeout: 60000 })
      await window.waitForTimeout(100000)
    })
    test.skip('save cloud key', async () => {
      await window.waitForLoadState()
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await window.waitForTimeout(10000)
      await accountPage.disableCloudKey()
      await accountPage.enableCloudKey(inPassword, false)
      await window.waitForTimeout(3000)
      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey(inPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await basePage.jumpPage('homeLink')
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test.skip('config password', async () => {
      await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true, true)
      await accountPage.cfgKeyPassword(inPassword, newPassword)
      // 验证同步云端
      await basePage.signOut()
      await basePage.waitForAllHidden(await basePage.alert)
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await accountPage.syncCloudKey(newPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await basePage.jumpPage('homeLink')
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
      await basePage.waitForAllHidden(await basePage.alert)
    })
    test.skip('update and save key in cloud', async () => {
      test.setTimeout(5 * 60000)
      await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true, false)
      // 创建新的密钥
      await accountPage.createCloudKey(newPassword, true)
      // 等待密钥配置，加载, 等待推文页面出现
      await basePage.jumpPage('homeLink')
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await accountPage.syncCloudKey(newPassword, { isABPassword: true })
      // 等待密钥配置，加载，等待推荐页面出现
      await basePage.jumpPage('homeLink')
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test.skip('disable cloud key', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await window.waitForTimeout(5000)
      await accountPage.disableCloudKey()

      // 验证取消同步云端
      await basePage.signOut()
      // await basePage.signIn(name, accountPassword, true, false)
      // await accountPage.ckCard.waitFor()
      // await expect(accountPage.ckFromcloudChk).toHaveText(/Disable cloud storage/)
      // await basePage.clearLocalstorage()
      // await window.waitForTimeout(3000)
    })
    // 该功能已取消
    test.skip('create and save key in cloud', async () => {
      test.setTimeout(5 * 60000)
      await basePage.clearLocalstorage()
      await window.waitForTimeout(3000)
      await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true, false)
      // 创建新的密钥
      await accountPage.createCloudKey(inPassword, false, false)
      // 等待密钥配置，加载, 等待推荐页面出现
      await libraryPage.tweetsFrist.waitFor({ timeout: 60000 })

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await basePage.waitForAllHidden(await basePage.alert)
      // 验证密码错误
      await accountPage.syncCloudKey('1234567890', { isCorrectPassword: false })
      await accountPage.syncCloudKey(inPassword)
      // 等待密钥配置，加载，等待推荐页面出现
      await basePage.jumpPage('homeLink')
      await libraryPage.tweetsFrist.waitFor({ timeout: 60000 })
      await basePage.signOut()
    })
    // 该功能已取消
    test.skip('disable cloud key force', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await window.waitForTimeout(15000)
      await accountPage.disableCloudKey()

      // 验证取消同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.ckCard.waitFor()
      await expect(accountPage.ckFromcloudChk).toHaveText(/Disable cloud storage/)
      // await basePage.signOut()
      await basePage.clearLocalstorage()
      await window.waitForTimeout(3000)
    })
  })
  test.describe('aws password', () => {
    test.skip('create and save key in cloud', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      await window.waitForTimeout(30000)
      if (await accountPage.recommendTitle.isVisible()) {
        await accountPage.recommendPage()
      } else {
        await libraryPage.tweetsFrist.waitFor()
      }
      await accountPage.disableCloudKey()
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      // 创建新的密钥
      // await accountPage.createCloudKey('', false, true)
      await window.waitForTimeout(5000)
      if (await accountPage.recommendTitle.isVisible()) await accountPage.recommendPage()
      // 等待密钥配置，加载, 等待推荐页面出现
      await window.waitForTimeout(5000)
      await basePage.getOneS.click()
      await basePage.recommendFollowOenBtn.click()

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载，等待推荐页面出现
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
    })
    test.skip('update and save key in cloud', async () => {
      test.setTimeout(5 * 60000)
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      // 创建新的密钥
      await accountPage.createCloudKey('', true, true)
      // 等待密钥配置，加载, 等待推荐页面出现
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载，等待推荐页面出现
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test('change password', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await window.waitForTimeout(5000)
      await basePage.jumpPage('accountSettingLink')
      await accountPage.changePassword(accountPassword, accountResetPassword)

      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountResetPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(15000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
    })
    test('change password again', async () => { //跳过重置密码时临时启用
      await basePage.ensureLoginStatus(name, accountResetPassword, true, true)
      await window.waitForTimeout(5000)
      await basePage.jumpPage('accountSettingLink')
      await accountPage.changePassword(accountResetPassword, accountPassword)
      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(15000)
      // if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
    })
    test.skip('reset password', async () => { //邮件监听器 待测试
      await window.waitForTimeout(3000)
      await accountPage.resetPassword(name, accountPassword)
      await basePage.waitForAllHidden(await basePage.alert)
      // 验证同步云端
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(15000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
    })
    // 若重置失败，手动修改密码
    // test('')
    test('config password', async () => {
      await basePage.ensureLoginStatus(name, accountResetPassword, true, true)
      await window.waitForTimeout(5000)
      await accountPage.cfgKeyPassword(accountPassword, accountResetPassword)
      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey(accountResetPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(5000)
      if (await libraryPage.recommendTitle.isVisible()) await libraryPage.recommendPageTest()
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test('disable cloud key', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await accountPage.disableCloudKey()

      // 验证取消同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      // await accountPage.ckCard.waitFor()
      await window.waitForTimeout(10000)
      if (await accountPage.recommendTitle.isVisible()) await libraryPage.recommendPageTest()
      // await basePage.jumpPage('accountSettingLink')
      // await expect(accountPage.ckFromcloudChk).toHaveText(/Disable cloud storage/)
      // await basePage.clearLocalstorage()
      // await window.waitForTimeout(3000)
    })
  })
})