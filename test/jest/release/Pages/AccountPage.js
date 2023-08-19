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
  get resetPassword () { return this.page.$('//*[@Name="Reset password"]')}
  get signInBtn () { return this.page.$('//Button[@Name="SIGN UP"]/preceding-sibling::Button[1]') }
  get importCloudKeyOKBtn () { return this.page.$('//Button[@Name="OK"]') }
  get accountSettingsTitle () { return this.page.$('//Text[@Name="Account"]') }
  get libraryGroup() {return this.page.$('//Group[@Name="Library"]')}
  get publishGroup () { return this.page.$('//Group[@Name="Publish"]') }
  get fullScreenBtn () { return this.page.$('//Text[@Name="Alphabiz"]/following-sibling::Button[2]')}
  get menuBtn () { return this.page.$('//Button[@Name="Menu"]') }
  get accountMoreBtn () {return this.page.$('//Group[@Name="Library"]/preceding-sibling::Button[1]')}
  // get accountMoreBtn () { return this.page.$('//Custom[starts-with(@Name,"Lv.")]/following-sibling::Button[1]') }
  // get accountMoreBtn () { return this.page.$('//Custom[starts-with(@Name,"Lv.")]/ancestor::Group[3]/Button[1]') }
  get signOutBtn () { return this.page.$('//*[@Name="Sign out"]') }
  get signOutAnywayBtn () { return this.page.$('//Button[@Name="Sign out anyway"]') }
  get internalNoticeText () { return this.page.$('//Text[@Name="Internal Release Notice"]') }
  get closeInternalNoticeBtn () { return this.page.$('//Text[@Name="Internal Release Notice"]/parent::*/Button[2]') }
  get language () { return this.page.$('//*[@Name="Alphabiz"]/Group/Group/Button[1]') }
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
    }
  }

  async signOut () {
    console.log('判断左侧栏是否可见')
    let limit = 4
    while (limit > 0 && !(await accountPage.libraryGroup.isDisplayed())) {
      limit = limit - 1
      console.log('locate full-screen button')
      await accountPage.fullScreenBtn.click()
      console.log('full screen!')
    }
    // if (!(await this.libraryGroup.isDisplayed())) {
    //   console.log('libraryGroup不可见 左侧栏 is hidden')
    //   await this.menuBtn.click()
    //   console.log('点击三道杠，展开侧边栏')
    //   await sleep(5000)
    // } else {
    //   console.log('libraryGroup可见 左侧栏 can see')
    // }
    console.log('locate the button')
    await this.accountMoreBtn.click()
    console.log('show the options')
    await this.signOutBtn.click()
    console.log('click the signOut button')
    await this.signOutAnywayBtn.click()
    console.log('confirm to sign out')
    await this.username.waitForDisplayed({ timeout: 20000 })
  }
}

module.exports = { AccountPage }
