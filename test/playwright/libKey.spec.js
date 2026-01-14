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
var accountPassword = process.env.TEST_PASSWORD
var accountResetPassword = process.env.TEST_RESET_PASSWORD


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

  window.on('console', msg => {
    if (msg.type() === 'error') {
      if (msg.text().includes('WebSocket connection')) return
      if (msg.text().includes('get channel list')) return
      if (msg.text().includes('wire')) return
      if (msg.text().includes('a status of 404')) return
      if (msg.location().url.includes('recommends.txt')) return
      if (msg.location().url.includes('versions.json')) return
      if (msg.location().url.includes('alpha.biz')) return
      if (msg.location().url.includes('take - down.json')) return
      if (msg.text().includes('no such file or directory')) return
      if (msg.text().includes('resolver')) return
      console.log(`Console log: ${msg.text()} \n ${msg.location().url} \n lineNumber:${msg.location().lineNumber} \n columnNumber:${msg.location().columnNumber} \n`)
    }
  })
  basePage.checkForPopup()
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

test.describe('librayKey:媒体库密钥测试', () => {
  test.beforeEach(async () => {
  })
  // 清除密钥
  test('清除密钥', async () => { 
    console.log('准备登录')
    await basePage.ensureLoginStatus(name, accountPassword, true, true)
    console.log('已经登录')
    await basePage.waitForAllHidden(await basePage.alert)
    try {
      console.log('等待主页中的工具栏的图标出现，否则稍等片刻会强制跳转回主页')
      await window.waitForSelector('.q-toolbar:has-text("Type") >> text="arrow_drop_down"', { timeout: 60000 })
      console.log('已出现，页面加载完毕')
    } catch (error) {
      console.log('网络差，主页没有加载出来')
    }
    await console.log("准备清除密钥")
    await accountPage.disableCloudKey()
    await console.log("成功清除密钥")
    await console.log('准备退出')
    await basePage.signOut()
    await console.log('退出')
  })
  test.describe('独立密码', () => { 
    const inPassword = accountResetPassword
    const newPassword = accountPassword
    //由独立密码访问密钥
    test('使用独立密码访问密钥', async () => {
      await window.waitForLoadState()
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      // await window.waitForTimeout(3000)
      try {
        console.log('等待主页中的工具栏的图标出现，否则稍等片刻会强制跳转回主页')
        await window.waitForSelector('.q-toolbar:has-text("Type") >> text="arrow_drop_down"', { timeout: 60000 })
        console.log('已出现，页面加载完毕')
      } catch (error) {
        console.log('网络差，页面没有加载出来')
      }
      // isABPassword = false, 不使用账户密码
      try{
        await accountPage.disableCloudKey()
      } catch(error) {
        console.log('云端存储原本就已经关闭')
      }
      await console.log('使用独立密码新建密钥')
      await accountPage.enableCloudKey(inPassword, false)
      await console.log('新建完毕')
      await window.waitForTimeout(3000)
      // 验证同步云端
      await console.log('准备退出')
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey(inPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await basePage.jumpPage('homeLink')
      try{
        await window.locator('.post-card').nth(0).waitFor({ timeout: 60000 })
      }catch(error){
        console.log('网络差，没有加载出卡片')
      }
    })
    test('修改独立密码', async () => {
      //修改独立密码
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      console.log('修改访问密钥的独立密码')
      await accountPage.cfgKeyPassword(inPassword, newPassword)
      // 验证同步云端
      await basePage.signOut()
      await basePage.waitForAllHidden(await basePage.alert)
      console.log('重新登录')
      await basePage.signIn(name, accountPassword, true, false)
      console.log('输入新的独立密码来导入密钥')
      await accountPage.syncCloudKey(newPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await basePage.jumpPage('homeLink')
      await window.locator('.post-card').nth(0).waitFor({ timeout: 30000 })
    }) 
    test('结束前清除密钥', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await window.waitForTimeout(5000)
      await accountPage.disableCloudKey()
      // 验证取消同步云端
      await basePage.signOut()
    })
  })
  test.describe('账户密码', () => {
    test('登陆后自动创建媒体库密钥并备份到云', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      // 1. 等待showMoreBtn出现，可能有时候加载很慢
      console.log('等待showMore按钮出现')
      await libraryPage.showMoreBtn.waitFor({timeout: 60000})
      // 2. 判断是否有选中频道(.channel-card.selected)
      // 问题：判断语句 怎么用？
      console.log('是否已经有选中的频道')
      if (!await libraryPage.channelSelected.isVisible()) {
        console.log('没有，现在选上第一个频道卡片')
        //如果没有，则选中第一个.channel - card元素
        await libraryPage.chanel1Global.click(); //全局推荐页的第一个频道定位
      } else {
        console.log('有')
      }
      console.log('点击Follow')
      // 3. 点击Follow按钮
      await libraryPage.channelFollowsBtn.click();
      // 4. 等待home页面出现第一个post-card元素出现
      console.log('等待首页第一个卡片出现')
      await window.locator('.post-card').nth(0).waitFor({timeout:60000})
      // 验证同步云端功能
      console.log('退出')
      await basePage.signOut()
      console.log('重新登录')
      await basePage.signIn(name, accountPassword, true, false)
      console.log('等待出现第一张卡片，证明保存了上次Follow的频道')
      await window.locator('.post-card').nth(0).waitFor({ timeout: 60000 })
      console.log('退出')
      await basePage.signOut()
    })
    // 密钥的更新
    test('登陆后更新密钥', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      // 创建新的密钥
      console.log('登陆后选择创建新密钥')
      await accountPage.createCloudKey('', true, true)
      console.log('新密钥自动备份并导入客户端，等待第一张卡片出现')
      await window.locator('.post-card').nth(0).waitFor({ timeout: 60000 })
      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载，等待推荐页面出现
      await window.locator('.post-card').nth(0).waitFor({ timeout: 60000 })
    })
    // 更新账户密码
    test('修改账户密码', async () => {
      if (process.env.excludePasswordTest){
        console.log('由push触发的工作流, 选择跳过密码更改的测试')
        return
      }
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await window.waitForTimeout(5000)
      await basePage.jumpPage('accountSettingLink')
      let done = await accountPage.changePassword(accountPassword, accountResetPassword)
      if(done === false){
        console.log('没有成功修改账户密码')
        accountPage.cpCancelBtn.click()
        [accountPassword , accountResetPassword] = [accountResetPassword, accountPassword]
      } else {
        console.log('修改成功')
      }
      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountResetPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(15000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
    })
    // 测试忘记密码 -> 重置密码
    test('通过邮件重置账户密码', async () => {
      if (process.env.excludePasswordTest) {
        console.log('由push触发的工作流, 选择跳过密码重置的测试')
        return
      }
      await window.waitForTimeout(3000)
      try{
        await accountPage.resetPassword(name, accountPassword)
      } catch( error ){
        console.log('监听邮件失败')
        // 如果重置失败，那么选择重新改回密码
        console.log("重回登录页")
        await window.locator("button:has-text('arrow_back')").click()
        await window.waitForTimeout(1000)
        await window.locator("button:has-text('arrow_back')").click()
        await basePage.ensureLoginStatus(name, accountResetPassword, true, true)
        await window.waitForTimeout(5000)
        await basePage.jumpPage('accountSettingLink')
        console.log("重新修改账户密码")
        await accountPage.changePassword(accountResetPassword, accountPassword)
        await basePage.signOut()
      }
      await basePage.waitForAllHidden(await basePage.alert)
      // 验证同步云端
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(15000)
      await basePage.signOut()
    })
    // 检查账户密码
    test('检查最后的账户密码是否与环境变量一致', async () => {
      if (process.env.excludePasswordTest) {
        console.log('由push触发的工作流, 选择跳过密码更改的测试')
        return
      }
      if (accountPassword == process.env.TEST_PASSWORD) {
        console.log('一致')
        return
      }
      console.log('不一致, 需要再次修改账户密码')
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await window.waitForTimeout(5000)
      await basePage.jumpPage('accountSettingLink')
      let done = await accountPage.changePassword(accountPassword, accountResetPassword)
      if (done === false) {
        console.log('没有成功修改账户密码')
        accountPage.cpCancelBtn.click()
        [accountPassword, accountResetPassword] = [accountResetPassword, accountPassword]
      } else {
        console.log('修改成功')
      }
      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountResetPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(15000)
      console.log('清除密钥')
      await accountPage.disableCloudKey()
      await basePage.signOut()
    })
  }) 
})