const { expect } = require('@playwright/test')
class BasePage {
  constructor (page) {
    this.page = page
    this.isMac = process.platform === 'darwin'
    this.modifier = this.isMac ? 'Meta' : 'Control'
    // menu
    const leftDrawerClass = '.left-drawer-menu'
    this.menuIcon = page.locator('[aria-label="Menu"]')
    this.headerTitle = page.locator('.crumb-label')

    this.libraryLink = page.locator(`${leftDrawerClass} >> text=Library`)
    this.homeLink = page.locator(`${leftDrawerClass} >> .q-item__label:has-text("home")`)
    this.followingLink = page.locator(`${leftDrawerClass} >> text=following`)
    this.localFavoritesLink = page.locator(`${leftDrawerClass} >> text=local favorites`)
    this.exploreLink = page.locator(`${leftDrawerClass} >> text=travel_explore Explore`)
    this.editLink = page.locator(`${leftDrawerClass} >> text=edit_note Publish`)
    this.downUpLink = page.locator('text=HomeDownload/Upload and Media Files')
    this.downloadingStatus = page.locator(`${leftDrawerClass} #downloading`)
    this.uploadingStatus = page.locator(`${leftDrawerClass} #uploading`)
    this.downloadedStatus = page.locator(`${leftDrawerClass} #downloaded`)
    this.playerLink = page.locator(`${leftDrawerClass} >> text=Player`)
    this.creditsLink = page.locator(`${leftDrawerClass} >> text=credits`)
    this.walletLink = page.locator(`${leftDrawerClass} >> text=account_balance_wallet Wallet`)
    this.settingsLink = page.locator(`${leftDrawerClass} >> text=Settings for App`)
    this.accountSettingLink = page.locator(`${leftDrawerClass} >> text=account_circle Account`)

    this.basicLink = page.locator(`${leftDrawerClass} >> text=Basic`)
    this.basicLink_CN = page.locator(`${leftDrawerClass} >> text=基础设置`)
    this.basicLink_TW = page.locator(`${leftDrawerClass} >> text=基礎設置`)

    this.advancedLink = page.locator(`${leftDrawerClass} >> text=Advanced`)
    this.developmentLink = page.locator(`${leftDrawerClass} >> text=Development`)

    this.accountLink = page.locator('.corner')
    this.accountSignIn = page.locator('.corner-account >> button:has-text("Sign in")')
    this.accountMore = page.locator('.corner-account-info >> button:has-text("more_horiz")')
    this.accountSettings = page.locator('[data-cy="account-settings-btn"]')

    // header bar
    this.versionBtn = page.locator('#version')
    this.updateVersionBtn = page.locator('header i:has-text("update")')
    this.walletPageHeader = page.locator('header >> text=Walletaccount_balance_wallet')

    // about dialog
    const aboutDialogCss = '.q-card:has(.alphabiz-logo)'
    this.aboutDialog = page.locator(aboutDialogCss)
    this.alphabizLogo = page.locator('.alphabiz-logo')
    this.licenseBtn = page.locator('text=the license and terms')
    this.submitFeedbackBtn = page.locator('button:has-text("Submit feedback")')
    this.networkDiagnoticBtn = page.locator('button:has-text("Network Diagnotic")')
    this.AboutDialogCloseBtn = page.locator('.q-card:has(.alphabiz-logo) button:has-text("close")')

    // account card
    this.accountInput = page.locator('[aria-label="Phone number or email"]')
    this.passwordInput = page.locator('[aria-label="Password"]')
    this.signInBtn = page.locator('.q-card:has-text("Forgot your password?") >> button:has-text("Sign in")')
    this.signUpBtn = page.locator('button:has-text("Sign up")')
    this.signOutAnywayBtn = page.locator('button:has-text("Sign out anyway")')
    this.languageBtn = page.locator('.signed-out-actions button:has-text("language")')

    // alert
    this.alert = page.locator('.q-notifications__list--bottom.items-end >> .q-notification__message')
    this.centerAlert = page.locator('.q-notifications__list--bottom [role="alert"]')
    this.signInAlert = page.locator('div[role="alert"]:has-text("Signed in")')
    this.signOutAlert = page.locator('div[role="alert"]:has-text("check_circleSigned out")')
    this.defaultAppAlert = page.locator('text=Alphabiz is not your default app for')
    this.noShowAgainBtn = page.locator('text=SHOW AGAIN')
  }

  /**
   *
   * @param {string} target - homeLink、playerLink、creditsLink、accountLink
   */
  async jumpPage (firstTarget, secondTarget) {
    const menuButton = await this[secondTarget] || await this[firstTarget]
    await this.page.waitForTimeout(500)
    const isHidden = await this[firstTarget].isHidden()
    if (isHidden) {
      await this.menuIcon.click({ timeout: 60000 })
    }
    if (secondTarget) {
      if (await menuButton.isHidden()) {
        await this[firstTarget].click()
      }
    }
    await menuButton.click()
  }

  async clearLocalstorage () {
    await this.page.evaluate(() => { localStorage.clear() })
    await this.page.waitForTimeout(1000)
    await this.page.reload()
  }

  async setToken () {
    await this.page.evaluate(() => { localStorage.clear() })
    await this.page.evaluate(() => {
      console.log('addInitScript')
      localStorage.setItem('library-pair@ab-test-cate-v4-2','{"pub":"zoDutZZ8a5nuI8pbZ2EF-Dx1GnAh5ZTmCf-oC9g_Q8U.c4pvIzOrwBbT0RuJh5eXxbE1QQp2udIrJccJtIXgnno","epub":"IAFLSCKyOqPkXk-id1UOxZlZ9lqr6FvvHzVSnWHLh-A.4y7NinrkOYZYKBsqgCx_lJe9da12sRgKOq59S9rpvGw","priv":"kBX2IyUUWjnyunrmyj__ETekV05WfS3QocHDV1fxHlU","epriv":"DaZdbAUYD8UJNv8LI7qyiwW311bmmw_4heUq1le7dsQ"}')
      // localStorage.setItem('library-pair@ab-test-cate-v4-2', '{"pub":"YerJvz4cweCLGjm3SX36MGzLh9RwJSJgoN6sprQKtN4.KA-K5iBo2wSJpqNxZknF1QxfL4yDD3oCu2z6zHaiYZQ","epub":"bR5-z3iCh42JTt0gIBSrE_5VQGr3W953pI5l1dU0Jss.Rs9BcWmDqCP2K7zh38Zow7jBspa-C70C94cIr0aRV4M","priv":"1lR8ONa4bMhfhRgMU1etOQHZFBSTSiJbAf0L4oH-UeY","epriv":"9VhMOd5L4Ci-PYBetu_4GMBxG71sBCL31dDgwl47DHY"}')
      localStorage.setItem('set-film-rate', 'G')
    })
    await this.page.waitForTimeout(1000)
    await this.page.reload()
  }

  async quickSaveLanguage (targetLanguage) {
    let language
    if (targetLanguage === 'EN') language = 'english'
    else if (targetLanguage === 'CN') language = '简体中文'
    else if (targetLanguage === 'TW') language = '繁體中文'
    await this.languageBtn.click()
    await this.page.locator(`text=${language}`).click()
  }

  async signIn (username, password, isWaitAlert, isSetToken = true) {
    if (isSetToken) {
      await this.setToken()
    }
    await this.page.waitForLoadState()
    if (process.platform === 'darwin') await this.page.waitForTimeout(2000)
    if (!await this.accountInput.isVisible()) this.jumpPage('accountSignIn')
    await this.accountInput.fill(username)
    await this.passwordInput.fill(password)
    await this.signInBtn.click()

    if (isWaitAlert) {
      await this.alert.waitFor({ timeout: 90000 })
      const alertText = await this.alert.innerText()
      console.log('alert: [ ', alertText, ' ]')
      await this.signInAlert.waitFor()
      await this.waitLoadingLibKey()
    }
  }

  async signOut () {
    if (process.platform !== 'darwin') {
      await this.jumpPage('accountMore')
      await this.page.click('text=Sign out')
      await this.page.waitForTimeout(1000)
      if (await this.signOutAnywayBtn.isVisible()) { await this.signOutAnywayBtn.click() }
      await this.signOutAlert.waitFor()
      await this.page.waitForTimeout(3000)
      await this.waitForAllHidden(await this.alert)
    } else {
      await this.clearLocalstorage()
      await this.page.waitForTimeout(2000)
      await this.page.reload()
      await this.page.waitForLoadState()
      await this.page.waitForTimeout(2000)
    }
  }

  // Determine whether to log in and log in for download tests
  async ensureLoginStatus (username, password, isWaitAlert, isSetToken = true) {
    await this.page.waitForTimeout(500)
    // if not logged in
    if (await this.accountInput.isVisible()) {
      await this.signIn(username, password, isWaitAlert, isSetToken)
    } else {
      const leftBar = await this.downloadingStatus.isVisible()
      if (!leftBar) await this.menuIcon.click()
      if (await this.accountSignIn.isVisible()) {
        await this.signIn(username, password, isWaitAlert, isSetToken)
      }
      try {
        await this.accountMore.waitFor()
        if (await this.page.locator('text=Loading lib key').isVisible()) {
          await this.waitLoadingLibKey()
        }
      } catch {
        await this.page.evaluate(() => localStorage.clear())
        await this.page.reload()
        await this.signIn(username, password, isWaitAlert, isSetToken)
      }
    }
    
  }

  async waitLoadingLibKey () {
    try {
      await this.page.locator('text=Loading lib key').waitFor('visible', { timeout: 10000 })
      await this.waitForAllHidden(await this.page.locator('text=Loading lib key'), 90000)
    } catch {
      console.log('not wait loading lib key')
    }
    try {
      const headerTitle = await this.headerTitle.innerText()
      console.log('headerTitle', headerTitle)
      if (headerTitle.includes('Library')) {
        await this.page.locator('.post-card').nth(0).waitFor('visible', { timeout: 30000 })
      }
    } catch (e) {
      if (await this.page.locator('.q-card:has-text("No available post")').isVisible()) {
        await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")').click()
        expect(await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")')).toHaveCount(0)
      }
    }
    if (await this.page.locator('.q-card:has-text("No available post")').isVisible()) {
      await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")').click()
      expect(await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")')).toHaveCount(0)
    }
  }

  async waitForAllHidden (locator, timeout = 10000, waitTime = 200) {
    const start = Date.now()
    const elementsVisible = async () => (await locator.evaluateAll(elements => elements.map(element => element.hidden))).includes(false)

    while (await elementsVisible()) {
      if (start + timeout < Date.now()) {
        console.log(`Timeout waiting for all elements to be hidden. Locator: ${locator}. Timeout: ${timeout}ms`)
        expect(1).toBe(0)
      }
      if (waitTime) await this.page.waitForTimeout(waitTime)
    }
    // console.log(`All elements hidden: ${locator}`)
  }

  async checkAlert (logTitle, regex, options = { timeout: 60000 }) {
    if (typeof options.timeout === 'undefined') options.timeout = 60000
    if (typeof options.isWaitAlertHidden === 'undefined') options.isWaitAlertHidden = false
    if (typeof options.position === 'undefined') options.position = 'end'
    if (typeof options.isLog === 'undefined') options.isLog = true
    let alert = 'alert'
    if (options.position === 'center') {
      alert = 'centerAlert'
    }
    // wait alert
    await this[alert].waitFor({ timeout: options.timeout })
    const alertText = await this[alert].innerText()
    if (options.isLog) {
      console.log(`${logTitle} alert message: [ ${alertText} ]`)
    }
    await expect(this[alert]).toHaveText(regex)
    if (options.isWaitAlertHidden) {
      await this.waitForAllHidden(await this[alert])
    }
  }
}

module.exports = { BasePage }
