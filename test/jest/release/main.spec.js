/* eslint-disable no-undef */

const wdio = require('webdriverio')
const path = require('path')
const fs = require('fs')

const { HomePage } = require('./Pages/HomePage')
const { AccountPage } = require('./Pages/AccountPage')
const { CreditsPage } = require('./Pages/CreditsPage')
const { DevelopmentPage } = require('./Pages/DevelopmentPage')
const { BasicPage } = require('./Pages/BasicPage')
const obj = require('./TestEnvironment')
const { sleep } = require('../../utils/getCode')

const outputFile = process.env.APP_TYPE === 'exe' ? '/exe' : process.env.APP_TYPE === 'msi' ? '/msi' : '/7z'
const outputPath = path.resolve(__dirname, '../../output/release' + outputFile)

let client, homePage, accountPage, creditsPage, developmentPage, basicPage
jest.setTimeout(60000 * 15)
let isSuccess = false
describe('main', () => {
  beforeAll(async () => {
    client = await wdio.remote(obj.opts)
    homePage = new HomePage(client)
    accountPage = new AccountPage(client)
    creditsPage = new CreditsPage(client)
    developmentPage = new DevelopmentPage(client)
    basicPage = new BasicPage(client)
  }, 120000)
  afterAll(async () => {
    await client.deleteSession()
  })
  beforeEach(async () => {
    isSuccess = false
  })
  afterEach(async () => {
    console.log('isSuccess', expect.getState().currentTestName, isSuccess)
    if (!isSuccess) {
      client && await client.saveScreenshot(outputPath + `/${expect.getState().currentTestName}.png`)
      process.exit(1)
    }
  })
  it('title', async () => {
    const windowTitle = await client.getTitle()
    console.log(windowTitle)
    expect(windowTitle).toBe('Alphabiz')
    // const appTitle = await homePage.getAppTitle()
    // expect(appTitle).toBe('Alphabiz')
    console.log('outputPath:' + outputPath)
    // 判断该路径是否存在，若不存在，则创建

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
    }
    await sleep(2000)
    await client.saveScreenshot(outputPath + '/homePage.png')
    isSuccess = true
  })
  it('ensure sign in', async () => {
    // 判断是否已经登录
    await sleep(10000)
    await accountPage.ensureSignIn(process.env.TEST1_EMAIL, process.env.TEST_PASSWORD, { isWaitAlert: true })
    isSuccess = true
  })
  it('version number', async () => {
    const version = await homePage.getAppVersion()
    // 验证版本格式
    expect(version).toMatch(/^v\d+\.\d+\.\d+/)
    isSuccess = true
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
    isSuccess = true
  })
  it('Switch to Simplified Chinese', async () => {
    // 收起媒体库
    await homePage.jumpPage('libraryLink')
    await homePage.jumpPage('basicLink')
    expect(await homePage.getPageTitle()).toBe('Basic')
    await basicPage.switchLanguages('english', 'simplifiedChinese')
    await client.saveScreenshot(outputPath + '/basic-language-simplifiedChinese.png')
    expect(await homePage.getPageTitle()).toBe('基础设置')
    await basicPage.switchLanguages('simplifiedChinese', 'english')
    await client.saveScreenshot(outputPath + '/basic-language-english.png')
    expect(await homePage.getPageTitle()).toBe('Basic')
    isSuccess = true
  })
})
