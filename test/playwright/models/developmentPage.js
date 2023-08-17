const { expect } = require('@playwright/test')
const { BasePage } = require('./basePage')

class DevelopmentPage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page

    this.loadCard = page.locator('.post-card').nth(0)

    this.paymentModeTab = page.locator('[role="tab"]:has-text("payment mode")')

    this.walletPageCkb = page.locator('label:has-text("blockchain account page") [role="checkbox"]')
  }

  async openTools () {
    console.log('开启开发者选项')
    const isVisibleDevelopment = await this.developmentLink.isVisible()
    if (isVisibleDevelopment) {
      console.log('原本已经开启')
      return
    } 
    await this.versionBtn.click({ timeout: 5000 , force:true})
    await this.aboutDialog.waitFor()
    console.log('出现about页面')
    await this.alphabizLogo.click({ clickCount: 5 })
    console.log('点击五下Logo')
    await this.checkAlert('Tools', /is enabled/, { position: 'center' })
    console.log('出现提示')
    await this.AboutDialogCloseBtn.click()
    console.log('关闭about页')
  }

  async openWalletPage () {
    const headerTitle = await this.headerTitle.innerText()
    if (/Wallet/.test(headerTitle)) return
    const isVisibleWallet = await this.walletLink.isVisible()
    if (isVisibleWallet) return
    await this.loadCard.waitFor({ timeout: 30000 })
    await this.jumpPage('developmentLink')
    await this.paymentModeTab.click()
    const isOpenWallet = await this.walletPageCkb.getAttribute('aria-checked')
    if (isOpenWallet !== 'true') {
      await this.walletPageCkb.click()
    }
  }
}

module.exports = { DevelopmentPage }
