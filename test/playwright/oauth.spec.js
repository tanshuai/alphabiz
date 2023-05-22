const { test, expect } = require('@playwright/test')
const { chromium } = require('playwright')
const { BasePage } = require('./models/basePage')
const { OauthPage } = require('./models/oauthPage')

let basePage, oauthPage
let username, username2,githubUsername, twitterUsername
const oauthAccountPassword = process.env.OAUTH_ACCOUNT_PASSWORD
const password = process.env.TEST_PASSWORD
if (process.platform === 'win32') {
  username = 'test1'
  username2 = 'test2'
  githubUsername = process.env.TEST1_EMAIL
  twitterUsername = 'AlphabizT57517'
} else if (process.platform === 'linux') {
  username = 'test3'
  username2 = 'test4'
  githubUsername = 'test4'
} else {
  username = 'test5'
  username2 = 'test6'
  githubUsername = 'test5'
}
username = username + process.env.TEST_EMAIL_DOMAIN
username2 = username2 + process.env.TEST_EMAIL_DOMAIN
if (!githubUsername.includes('@')) githubUsername = githubUsername + process.env.TEST_EMAIL_DOMAIN

let browser, context, page
test.beforeAll(async () => {
  browser = await chromium.launch({
    headless: false,
  })

  context = await browser.newContext();
  await context.addCookies([{name:"TestEnv", value: 'true', url: "https://web.alpha.biz"}])
  page = await context.newPage()

  // page = await browser.newPage()

  // new Pege Object Model
  basePage = new BasePage(page)
  oauthPage = new OauthPage(page)
})

// test.afterEach(async ({}, testInfo) => {
//   if (testInfo.status !== testInfo.expectedStatus) {
//     process.exit(1)
//   }
// })

test.describe('github', () => {
  test.beforeEach(async ({ }, testInfo) => {
    test.setTimeout(60000 * 5)
  })
  test('Ensure disconnected', async () => {
    await page.goto(`https://web.alpha.biz`, { timeout: 40000, waitUntil: 'domcontentloaded' })
    await basePage.signIn(username, password)
    await basePage.jumpPage('accountSettingLink')
    await page.waitForTimeout(5000)
    const githubStatus = await oauthPage.githubStatusBtn.innerText()
    if (githubStatus !== 'add') {
      await oauthPage.githubStatusBtn.click()
      await basePage.checkAlert('Github disconnected', /Github disconnected/)
    }
  })

  test('Github connected', async () => {
    await oauthPage.githubStatusBtn.click()
    await oauthPage.signInGithub(githubUsername, oauthAccountPassword)
    await page.waitForURL('https://web.alpha.biz/**')
    await page.locator('text=Connect to Github').waitFor()
    await basePage.checkAlert('Github connected', /Github connected/)
    await basePage.signOut()
  })

  test('Repeated connection', async () => {
    await basePage.signIn(username2, password)
    await basePage.jumpPage('accountSettingLink')
    await page.waitForTimeout(5000)
    await oauthPage.githubStatusBtn.click()
    await oauthPage.signInGithub(githubUsername, oauthAccountPassword)
    await basePage.checkAlert('Repeated connection', /The Github account has been connected/)
    await basePage.signOut()
  })

  test.only('Login - connected', async () => {
    await page.goto(`https://web.alpha.biz`, { timeout: 40000, waitUntil: 'domcontentloaded' })
    await oauthPage.signInWithGithubBtn.click()
    await oauthPage.signInGithub(githubUsername, oauthAccountPassword)
    await page.waitForURL('https://web.alpha.biz/**')
    await basePage.checkAlert('Login - connected', /Signed in/)
    await page.locator('.q-card:has-text("Create or import library key") button:has-text("OK")').click()
    // await page.locator('.post-card').nth(0).waitFor({ timeout: 30000 })
    await basePage.waitForAllHidden(await basePage.alert)

    await basePage.signOut()
  })

  test('Github disconnected', async () => {
    await basePage.jumpPage('accountSettingLink')
    await page.waitForTimeout(5000)
    const githubStatus = await oauthPage.githubStatusBtn.innerText()
    if (githubStatus !== 'add') {
      await oauthPage.githubStatusBtn.click()
      await basePage.checkAlert('Github disconnected', /Github disconnected/)
    }
    await basePage.signOut()
  })

  test('Login - disconnected', async () => {
    await page.goto(`https://web.alpha.biz`, { timeout: 40000, waitUntil: 'domcontentloaded' })
    await oauthPage.signInWithGithubBtn.click()
    await oauthPage.signInGithub(githubUsername, oauthAccountPassword)
    await page.waitForURL('https://web.alpha.biz/**')
    await basePage.checkAlert('Login - unconnected', /Can not log in to an unconnected Github account/)
  })
})

test.describe('twitter', () => {
  test.beforeEach(async ({ }, testInfo) => {
    test.setTimeout(60000 * 5)
  })
  test('Ensure disconnected', async () => {
    await page.goto(`https://web.alpha.biz`, { timeout: 40000, waitUntil: 'domcontentloaded' })
    await basePage.signIn(username, password)
    await basePage.jumpPage('accountSettingLink')
    await page.waitForTimeout(5000)
    const twitterStatus = await oauthPage.twitterStatusBtn.innerText()
    if (twitterStatus !== 'add') {
      await oauthPage.twitterStatusBtn.click()
      await basePage.checkAlert('Twitter disconnected', /Twitter disconnected/)
    }
  })

  test('Twitter connected', async () => {
    await oauthPage.twitterStatusBtn.click()
    await oauthPage.signInTwitter(username, oauthAccountPassword, twitterUsername)
    await page.waitForURL('https://web.alpha.biz/**')
    await page.locator('text=Connect to Twitter').waitFor()
    await basePage.checkAlert('Twitter connected', /Twitter connected/)
    await basePage.signOut()
  })

  test('Repeated connection', async () => {
    await basePage.signIn(username2, password)
    await basePage.jumpPage('accountSettingLink')
    await page.waitForTimeout(5000)
    await oauthPage.twitterStatusBtn.click()
    await oauthPage.signInTwitter(username, oauthAccountPassword, twitterUsername)
    await basePage.checkAlert('Repeated connection', /The Twitter account has been connected/)
    await basePage.signOut()
  })

  test.only('Login - connected', async () => {
    await page.goto(`https://web.alpha.biz`, { timeout: 40000, waitUntil: 'domcontentloaded' })
    await oauthPage.signInWithTwitterBtn.click()
    await oauthPage.signInTwitter(username, oauthAccountPassword, twitterUsername)
    await page.waitForURL('https://web.alpha.biz/**')
    await basePage.checkAlert('Login - connected', /Signed in/)
    await page.locator('.q-card:has-text("Create or import library key") button:has-text("OK")').click()
    // await page.locator('.post-card').nth(0).waitFor({ timeout: 30000 })
    await basePage.waitForAllHidden(await basePage.alert)

    await basePage.signOut()
  })

  test('Twitter disconnected', async () => {
    await basePage.jumpPage('accountSettingLink')
    await page.waitForTimeout(5000)
    const twitterStatus = await oauthPage.twitterStatusBtn.innerText()
    if (twitterStatus !== 'add') {
      await oauthPage.twitterStatusBtn.click()
      await basePage.checkAlert('Twitter disconnected', /Twitter disconnected/)
    }
    await basePage.signOut()
  })

  test('Login - disconnected', async () => {
    await page.goto(`https://web.alpha.biz`, { timeout: 40000, waitUntil: 'domcontentloaded' })
    await oauthPage.signInWithTwitterBtn.click()
    await oauthPage.signInTwitter(username, oauthAccountPassword, twitterUsername)
    await page.waitForURL('https://web.alpha.biz/**')
    await basePage.checkAlert('Login - unconnected', /Can not log in to an unconnected Twitter account/)
  })
})