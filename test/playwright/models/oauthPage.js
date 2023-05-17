const { expect } = require('@playwright/test')
const { BasePage } = require('./basePage')

class OauthPage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page

    this.signInWithGithubBtn = page.locator('button:has-text("Sign in with Github")')
    this.signInWithTwitterBtn = page.locator('button:has-text("Sign in with Twitter")')

    this.githubStatusBtn = page.locator('.q-item:has-text("Github") button')
    this.twitterStatusBtn = page.locator('.q-item:has-text("Twitter") button')
  }

  async signInGithub (username, password) {
    await this.page.waitForTimeout(3000)
    if (await this.page.locator('[name="login"]').isVisible()) {
      await this.page.locator('[name="login"]').fill(username)
      await this.page.locator('[name="password"]').fill(password)
      await this.page.locator('[name="commit"]').click()
    }
    await this.page.waitForTimeout(3000)
    if (await this.page.locator('button:has-text("Authorize alphabiz")').isVisible()) {
      await this.page.waitForTimeout(5000)
      await this.page.locator('button:has-text("Authorize alphabiz")').click()
    }
  }

  async signInTwitter (username, password) {
    await this.page.waitForURL('https://twitter.com/i/oauth2/**')
    await this.page.waitForTimeout(3000)
    if (await this.page.locator('[data-testid="OAuth_Consent_Log_In_Button"]').isVisible()) {
      await this.page.locator('[data-testid="OAuth_Consent_Log_In_Button"]').click()
      await this.page.locator('input[autocomplete="username"]').fill(username)
      await this.page.locator('div[role="button"]:has-text("Next")').click()
      await this.page.waitForTimeout(3000)
      if (await this.page.locator('[data-testid="ocfEnterTextTextInput"]').isVisible()) {
        await this.page.locator('[data-testid="ocfEnterTextTextInput"]').fill(username)
        await this.page.locator('[data-testid="ocfEnterTextNextButton"]').click()
      }
    }
    if (await this.page.locator('[data-testid="OAuth_Consent_Button"]').isVisible()) {
      await this.page.locator('[data-testid="OAuth_Consent_Button"]').click()
    }
  }
}

module.exports = { OauthPage }