/* eslint-disable no-undef */
// /* eslint-disable no-undef */
// /* eslint-disable jest/no-focused-tests */
/* eslint-disable jest/no-disabled-tests */
const wdio = require('webdriverio')
const path = require('path')
const fs = require('fs')

import appPackage from '../../../package.json'
const { HomePage } = require('./Pages/HomePage')
const { AccountPage } = require('./Pages/AccountPage')
const { CreditsPage } = require('./Pages/CreditsPage')
const { DevelopmentPage } = require('./Pages/DevelopmentPage')
const { BasicPage } = require('./Pages/BasicPage')
const obj = require('./TestEnvironment')
const { sleep } = require('../../utils/getCode')

let client, homePage, accountPage, creditsPage, developmentPage, basicPage
jest.setTimeout(60000 * 15)

describe('upload', () => {
  beforeAll(async () => {
    client = await wdio.remote(obj.opts)
    homePage = new HomePage(client)
    accountPage = new AccountPage(client)
    creditsPage = new CreditsPage(client)
    developmentPage = new DevelopmentPage(client)
    basicPage = new BasicPage(client)
  }, 60000)
  afterAll(async () => {
    // var dir = '../../output/release'
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true })
    // }
    // await sleep(2000)
    // await client.saveScreenshot('test/output/release/screenshot.png')
    await client.deleteSession()
  })
  it('title', async () => {
    const windowTitle = await client.getTitle()
    console.log(windowTitle)
    expect(windowTitle).toBe('Alphabiz')
    // const appTitle = await homePage.getAppTitle()
    // expect(appTitle).toBe('Alphabiz')
    // 判断该路径是否存在，若不存在，则创建
    var dir = '../../output/release'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    await sleep(2000)
    await client.saveScreenshot('test/output/release/screenshot.png')
  })
  it('version number', async () => {
    const version = await homePage.getAppVersion()
    // 验证版本格式
    expect(version).toMatch(/^v\d+\.\d+\.\d+/)
  })
  it('check page title', async () => {
    if (await homePage.getPageTitle() !== 'Downloading') {
      await homePage.jumpPage('downloadingStatusTab')
      expect(await homePage.getPageTitle()).toBe('Downloading')
    }
    await homePage.jumpPage('uploadingStatusTab')
    expect(await homePage.getPageTitle()).toBe('Uploading')
    await homePage.jumpPage('downloadedStatusTab')
    expect(await homePage.getPageTitle()).toBe('Downloaded')
    await homePage.jumpPage('settingsLink', 'accountLink')
    expect(await homePage.getPageTitle()).toBe('Advanced')
  })
  it('Switch to Simplified Chinese', async () => {
    await homePage.jumpPage('settingsLink', 'basicLink')
    await basicPage.switchLanguages('english', 'simplifiedChinese')
    await client.saveScreenshot('test/output/release/basic-language-simplifiedChinese.png')
    expect(await homePage.getPageTitle()).toBe('基础设置')
  })
})
