class AccountPage {
  constructor (page) {
    this.page = page
  }

  get signInText () { return this.page.$('//Text[@Name="Sign in"]') }
  get username () { return this.page.$('//Edit[@Name="Phone number or email"]') }
  get password () { return this.page.$('//Edit[@Name="Password"]') }
  get signInBtn () { return this.page.$('//Button[@Name="SIGN UP"]/preceding-sibling::Button[1]') }
  get accountSettingsTitle () { return this.page.$('//Text[@Name="Account"]') }
  get signOutBtn () { return this.page.$('//*[@Name="Sign out"]') }

  async signIn (username, password, isWaitAlert) {
    await this.username.setValue(username)
    await this.password.setValue(password)
    await this.signInBtn.click()

    if (isWaitAlert) {
      // 等待登录卡片消失
      const signInCard = await this.username
      await signInCard.waitUntil(async () => {
        return (await this.username.isDisplayed()) === false
      }, {
        timeout: 40000,
        timeoutMsg: 'signInCard is not hidden'
      })
      if (!(await this.page.$('//*[@Name="Credits"]').isDisplayed())) {
        await this.page.$('//Button[@Name="Menu"]').click()
      }
      await this.accountSettingsTitle.waitForDisplayed()
    }
  }

  async signOut () {
    if (!(await this.signOutBtn.isDisplayed())) {
      await this.accountSettingsTitle.waitForDisplayed({ timeout: 20000 })
      await this.page.$('/Pane/Document/Group[2]/Group[2]').click()
    }
    await this.signOutBtn.click()
    await this.page.$('//Test[@Name="Want to Join"]').waitForDisplayed({ timeout: 15000 })
  }
}

module.exports = { AccountPage }
