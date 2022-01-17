class CreditsPage {
  constructor (page) {
    this.page = page
  }

  get CreditsText () { return this.page.$('//*[starts-with(@Name, "Your credits:")]') }

  async checkCredits () {
    await this.CreditsText.waitForDisplayed({ timeout: 20000 })
    const credit = new RegExp('(?<=[:]\\s)\\d+').exec(await this.CreditsText.getText())
    return credit[0]
  }
}

module.exports = { CreditsPage }
