/* eslint-disable jest/no-disabled-tests */
const wdio = require('webdriverio')
const path = require('path')
const fs = require('fs')

const { HomePage } = require('./Pages/HomePage')
const { AccountPage } = require('./Pages/AccountPage')
const { CreditsPage } = require('./Pages/CreditsPage')
const { DevelopmentPage } = require('./Pages/DevelopmentPage')
const obj = require('./TestEnvironment')
const { sleep } = require('../../utils/getCode')
const { calculation } = require('../../utils/calculation')
const appConfig = require('../../../developer/app')

let client, homePage, accountPage, creditsPage, developmentPage
const uploadUser = (appConfig.name === 'Alphabiz' ? 'down2' : 'down4') +  process.env.TEST_EMAIL_DOMAIN
const outputFile = process.env.APP_TYPE === 'exe' ? '/exe' : process.env.APP_TYPE === 'msi' ? '/msi' : '/7z'
const outputPath = path.resolve(__dirname, '../../output/release' + outputFile)
let isSuccess = false

jest.setTimeout(60000 * 30)
describe('upload', () => {
  beforeAll(async () => {
    client = await wdio.remote(obj.opts)
    homePage = new HomePage(client)
    accountPage = new AccountPage(client)
    creditsPage = new CreditsPage(client)
    developmentPage = new DevelopmentPage(client)
  }, 120000)
  afterAll(async () => {
    client && await client.deleteSession()
  })
  beforeEach(async () => {
    isSuccess = false
  })
  afterEach(async () => {
    // console.log('isSuccess', expect.getState().currentTestName, isSuccess)
    if (!isSuccess) {
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true })
      }
      client && await client.saveScreenshot(outputPath + `/${expect.getState().currentTestName}.png`)
    }
  })
  it.skip('test1', async () => {
    expect(1).toBe(1)
  })
  it.skip('upload seeding', async () => {
    const uploadFilePath = path.resolve(__dirname, '../../cypress/fixtures/samples/GoneNutty.avi')
    const torrentName = 'GoneNutty.avi'
    // const torrentName = 'ChinaCup.1080p.H264.AAC.mp4'
    // 判断是否已经登录
    await sleep(10000)
    console.log('ready to login')
    await accountPage.ensureSignIn(uploadUser, process.env.TEST_PASSWORD, { isWaitAlert: true })
    console.log('login')
    // 查看初始积分
    console.log('准备跳转到积分页')
    await homePage.jumpPage('creditsLink')
    console.log('成功跳转')
    const initialCredit = await creditsPage.checkCredits()
    console.log('initialCredit:' + initialCredit)
    // 判断是否已经上传
    console.log('准备跳转到--上传中')
    await homePage.jumpPage('uploadingStatusTab')
    console.log('成功跳转')
    await sleep(3000)
    await homePage.setCardMode()
    console.log('设置卡片模式')
    if (await homePage.getTask(torrentName) === null) {
      console.log('准备跳转到--已下载')
      await homePage.jumpPage('downloadedStatusTab')
      console.log('成功跳转')
      // 上传bt种子
      if (await homePage.getTask(torrentName) === null) {
        await homePage.jumpPage('uploadingStatusTab')
        await homePage.uploadTorrent(uploadFilePath)
      } else {
        await client.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="SEED"]').click()
      }
    }

    const taskStatus = await homePage.getTaskStatus(torrentName)
    expect(taskStatus).toBe('Status: Uploading')
    console.log('准备跳转到--积分页')
    await homePage.jumpPage('creditsLink')
    console.log('成功跳转')
    let changedCredit
    while (1) {
      changedCredit = await creditsPage.checkCredits()
      if (calculation('reduce', changedCredit, initialCredit) >= 0.001) break
      await sleep(5000)
    }
    console.log('credits increase:' + changedCredit)
    await sleep(10000)
    console.log('wait download complete')
    isSuccess = true
  })
  it('test', async () => {
    await sleep(10000)
    console.log('ensure Log In')
    await accountPage.ensureSignIn(uploadUser, process.env.TEST_PASSWORD, { isWaitAlert: true })
    console.log('Login')
    console.log('ready sign out')
    await accountPage.signOut()
    console.log('sign out')
  })
})
