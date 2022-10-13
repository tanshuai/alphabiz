const { sleep } = require('../../../utils/getCode')
class AccountPage {
  constructor (page) {
    this.page = page
  }

  get signInText () { return this.page.$('//Text[@Name="Sign in"]') }
  get username () { return this.page.$('//Edit[@Name="Phone number or email"]') }
  get password () { return this.page.$('//Edit[@Name="Password"]') }
  get signInBtn () { return this.page.$('//Button[@Name="SIGN UP"]/preceding-sibling::Button[1]') }
  get importCloudKeyOKBtn () { return this.page.$('//Button[@Name="OK"]') }
  get accountSettingsTitle () { return this.page.$('//Text[@Name="Account"]') }
  get signOutBtn () { return this.page.$('//*[@Name="Sign out"]') }
  get signOutAnywayBtn () { return this.page.$('//Button[@Name="Sign out anyway"]') }

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
      await sleep(3000)
      if (!(await this.page.$('//*[@Name="Credits"]').isDisplayed())) {
        await this.page.$('//Button[@Name="Menu"]').click()
      }
      await this.accountSettingsTitle.waitForDisplayed()
    }
  }

  async signOut () {
    if (!(await this.signOutBtn.isDisplayed())) {
      await this.accountSettingsTitle.waitForDisplayed({ timeout: 20000 })
      await this.page.$('//Custom[@Name="Lv. 2"]/following-sibling::Button[1]').click()
    }
    await this.signOutBtn.click()
    await this.signOutAnywayBtn.click()
    await this.username.waitForDisplayed({ timeout: 20000 })
  }
}

module.exports = { AccountPage }
