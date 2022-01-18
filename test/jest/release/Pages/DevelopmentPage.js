class DevelopmentPage {
  constructor (page) {
    this.page = page
  }

  get devInfo () { return this.page.$('//*[@Name="Dev Info"]') }
  get resetTorrentBtn () { return this.page.$('//Button[@Name="RESET"][position()=1]') }

  async clearTorrentConfig () {
    await this.devInfo.click()
    await this.resetTorrentBtn.click()
  }
}

module.exports = { DevelopmentPage }
