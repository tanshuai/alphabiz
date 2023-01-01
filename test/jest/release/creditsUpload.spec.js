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

let client, homePage, accountPage, creditsPage, developmentPage
jest.setTimeout(60000 * 10)

describe('upload', () => {
  beforeEach(async () => {
    client = await wdio.remote(obj.opts)
    homePage = new HomePage(client)
    accountPage = new AccountPage(client)
    creditsPage = new CreditsPage(client)
    developmentPage = new DevelopmentPage(client)
  }, 60000)
  afterEach(async () => {
    await client.deleteSession()
  })
  it.skip('test1', async () => {
    expect(1).toBe(1)
  })
  it('upload seeding', async () => {
    const uploadFilePath = path.resolve(__dirname, '../../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4')
    const torrentName = 'ChinaCup.1080p.H264.AAC.mp4'
    // 判断是否已经登录
    // await homePage.jumpPage('creditsLink')
    // if (await client.$('//*[@Name="SIGN IN"]').isDisplayed()) {
    //   // 未登录
    //   await accountPage.signIn(process.env.TEST3_EMAIL, process.env.TEST_PASSWORD, 1)
    // } else {
    //   // 已登陆,等待拉取数据
    //   // await client.$('//*[@Name="Settings"]').click()
    //   if (!await homePage.settingsLink.isDisplayed()) {
    //     await homePage.menuBtn.click()
    //   }
    //   await accountPage.accountSettingsTitle.waitForDisplayed({ timeout: 10000 })
    // }

    // // 查看初始积分
    // await homePage.jumpPage('creditsLink')
    // const initialCredit = await creditsPage.checkCredits()
    // console.log('initialCredit:' + initialCredit)
    // 判断是否已经上传
    await homePage.jumpPage('uploadingStatusTab')
    if (await homePage.getTask(torrentName) === null) {
      await homePage.jumpPage('downloadedStatusTab')
      // 上传bt种子
      if (await homePage.getTask(torrentName) === null) {
        await homePage.jumpPage('uploadingStatusTab')
        await homePage.uploadTorrent(uploadFilePath)
      } else {
        await client.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="SEED"]').click()
      }
    }

    // 查看种子任务卡片状态
    // await homePage.jumpPage('uploadingStatusTab')
    const taskStatus = await homePage.getTaskStatus(torrentName)
    expect(taskStatus).toBe('Status: Seeding')

    // 等待种子上传(其他用户下载种子)
    // await homePage.waitSeedUpload(torrentName)

    // const taskPeers = await homePage.getTaskPeers(torrentName, 60000 * 10)
    // taskPeers.click()
    // 等待积分增加变化
    // await client.$('//Text[@Name="Uploading"]').click()
    await homePage.jumpPage('creditsLink')
    let changedCredit
    while (1) {
      changedCredit = await creditsPage.checkCredits()
      if (calculation('reduce', changedCredit, initialCredit) >= 0.001) break
      await sleep(5000)
    }
    console.log('credits increase')
    // 等待下载者完成下载
    // console.log('waitTaskPeersHidden')
    // await homePage.jumpPage('uploadingStatusTab')
    // // waitTaskPeershidden
    // await homePage.waitTaskPeers(torrentName, 60000 * 5, 0)
    await sleep(10000)
    console.log('wait download complete')
    // expect(1).toBe(1)
  })
})
