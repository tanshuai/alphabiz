const { expect } = require('@playwright/test')
class BasePage {
  constructor (page) {
    this.page = page
    // menu
    this.menuIcon = page.locator('[aria-label="Menu"]')
    this.headerTitle = page.locator('.toolbar-title')
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
    this.accountSignIn = page.locator('.corner-account >> button:has-text("Sign in")')
    this.accountMore = page.locator('button:has-text("more_horiz")')
    this.accountSettings = page.locator('[data-cy="account-settings-btn"]')

    // account
    this.accountInput = page.locator('[aria-label="Phone number or email"]')
    this.passwordInput = page.locator('[aria-label="Password"]')
    this.signInBtn = page.locator('.q-card:has-text("Forgot your password?") >> button:has-text("Sign in")')
    this.signUpBtn = page.locator('button:has-text("Sign up")')
    this.signOutAnywayBtn = page.locator('button:has-text("Sign out anyway")')
    // alert
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

  async signIn (username, password, isWaitAlert) {
    if (await this.accountInput.isHidden()) this.jumpPage('accountSignIn')
    await this.page.waitForTimeout(500)
    await this.accountInput.fill(username)
    await this.passwordInput.fill(password)
    await this.signInBtn.click()

    if (isWaitAlert) {
      await this.signInAlert.waitFor({ timeout: 40000 })
    }
  }

  async signOut () {
    if (process.platform !== 'darwin') {
      await this.jumpPage('accountMore')
      await this.page.click('text=Sign out')
      await this.page.waitForTimeout(1000)
      if (await this.signOutAnywayBtn.isVisible()) { await this.signOutAnywayBtn.click() }
      await this.signOutAlert.waitFor()
    }
    await this.page.evaluate(() => localStorage.clear())
    await this.page.reload()
  }

  // Determine whether to log in and log in for download tests
  async ensureLoginStatus (username, password, isWaitAlert) {
    // if not logged in
    if (await this.accountInput.isVisible()) {
      await this.signIn(username, password, isWaitAlert)
    } else {
      if (await this.downloadingStatus.isHidden()) await this.menuIcon.click()
      if (!await this.accountSignIn.isHidden()) {
        await this.signIn(username, password, isWaitAlert)
      }
    }
  }
}

module.exports = { BasePage }
