const { expect } = require('@playwright/test')
const { BasePage } = require('./basePage')

class DevelopmentPage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page

    this.paymentModeTab = page.locator('[role="tab"]:has-text("payment mode")')

    this.walletPageCkb = page.locator('label:has-text("blockchain account page") [role="checkbox"]')
  }

  async openTools () {
    const isVisibleDevelopment = await this.developmentLink.isVisible()
    if (isVisibleDevelopment) return
    await this.versionBtn.click()
    await this.aboutDialog.waitFor()
    await this.alphabizLogo.click({ clickCount: 5 })
    await this.checkAlert('Tools', /is enabled/, { position: 'center' })
    await this.AboutDialogCloseBtn.click()
  }

  async openWalletPage () {
    const headerTitle = await this.headerTitle.innerText()
    if (/Wallet/.test(headerTitle)) return
    const isVisibleWallet = await this.walletLink.isVisible()
    if (isVisibleWallet) return
    await this.jumpPage('developmentLink')
    await this.paymentModeTab.click()
    const isOpenWallet = await this.walletPageCkb.getAttribute('aria-checked')
    if (isOpenWallet !== 'true') {
      await this.walletPageCkb.click()
    }
  }
}

module.exports = { DevelopmentPage }
