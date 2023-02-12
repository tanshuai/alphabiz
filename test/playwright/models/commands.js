const { expect } = require('@playwright/test')
class Commands {
  constructor (page) {
    this.page = page
    // menu
    this.menuIcon = page.locator('[aria-label="Menu"]')
    this.homeLink = page.locator('text=HomeDownload/Upload and Media Files')
    this.downloadingStatus = page.locator('.left-drawer-menu >> text=Downloading')
    this.uploadingStatus = page.locator('.left-drawer-menu >> text=Uploading')
    this.downloadedStatus = page.locator('.left-drawer-menu >> text=Downloaded')
    this.playerLink = page.locator('text=PlayerMedia Player')
    this.creditsLink = page.locator('text=CreditsCheck Account Balance')
    this.settingsLink = page.locator('text=settingsSettings')
    this.basicLink = page.locator('text=Basic Basic Settings')
    this.advancedLink = page.locator('text=AdvancedAdvanced')
    this.developmentLink = page.locator('text=developer_modeDevelopment Developer Mode for Internal Use')
    this.accountLink = page.locator('.corner')
    this.accountSignUp = page.locator('button:has-text("Sign in")')
    this.accountMore = page.locator('button:has-text("more_horiz")')
    this.accountSettings = page.locator('[data-cy="account-settings-btn"]')
    // home
    this.downloadBtn = page.locator('button:has-text("Download")')
    // credits
    // account
    this.SignOutAnywayBtn = page.locator('button:has-text("Sign out anyway")')
  }

  /**
   *
   * @param {string} target - homeLink、playerLink、creditsLink、accountLink
   */
  async jumpPage (firstTarget, secondTarget) {
    const menuButton = await this[secondTarget] || await this[firstTarget]
    if (await this[firstTarget].isHidden()) {
      await this.menuIcon.click()
    }
    if (secondTarget) {
      if (await menuButton.isHidden()) {
        await this[firstTarget].click()
      }
    }
    await menuButton.click()
  }

  // home
  async downloadTorrent (magnet) {
    await this.downloadBtn.click()
    await this.page.fill('[aria-label="Download directory position"]  >> //preceding::*[1]', magnet)
    await this.page.fill('[aria-label="Download directory position"]', './test/download')
    await this.page.click('.q-card >> button:has-text("Download")')
    await this.page.waitForTimeout(300)
    if (!(await this.page.locator('.q-card >> button:has-text("Cancel")').isHidden())) {
      await this.page.click('.q-card >> button:has-text("Cancel")')
    }
    await this.page.waitForTimeout(300)
  }

  async signIn (username, password, isWaitAlert) {
    if (await this.page.locator('[aria-label="Phone number or email"]').isHidden()) this.jumpPage('accountSignUp')
    await this.page.waitForTimeout(500)
    await this.page.fill('[aria-label="Phone number or email"]', username)
    await this.page.fill('[aria-label="Password"]', password)
    await this.page.click('.q-card >> button:has-text("Sign in")')

    if (isWaitAlert) {
      await this.page.locator('.q-notification__message >> text=Signed in').waitFor({ timeout: 40000 })
    }
  }

  async signOut () {
    await this.jumpPage('accountMore')
    await this.page.click('text=Sign out')
    await this.page.waitForTimeout(1000)
    if (await this.SignOutAnywayBtn.isVisible()) { await this.SignOutAnywayBtn.click() }
    await this.page.locator('.q-notification__message >> text=Signed out').waitFor()
    await this.page.evaluate(() => localStorage.clear())
  }

  // Determine whether to log in and log in for download tests
  async ensureLoginStatus (username, password, isWaitAlert) {
    // if not logged in
    if (await this.page.locator('[aria-label="Phone number or email"]').isVisible()) {
      await this.signIn(username, password, isWaitAlert)
    } else {
      if (await this.downloadingStatus.isHidden()) await this.menuIcon.click()
      if (!await this.accountSignUp.isHidden()) {
        await this.signIn(username, password, isWaitAlert)
      }
    }
    // else {
    //   console.log('logined')
    // }
  }

  // credits

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

module.exports = { Commands }
