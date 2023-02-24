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
  get accountMoreBtn () { return this.page.$('//Custom[starts-with(@Name,"Lv.")]/following-sibling::Button[1]')}
  get signOutBtn () { return this.page.$('//*[@Name="Sign out"]') }
  get signOutAnywayBtn () { return this.page.$('//Button[@Name="Sign out anyway"]') }
  get internalNoticeText () { return this.page.$('//*[@name="Internal Release Notice"]')}
  get closeInternalNoticeBtn () { return this.page.$('//*[@name="Internal Release Notice"]/following-sibling::Button[2]') }

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
    await this.username.setValue(username)
    await sleep(2000)
    await this.password.setValue(password)
    await sleep(2000)
    await this.signInBtn.click()

    if (opt.isWaitAlert) {
      // 等待登录卡片消失
      await this.username.waitUntil(async () => {
        return (await this.username.isDisplayed()) === false
      }, {
        timeout: 40000,
        timeoutMsg: 'signInCard is not hidden'
      })
      await sleep(2000)
      await this.importCloudKeyOKBtn.click()
      await this.importCloudKeyOKBtn.waitUntil(async () => {
        return (await this.importCloudKeyOKBtn.isDisplayed()) === false
      }, {
        timeout: 40000,
        timeoutMsg: 'importCloudKeyCard is not hidden'
      })
      if (await this.importCloudKeyOKBtn.isDisplayed()) {
        await this.importCloudKeyOKBtn.click()
        await this.importCloudKeyOKBtn.waitUntil(async () => {
          return (await this.importCloudKeyOKBtn.isDisplayed()) === false
        }, {
          timeout: 40000,
          timeoutMsg: 'The second attempt - importCloudKeyCard is not hidden'
        })
      }
      await sleep(3000)
      if (!(await this.page.$('//*[@Name="Credits"]').isDisplayed())) {
        await this.page.$('//Button[@Name="Menu"]').click()
      }
      await this.accountMoreBtn.waitForDisplayed({ timeout: 30000 })
    }
  }

  async ensureSignIn (username, password, opt = { isWaitAlert: false }) {
    // 判断是否已经登录
    if (await this.username.isDisplayed()) {
      // 未登录
      await this.signIn(username, password, { isWaitAlert: true })
    } else {
      // 判断是否需要导入云端密钥
      if (await this.importCloudKeyOKBtn.isDisplayed()) {
        await this.importCloudKeyOKBtn.click()
        await this.importCloudKeyOKBtn.waitUntil(async () => {
          return (await this.importCloudKeyOKBtn.isDisplayed()) === false
        }, {
          timeout: 40000,
          timeoutMsg: 'auto sign in - importCloudKeyCard is not hidden'
        })
      }
      await this.jumpPage('homeLink')
      // 已登陆,等待拉取数据
      // await client.$('//*[@Name="Settings"]').click()
      if (!await this.settingsLink.isDisplayed()) {
        await this.menuBtn.click()
        await sleep(1000)
        if (!await this.settingsLink.isDisplayed()) {
          await this.menuBtn.click()
        }
      }
      await this.accountMoreBtn.waitForDisplayed({ timeout: 15000 })
    }
  }

  async signOut () {
    if (!(await this.signOutBtn.isDisplayed())) {
      await this.accountSettingsTitle.waitForDisplayed({ timeout: 20000 })
      await this.accountMoreBtn.click()
    }
    await this.signOutBtn.click()
    await this.signOutAnywayBtn.click()
    await this.username.waitForDisplayed({ timeout: 20000 })
  }
}

module.exports = { AccountPage }
