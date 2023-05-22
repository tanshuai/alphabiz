const { expect } = require('@playwright/test')
const { BasePage } = require('./basePage')
const { getMailCode } = require('../../utils/getCode')
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
    let newTime
    await this.page.waitForTimeout(3000)
    if (await this.page.locator('[name="login"]').isVisible()) {
      await this.page.locator('[name="login"]').fill(username)
      await this.page.locator('[name="password"]').fill(password)
      newTime = new Date()
      await this.page.waitForTimeout(3000)
      await this.page.locator('[name="commit"]').click()
    }
    await this.page.waitForTimeout(3000)
    // if (await this.page.locator('input[placeholder="XXXXXX"]').isVisible()) {
    //   console.log('github need Device Verification Code!')
    //   const verificationCode = await getMailCode({ type: 1, time: newTime, to: username, oauth: 'github' })
    //   console.log('github verificationCode:', verificationCode)
    //   await this.page.locator('input[placeholder="XXXXXX"]').fill(verificationCode)
    //   await this.page.locator('input[value="Verify"]').click()
    //   await this.page.waitForTimeout(5000)
    // }
    try{
      if (await this.page.locator('button:has-text("Authorize alphabiz")').isVisible()) {
        await this.page.locator('button:has-text("Authorize alphabiz")').click()
      }
    }catch (err) {

    }
  }

  async signInTwitter (username, password, twitterUsername) {
    let newTime
    await this.page.waitForURL('https://twitter.com/i/oauth2/**')
    await this.page.waitForTimeout(3000)
    if (await this.page.locator('[data-testid="OAuth_Consent_Log_In_Button"]').isVisible()) {
      await this.page.locator('[data-testid="OAuth_Consent_Log_In_Button"]').click()
      await this.page.locator('input[autocomplete="username"]').fill(username)
      await this.page.waitForTimeout(2000)
      newTime = new Date()
      await this.page.locator('div[role="button"]:has-text("Next")').click()
      await this.page.waitForTimeout(5000)
      try {
        if (await this.page.locator('[data-testid="ocfEnterTextTextInput"]').isVisible()) {
        await this.page.locator('[data-testid="ocfEnterTextTextInput"]').fill(twitterUsername)
        await this.page.locator('[data-testid="ocfEnterTextNextButton"]').click()
        await this.page.waitForTimeout(3000)
      }
      } catch (err) {

      }

      if (await this.page.locator('input[name="password"]').isVisible()) {
        console.log('twitter need password!')
        await this.page.locator('input[name="password"]').fill(password)
        newTime = new Date()
        await this.page.locator('[data-testid="LoginForm_Login_Button"]').click()
        await this.page.waitForTimeout(5000)
      }
      // if (await this.page.locator('text=Check your email').isVisible()) {
      //   console.log('twitter need Device Verification Code!')
      //   const verificationCode = await getMailCode({ type: 1, time: newTime, to: username, oauth: 'twitter' })
      //   console.log('twitter verificationCode:', verificationCode)
      //   await this.page.locator('label:has-text("Confirmation code") input').fill(verificationCode)
      //   await this.page.locator('div[role="button"]:has-text("Next")').click()
      //   await this.page.waitForTimeout(5000)
      // }
    }
    try {
      if (await this.page.locator('[data-testid="OAuth_Consent_Button"]').isVisible()) {
      await this.page.locator('[data-testid="OAuth_Consent_Button"]').click()
    }
    } catch (err) {

    }
  }
}

module.exports = { OauthPage }