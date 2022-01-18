class BasicPage {
  constructor (page) {
    this.page = page
  }

  // 语言切换
  get english () { return this.page.$('//*[@Name="English"]') }
  get simplifiedChinese () { return this.page.$('//*[@Name="简体中文"]') }
  get traditionalChinese () { return this.page.$('//*[@Name="繁體中文"]') }

  async switchLanguages (initialLanguage, finalLanguage) {
    await this[initialLanguage].click()
    await this[finalLanguage].click()
  }
}

module.exports = { BasicPage }
