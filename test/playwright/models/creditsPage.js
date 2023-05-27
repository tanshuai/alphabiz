const { expect } = require('@playwright/test')

class CreditsPage {
  constructor (page) {
    this.page = page
    // credits
  }

  async getID () {
    await this.page.click('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(2)')
    let userID = (await this.page.locator('input[type=text]').inputValue()).split('')
    // 将收款人id中的大写转为小写
    let newStr = ''
    // 通过for循环遍历数组
    for (let i = 0; i < userID.length; i++) {
      if (userID[i] >= 'A' && userID[i] <= 'Z') { newStr += userID[i].toLowerCase() } else { newStr += userID[i] }
    }
    userID = newStr
    await this.page.click('button:has-text("Cancel")')

    return userID
  }

  async getCredit () {
    await this.page.waitForTimeout(3000)
    return await this.page.locator('.text-right > div').innerText()
  }

  async transfer (ID, amount) {
    await this.page.click('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(1)')
    await this.page.fill('[aria-label="Receipt Code"]', ID)
    await this.page.fill('[aria-label="Transfer Amount"]', amount)
    await this.page.click('.q-form >> button:has-text("TRANSFER")')
    await this.page.locator(':nth-child(2) > .q-card').waitFor('hidden')
  }

  async checkBillDetail (detail, type) {
    await this.page.waitForLoadState()
    await this.page.waitForTimeout(1000)
    if (type === 'expense') await this.page.click('.q-table__grid-content > :nth-child(1) >> text=-')
    else await this.page.click('.q-table__grid-content > :nth-child(1) >> text=+')
    await this.page.locator('form >> text=cancel').waitFor('visible')

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
    await this.page.click('button:has-text("Cancel")')
  }
}
module.exports = { CreditsPage }
