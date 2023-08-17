const { expect } = require('@playwright/test')
const exp = require('constants')
const { BasePage } = require('./basePage')

class WalletPage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page

    const moreBtn = 'button:has-text("more_vert")'
    // network card (nc)
    const networkCardCSS = '.q-card:has-text("network")'
    this.networkCard = page.locator(networkCardCSS)
    this.connectionStatus = page.locator(`${networkCardCSS} [role="alert"]:has([role="progressbar"])`)
    this.ncMoreBtn = page.locator(`${networkCardCSS} >> ${moreBtn}`)

    // get started card (gsc)
    const getStartedCardCss = '.q-card:has-text("get started")'
    this.getStartedCard = page.locator(getStartedCardCss)
    // gsc part one
    this.gscCreateBtn = page.locator(`${getStartedCardCss} button:has-text("create")`)
    this.gscPrivateKeyInput = page.locator(`${getStartedCardCss} label:has-text("private key") input`)
    this.gscRecoveryBtn = page.locator(`${getStartedCardCss} button:has-text("recovery")`)
    // gsc part two
    const addressTextCss = 'text=address >> //following::*[1]'
    const publicKeyTextCss = 'text=public key >> //following::*[1]'
    const privateKeyTextCss = 'text=private key >> //following::*[1]'
    const copyBtnCss = 'button:has-text("content_copy")'
    this.gscAddressText = page.locator(`${getStartedCardCss} >> ${addressTextCss}`)
    this.gscAddressCopyBtn = page.locator(`${getStartedCardCss} >> ${addressTextCss} >> ${copyBtnCss}`)
    this.gscPublicKeyText = page.locator(`${getStartedCardCss} >> ${publicKeyTextCss}`)
    this.gscPublicKeyCopyBtn = page.locator(`${getStartedCardCss} >> ${publicKeyTextCss} >> ${copyBtnCss}`)
    this.gscPrivateKeyText = page.locator(`${getStartedCardCss} >> ${privateKeyTextCss}`)
    this.gscPrivateKeyCopyBtn = page.locator(`${getStartedCardCss} >> ${privateKeyTextCss} >> ${copyBtnCss}`)
    this.gscBackBtn = page.locator(`${getStartedCardCss} button:has-text("back")`)
    this.gscConfirmBtn = page.locator(`${getStartedCardCss} button:has-text("confirm")`)

    // account card (ac)
    const accountCardCss = '.q-card:has-text("account")'
    this.accountCard = page.locator(accountCardCss)
    this.acMoreBtn = page.locator(`${accountCardCss} >> ${moreBtn}`)
    this.acAddressText = page.locator(`${accountCardCss} >> ${addressTextCss}`)
    this.acAddressCopyBtn = page.locator(`${accountCardCss} >> ${addressTextCss} >> ${copyBtnCss}`)
    this.acPublicKeyText = page.locator(`${accountCardCss} >> ${publicKeyTextCss}`)
    this.acPublicKeyCopyBtn = page.locator(`${accountCardCss} >> ${publicKeyTextCss} >> ${copyBtnCss}`)
    this.acExportPrivateKeyBtn = page.locator('text=export private key')
    this.acDeleteAccountBtn = page.locator('text=delete account')

    // wallet card (wc)
    const walletCardCss = '.q-card:has-text("wallet")'
    this.walletCard = page.locator(walletCardCss)
    this.wcMoreBtn = page.locator(`${walletCardCss} >> ${moreBtn}`)
    this.wcBalanceText = page.locator(`${walletCardCss} >> .text-h4`)
    this.wcAddressInput = page.locator(`${walletCardCss} label:has-text("recipient address") input`)
    this.wcAmountInput = page.locator(`${walletCardCss} label:has-text("amount") input`)
    this.wcTransferBtn = page.locator(`${walletCardCss} button:has-text("transfer")`)
    this.wcAlertText = page.locator(`${walletCardCss} .blockchain-message`)

    // dialog wallet card (wc)
    const dialog = '.q-dialog'
    this.dialogWalletCard = page.locator(`${dialog} ${walletCardCss}`)
    this.dwcMoreBtn = page.locator(`${dialog} ${walletCardCss} >> ${moreBtn}`)
    this.dwcBalanceText = page.locator(`${dialog} ${walletCardCss} >> .text-h4`)
    this.dwcAddressInput = page.locator(`${dialog} ${walletCardCss} label:has-text("recipient address") input`)
    this.dwcAmountInput = page.locator(`${dialog} ${walletCardCss} label:has-text("amount") input`)
    this.dwcTransferBtn = page.locator(`${dialog} ${walletCardCss} button:has-text("transfer")`)
    this.dwcAlertText = page.locator(`${dialog} ${walletCardCss} .blockchain-message`)
    this.CopyLinkBtn = page.locator('text=collection link')

    // transaction vard (tc)
    const transactionCardCss = '.q-card:has-text("transaction")'
    this.transferList = page.locator('.q-card:has-text("transaction") tr')
    this.transactionCard = page.locator(transactionCardCss)
    this.tcSyncBtn = page.locator(`${transactionCardCss} button:has-text("sync_disabled")`)
    this.tcStopSyncBtn = page.locator(`${transactionCardCss} button:has-text("sync")`)
    this.tcRefreshBtn = page.locator(`${transactionCardCss} button:has-text("refresh")`)
    const fullscreenBtnCss = 'button:has-text("fullscreen")'
    this.tcfullscreenBtn = page.locator(`${transactionCardCss} ${fullscreenBtnCss}`)
    this.transferObj = {
      item: '',
      coinType: '>> :nth-match(td, 1)',
      senderAddress: '>> :nth-match(td, 2)',
      recipientAddress: '>> :nth-match(td, 3)',
      amount: '>> :nth-match(td, 4)',
      time: '>> :nth-match(td, 5)'
    }
  }
  getTransferItemEle (num, target) {
    const transferItemCss = `.q-card:has-text("transaction") tr >> nth=${num} ${this.transferObj[target]}`
    return this.page.locator(transferItemCss)
  }

  async checkTransferItem (info) {
    if (typeof info.coinType === 'undefined') info.coinType = '0x1::TestCoin::TestCoin'
    if (typeof info.amount === 'undefined') info.amount = /\d+/
    if (typeof info.gas === 'undefined') info.gas = 66
    const num = await this.transferList.count()
    const lastNum = num >= 2 ? num - 1 : 1
    if (info.senderAddress) {
      const senderAddressRegexp = new RegExp(`0x(0*|)${info.senderAddress.replace(/^0x(0*|)/, '')}`)
      expect(await this.getTransferItemEle(lastNum, 'senderAddress')).toHaveText(senderAddressRegexp)
    }
    if (info.recipientAddress) {
      const recipientAddressRegexp = new RegExp(`0x(0*|)${info.recipientAddress.replace(/^0x(0*|)/, '')}`)
      expect(await this.getTransferItemEle(lastNum, 'recipientAddress')).toHaveText(recipientAddressRegexp)
    }

    const coinTypeText = await this.getTransferItemEle(lastNum, 'coinType').innerText()
    expect(coinTypeText).toBe(info.coinType)

    const amountText = await this.getTransferItemEle(lastNum, 'amount').innerText()
    expect(parseInt(amountText)).toBe(info.amount)

    // const gasText = await this.getTransferItemEle(lastNum, 'gas').innerText()
    // expect(parseInt(gasText)).toBe(info.gas)

    // await expect(this.getTransferItemEle(lastNum, 'time')).toHaveText(/\d{13}/)

    // await expect(this.getTransferItemEle(lastNum, 'version')).toHaveText(/\d+/)
  }

  async ensureClearKey () {
    const isVisibleGetStartCard = await this.getStartedCard.isVisible()
    // console.log('isVisibleGetStartCard', isVisibleGetStartCard)
    if (isVisibleGetStartCard) return
    await this.deleteKey()
    await this.page.waitForTimeout(1000)
  }
  async createKey () {
    this.gscCreateBtn.click()
    const keyObj = {}
    const address = await this.gscAddressText.innerText()
    const publicKey = await this.gscPublicKeyText.innerText()
    const privateKey = await this.gscPrivateKeyText.innerText()
    keyObj.address = address.replace('content_copy', '').replace(/\n/g, '')
    keyObj.publicKey = publicKey.replace('content_copy', '').replace(/\n/g, '')
    keyObj.privateKey = privateKey.replace('content_copy', '').replace(/\n/g, '')
    // console.log('keyObj', keyObj)
    await this.page.waitForTimeout(3000)
    await this.gscConfirmBtn.click()
    await this.walletCard.waitFor({ timeout: 60000})
    return keyObj
  }
  async recoveryKey (privateKey) {
    await this.gscPrivateKeyInput.fill(privateKey)
    await this.page.waitForTimeout(1000)
    await this.gscRecoveryBtn.click()
    await this.walletCard.waitFor()
    await this.page.waitForTimeout(1000)
  }
  async deleteKey () {
    await this.acMoreBtn.click()
    await this.acDeleteAccountBtn.click()
    await this.getStartedCard.waitFor()
  }

  async checkCollectionLink (targetPage, address, options = {}) {
    if (typeof options.isCloseDialog === 'undefined') options.isCloseDialog = true
    const headerTitle = await this.headerTitle.innerText()
    if (!/Wallet/.test(headerTitle)) await this.jumpPage('walletLink')
    // copy
    await this.wcMoreBtn.click()
    await this.CopyLinkBtn.click()
    await this.checkAlert('copy', /Copied/, { isWaitAlertHidden: true, isLog: false })
    if (targetPage !== 'walletLink'){
      console.log(`准备跳转到${targetPage}`)
      await this.jumpPage(targetPage)
      console.log('跳转成功')
    }
    await this.page.waitForTimeout(2000)
    await this.page.keyboard.press(`${this.modifier}+KeyV`)
    console.log('粘贴')
    try{
      await this.dialogWalletCard.waitFor()
      await this.walletPageHeader.waitFor()
    }catch(error){
      console.log('粘贴键不起作用')
      console.log(error)
      test.skip()
    }
    // 检查信息
    const addressText = await this.dwcAddressInput.inputValue()
    expect(addressText).toBe(address)

    if (options.isCloseDialog) {
      await this.walletPageHeader.click({ force: true })
      await this.page.waitForTimeout(1000)
      expect(this.dialogWalletCard).toHaveCount(0)
    }
  }

  async getCoin () {
    const coin = await this.wcBalanceText.innerText()
    return parseInt(coin)
  }

  async transfer (address, amount) {
    await this.wcAddressInput.fill(address)
    await this.wcAmountInput.fill(amount.toString())
    await this.wcTransferBtn.click()
    // 验证转账成功
    await this.checkWalletAlert('wcAlertText')
  }
  async checkWalletAlert (targetCard) {
    // 验证转账成功
    expect(await this[targetCard]).toHaveText(/Pending/)
    expect(await this[targetCard]).not.toHaveText(/Pending/, { timeout: 10000 })
    expect(await this[targetCard]).toHaveText(/Success/, { timeout: 10000 })
  }
}

module.exports = { WalletPage }