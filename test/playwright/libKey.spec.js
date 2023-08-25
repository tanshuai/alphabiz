const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const electronMainPath = require('../../test.config.js').electronMainPath

const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { LibraryPage } = require('./models/libraryPage')
const { PlayerPage } = require('./models/playerPage')
const { BasicPage } = require('./models/basicPage')
const { AccountPage } = require('./models/accountPage')

let window, windows, electronApp, basePage, homePage, libraryPage, playerPage, basicPage, accountPage
const ScreenshotsPath = 'test/output/playwright/library_key.spec/'

let name
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
  electronApp = await electron.launch({
    args: [
      '--inspect=5858',
      electronMainPath
    ]
  })
  await electronApp.evaluate(async ({ app }) => {
    return app.getAppPath()
  })
  window = await electronApp.firstWindow()

  await window.waitForTimeout(6000)
  windows = electronApp.windows()

  for (const win of windows) {
    console.log(await win.title())
    if (await win.title() === 'Alphabiz') window = win
  }
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
  test.setTimeout(60000 * 5)
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
    const message = await basePage.ensureLoginStatus(name, accountPassword, true, true)
    console.log('已经登录')
    if (message == "success") {
      await basePage.waitForAllHidden(await basePage.alert)
    }
    const inHome = await window.locator('.left-drawer-menu .q-item:has-text("home").active-item').count()
    if (inHome > 0) {
      console.log('检查是否存在Follow菜单项')
      //等待
      await basePage.waitForSelectorOptional('.left-drawer-menu >> text=following', { timeout: 10000 }, '不可见')
      const followExist = await window.locator('.left-drawer-menu >> text=following').count() //小屏（不可见但存在）
      if (followExist > 0) {
        console.log('有')
      } else {
        console.log('没有')
        console.log('等待出现局部推荐页面的第一个频道')
        const firstChannel = await basePage.waitForSelectorOptional('.channel-card >> nth=5', { timeout: 60000 }, '没有出现')
        if(firstChannel){
          if (!await libraryPage.channelSelected.isVisible()) {
            console.log('选中第一个频道')
            await libraryPage.chanel1Local.click(); //局部推荐页的第一个频道定位
            console.log('成功选中')
          }
          console.log('点击Follow')
          // 3. 点击Follow按钮
          if (await libraryPage.channelFollowsBtn.isVisble()){
              await libraryPage.channelFollowsBtn.click()
          }
          console.log('成功Follow了一个频道')
          if (await basePage.followingLink.isVisible()) {
            console.log('菜单中出现了Follow选项')
          }
        }
      }
    }
    console.log('等待主页中的频道出现，否则稍等片刻会强制跳转回主页')
    const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
    if(mainLoad) console.log('已出现，页面加载完毕')
    else console.log('没有加载')
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
      const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
      if (mainLoad) console.log('已出现，页面加载完毕')
      try{
        await accountPage.disableCloudKey()
      } catch(error) {
        console.log('云端存储原本就已经关闭')
      }
      await console.log('使用独立密码新建密钥')
      // isABPassword = false, 不使用账户密码, 使用独立密码
      await accountPage.enableCloudKey(inPassword, false)
      await console.log('新建完毕')
      await window.waitForTimeout(3000)
      await console.log('准备退出')
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey(inPassword)
      await basePage.jumpPage('homeLink')
      console.log('等待主页中的频道出现，否则稍等片刻会强制跳转回主页')
      await window.waitForSelector('.post-channel-info', { timeout: 60000 })
      console.log('已出现，页面加载完毕')
    })
    test('修改独立密码', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      console.log('修改访问密钥的独立密码')
      await accountPage.cfgKeyPassword(inPassword, newPassword)
      await basePage.signOut()
      await basePage.waitForAllHidden(await basePage.alert)
      console.log('重新登录')
      await basePage.signIn(name, accountPassword, true, false)
      console.log('输入新的独立密码来导入密钥')
      await accountPage.syncCloudKey(newPassword)
      await basePage.jumpPage('homeLink')
      const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
      if (mainLoad) console.log('已出现，页面加载完毕')
    }) 
    test('结束前清除密钥', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await window.waitForTimeout(5000)
      await accountPage.disableCloudKey()
      await basePage.signOut()
    })
  })
  test.describe('账户密码', () => {
    test('登陆后自动创建媒体库密钥并备份到云', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      console.log('等待showMore按钮出现')
      await libraryPage.showMoreBtn.waitFor({timeout: 60000})
      console.log('是否已经有选中的频道')
      if (!await libraryPage.channelSelected.isVisible()) {
        console.log('没有，现在选上第一个频道卡片')
        await libraryPage.chanel1Global.click(); //全局推荐页的第一个频道定位
      } else {
        console.log('有')
      }
      console.log('点击Follow')
      await libraryPage.channelFollowsBtn.click();
      console.log('等待首页第一个卡片出现')
      await window.locator('.post-card').nth(0).waitFor({timeout:60000})
      console.log('退出')
      await basePage.signOut()
      console.log('重新登录')
      await basePage.signIn(name, accountPassword, true, false)
      console.log('等待出现第一张卡片, 证明保存了上次Follow的频道')
      await window.locator('.post-card').nth(0).waitFor({ timeout: 60000 })
      console.log('退出')
      await basePage.signOut()
    })
    // 密钥的更新
    test('登陆后更新密钥', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      console.log('登陆后选择创建新密钥')
      await accountPage.createCloudKey('', true, true)
      console.log('新密钥自动备份并导入客户端，等待第一张卡片出现')
      await window.locator('.post-card').nth(0).waitFor({ timeout: 60000 })
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
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
      await basePage.signOut()
      await basePage.signIn(name, accountResetPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
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
        if (await window.locator("button:has-text('arrow_back')").isVisible()){
          console.log('看见后退按钮')
          await window.locator("button:has-text('arrow_back')").click()
          console.log('点击')
        }
        await window.waitForTimeout(1000)
        const arrow_back = await basePage.waitForSelectorOptional("button:has-text('arrow_back')",{timeout: 5000}, '没有回退按钮')
        if(arrow_back){
          console.log('看见后退按钮')
          await window.locator("button:has-text('arrow_back')").click()
          console.log('点击')
        }
        await basePage.ensureLoginStatus(name, accountResetPassword, true, true)
        await window.waitForTimeout(5000)
        await basePage.jumpPage('accountSettingLink')
        console.log("重新修改账户密码")
        await accountPage.changePassword(accountResetPassword, accountPassword)
        await basePage.signOut()
      }
      await basePage.waitForAllHidden(await basePage.alert)
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
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
      await basePage.signOut()
      await basePage.signIn(name, accountResetPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      await window.waitForTimeout(15000)
      console.log('清除密钥')
      await accountPage.disableCloudKey()
      await basePage.signOut()
    })
  }) 
})