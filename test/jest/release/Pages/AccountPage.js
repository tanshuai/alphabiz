const { sleep } = require('../../../utils/getCode')
const { HomePage } = require('./HomePage')
class AccountPage extends HomePage {
  constructor (page) {
    super(page)
    this.page = page
  }

  get signInText () { return this.page.$('//Text[@Name="Sign in"]') }
  get username () { return this.page.$('//Edit[@Name="Phone number or email"]') }
  get password () { return this.page.$('//Edit[@Name="Password"]') }
  get signInBtn () { return this.page.$('//Button[@Name="SIGN UP"]/preceding-sibling::Button[1]') }
  get importCloudKeyOKBtn () { return this.page.$('//Button[@Name="OK"]') }
  get accountSettingsTitle () { return this.page.$('//Text[@Name="Account"]') }
  get accountMoreBtn () { return this.page.$('//Custom[starts-with(@Name,"Lv.")]/following-sibling::Button[1]') }
  // get accountMoreBtn () { return this.page.$('//Custom[starts-with(@Name,"Lv.")]/ancestor::Group[3]/Button[1]') }
  get signOutBtn () { return this.page.$('//*[@Name="Sign out"]') }
  get signOutAnywayBtn () { return this.page.$('//Button[@Name="Sign out anyway"]') }
  get internalNoticeText () { return this.page.$('//Text[@Name="Internal Release Notice"]') }
  get closeInternalNoticeBtn () { return this.page.$('//Text[@Name="Internal Release Notice"]/parent::*/Button[2]') }
  get language () { return this.page.$('/Document[@Name="Alphabiz"]/Group/Group/Button[1]') }
  get reUsername () { return this.page.$('/Group[@Name="+86"]/Group/Edit[@Name="+86"]') }

  async changeLanguage (targetLang = 'English') {
    await this.language.click()
    await sleep(1000)
    await this.page.$(`//Text[@Name="${targetLang}"]"`).click()
  }

  async closeInternalNotice () {
    const windowTitle = await this.page.getTitle()
    console.log('windowTitle', windowTitle)
    if (windowTitle === 'Alphabiz') {
      const version = await this.getAppVersion()
      if (version.includes('internal') || version.includes('nightly')) {
        await this.internalNoticeText.click()
        await this.closeInternalNoticeBtn.click()
      }
    }
  }

  async signIn (username, password, opt = { isWaitAlert: false }) {
    // await this.closeInternalNotice()
    // await this.changeLanguage()
    console.log('输入用户名')
    await this.username.setValue(username)
    await sleep(2000)
    console.log('输入密码')
    await this.password.setValue(password)
    await sleep(2000)
    // await this.reUsername.setValue(username)
    await this.signInBtn.click()
    console.log('点击登录')

    if (opt.isWaitAlert) {
      // 等待登录卡片消失
      console.log('等待登录卡片消失')
      await this.username.waitUntil(async () => {
        return (await this.username.isDisplayed()) === false
      }, {
        timeout: 60000,
        timeoutMsg: 'signInCard is not hidden'
      })
      await sleep(2000)
      await this.importCloudKeyOKBtn.click()
      console.log('点击导入密钥OK')
      await this.importCloudKeyOKBtn.waitUntil(async () => {
        return (await this.importCloudKeyOKBtn.isDisplayed()) === false
      }, {
        timeout: 60000,
        timeoutMsg: 'importCloudKeyCard is not hidden'
      })
      if (await this.importCloudKeyOKBtn.isDisplayed()) {
        await this.importCloudKeyOKBtn.click()
        await this.importCloudKeyOKBtn.waitUntil(async () => {
          return (await this.importCloudKeyOKBtn.isDisplayed()) === false
        }, {
          timeout: 60000,
          timeoutMsg: 'The second attempt - importCloudKeyCard is not hidden'
        })
      }
      await sleep(5000)
      if (!(await this.page.$('//*[@Name="Credits"]').isDisplayed())) {
        console.log('//*[@Name="Credits"]不可见（小窗口）')
        await this.page.$('//Button[@Name="Menu"]').click()
        console.log('点击三道杠，展开侧边栏')
        // console.log('等待三个点出现，验证侧边栏展开')
        // await this.accountMoreBtn.waitForDisplayed({ timeout: 30000 })
        await sleep(5000)
      }else{
        console.log('//*[@Name="Credits"]可见（大窗口）')
      }
    }
  }

  async ensureSignIn (username, password, opt = { isWaitAlert: false }) {
    // 判断是否已经登录
    console.log('判断是否已经登录')
    if (await this.username.isDisplayed()) {
      // 未登录
      console.log('未登录，立即登录')
      await this.signIn(username, password, { isWaitAlert: true })
    } else {
      console.log('已登录, 判断是否需要导入云端密钥')
      // 判断是否需要导入云端密钥
      if (await this.importCloudKeyOKBtn.isDisplayed()) {
        console.log('导入云端密钥的ok按钮可见')
        await this.importCloudKeyOKBtn.click()
        console.log('点击')
        await this.importCloudKeyOKBtn.waitUntil(async () => {
          return (await this.importCloudKeyOKBtn.isDisplayed()) === false
        }, {
          timeout: 40000,
          timeoutMsg: 'auto sign in - importCloudKeyCard is not hidden'
        })
      }
      console.log('等待跳转到首页')
      await this.jumpPage('homeLink')
      console.log('成功跳转')
      // 已登陆,等待拉取数据
      // await client.$('//*[@Name="Settings"]').click()
      if (!await this.settingsLink.isDisplayed()) {
        await this.menuBtn.click()
        console.log('点击菜单按钮')
      }
      console.log('等待accountMoreBtn出现')
      // await this.accountMoreBtn.waitForDisplayed({ timeout: 15000 })
      await sleep(5000)
      console.log('已经出现')
    }
  }

  async signOut () {
    if (!(await this.signOutBtn.isDisplayed())) {
      // await this.accountSettingsTitle.waitForDisplayed({ timeout: 20000 })
      await sleep(5000)
      await this.accountMoreBtn.click()
    }
    await this.signOutBtn.click()
    await this.signOutAnywayBtn.click()
    await this.username.waitForDisplayed({ timeout: 20000 })
  }
}

module.exports = { AccountPage }
