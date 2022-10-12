class CreditsPage {
  constructor (page) {
    this.page = page
  }

  get CreditsText () { return this.page.$('//*[@Name="Your credits"]/following-sibling::*[1]') }

  async checkCredits () {
    await this.CreditsText.waitForDisplayed({ timeout: 20000 })
    const creditsText = await this.CreditsText.getText()
    console.log('creditsText', creditsText)
    return Number(creditsText)
  }
}

module.exports = { CreditsPage }
