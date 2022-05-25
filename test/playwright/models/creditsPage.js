const { expect } = require('@playwright/test')

class CreditsPage {
  constructor (page) {
    this.page = page
    // credits
    this.creditsText = page.locator('.text-right > div')
    this.transferBtn = page.locator('button:has-text("Transfer")')
    this.receiveBtn = page.locator('button:has-text("Receive")')
    this.cannelBtn = page.locator('button:has-text("Cancel")')
    // transfer card
    this.transferCard = page.locator('.q-card:has-text("Transfer by filling")')
    this.receiveCodeInput = page.locator('[aria-label="Receipt Code"]')
    this.amountInput = page.locator('[aria-label="Transfer Amount"]')
    this.confirmBtn = page.locator('.q-form >> button:has-text("TRANSFER")')
    // receive card
    this.receiveCodeText = page.locator('input[type=text]')
    this.copyBtn = page.locator('button:has-text("Copy")')
    // transaction details card
    this.transDetailCard = page.locator('.q-card:has-text("transaction details")')
  }

  async getID () {
    await this.receiveBtn.click()
    let userID = (await this.receiveCodeText.inputValue()).split('')
    // 将收款人id中的大写转为小写
    let newStr = ''
    // 通过for循环遍历数组
    for (let i = 0; i < userID.length; i++) {
      if (userID[i] >= 'A' && userID[i] <= 'Z') { newStr += userID[i].toLowerCase() } else { newStr += userID[i] }
    }
    userID = newStr
    await this.cannelBtn.click()

    return userID
  }

  async getCredit () {
    await this.page.waitForTimeout(3000)
    return await this.creditsText.innerText()
  }

  async transfer (ID, amount) {
    await this.transferBtn.click()
    await this.receiveCodeInput.fill(ID)
    await this.amountInput.fill(amount)
    await this.confirmBtn.click()
    await this.transferCard.waitFor('hidden')
  }

  async checkBillDetail (detail, type) {
    await this.page.waitForLoadState()
    await this.page.waitForTimeout(1000)
    await this.page.click(`.q-card:has-text("${type}") >> .transaction-item >> nth=0`)

    await this.transDetailCard.waitFor('visible')

    for (var index in detail) {
      if (detail[index] === 'Transfer') {
        const categoryText = await this.page.locator('form >> text=Category >> //following::*[1]').innerText()
        expect(categoryText).toBe(detail[index])
      } else if (detail[index] === 'finish') {
        const statusText = await this.page.locator('form >> text=Status >> //following::*[1]').innerText()
        expect(statusText).toBe(detail[index])
      } else if (/^(\+|-)\d+$/.test(detail[index])) {
        const changedAmountText = await this.page.locator('form >> text=Changed Amount >> //following::*[1]').innerText()
        expect(changedAmountText).toBe(detail[index])
      } else { await this.page.click('form >> :nth-match(div:has-text("' + detail[index] + '"), 3)') }
    }
    await this.cannelBtn.click()
  }
}
module.exports = { CreditsPage }
