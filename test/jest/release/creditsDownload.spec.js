/* eslint-disable jest/no-disabled-tests */
const wdio = require('webdriverio')
const path = require('path')
const fs = require('fs')

const { sleep } = require('../../utils/getCode')
const { HomePage } = require('./Pages/HomePage')
const { AccountPage } = require('./Pages/AccountPage')
const { CreditsPage } = require('./Pages/CreditsPage')
const { DevelopmentPage } = require('./Pages/DevelopmentPage')
const obj = require('./TestEnvironment')

let client, homePage, accountPage, creditsPage, developmentPage
const torrentName = 'ChinaCup.1080p.H264.AAC.mp4'
jest.setTimeout(60000 * 10)

describe('download', () => {
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
  it.skip('delete task', async () => {
    let isDelete = false
    let isJump = true
    await homePage.jumpPage('downloadingStatusTab')
    if (await homePage.getTask(torrentName) !== null) {
      isDelete = true
      isJump = false
    }
    if (isJump && !isDelete) {
      await homePage.jumpPage('uploadingStatusTab')
      if (await homePage.getTask(torrentName) !== null) {
        isDelete = true
        isJump = false
      }
    }
    if (isJump && !isDelete) {
      await homePage.jumpPage('downloadedStatusTab')
      if (await homePage.getTask(torrentName) !== null) {
        isDelete = true
      }
    }
    if (isDelete) {
      console.log('delete')
      await homePage.deleteTask(torrentName)
    }
    expect(await homePage.getTask(torrentName)).toBe(null)
    // expect(1).toBe(1)
  })
  it('download seeding', async () => {
    const DownloadFilePath = path.resolve(__dirname, '../../download')

    // 判断是否已经登录
    await homePage.jumpPage('creditsLink')
    if (await client.$('//*[@Name="SIGN IN"]').isDisplayed()) {
      // 未登录
      await accountPage.signIn(process.env.TEST2_EMAIL, process.env.TEST_PASSWORD, 1)
    } else {
      // 已登陆,等待拉取数据
      // await client.$('//*[@Name="Settings"]').click()
      await accountPage.accountSettingsTitle.waitForDisplayed({ timeout: 10000 })
    }

    // 查看初始积分
    await homePage.jumpPage('creditsLink')
    const initialCredit = await creditsPage.checkCredits()
    console.log('initialCredit:' + initialCredit)

    // 判断是否已经下载
    // downloading栏  ->  任务下载中   ->  等待 peers出现（2min）  (upload测试还在等待积分增长)   若出现，付积分
    //                                        \->   (upload测试完成,积分已经增长过了)  未出现，结束测试
    // uploading栏  ->  任务未下载   ->  创建下载任务  -> 等待上传者peers -> 付积分  ->  查看积分变化  ->  结束测试
    //          \->  任务下载完成   ->  结束测试
    await homePage.jumpPage('downloadingStatusTab')
    if (await homePage.getTask(torrentName) !== null) {
      console.log('任务下载中')
      try {
        await homePage.waitTaskPeers(torrentName, 60000 * 2, 1)
        // 等待其他客户端上传bt种子
        const taskPeers = await homePage.getTaskPeers(torrentName, 10000)
        // 使用开发版本的付费积分功能
        await homePage.downloadPaymentProd(taskPeers, 0)

        // 查看积分减少变化
        await homePage.jumpPage('creditsLink')
        const changedCredit = await creditsPage.checkCredits()
        if (Number(initialCredit) + 1 <= Number(changedCredit)) console.log('success!')
      } catch (error) {
        // 未出现，结束测试
        console.log('tast end')
      }
    } else {
      await homePage.jumpPage('uploadingStatusTab')
      if (await homePage.getTask(torrentName) === null) {
        console.log('任务未下载')
        // 下载bt种子
        await homePage.jumpPage('downloadingStatusTab')
        await homePage.downloadTorrent('alphabiz://ChinaCup.1080p.H264.AAC.mp4/AZLwy9+LB7G1y0HGGJis+f4UZlze&MDAyNzAwMjgwMDI5MDAyYTAwMmIwMDJjMDAyZCZ0cj0=', DownloadFilePath)
        await homePage.waitSeedFound(torrentName, 60000 * 10)
        // 查看种子任务卡片状态
        console.log('check task status')
        const taskTitle = await homePage.getTask(torrentName)
        taskTitle.click()

        // 等待其他客户端上传bt种子
        const taskPeers = await homePage.getTaskPeers(torrentName, 60000 * 5)

        // 使用开发版本的付费积分功能
        await homePage.downloadPaymentProd(taskPeers, 0)

        // 查看积分减少变化
        await homePage.jumpPage('creditsLink')
        const changedCredit = await creditsPage.checkCredits()
        if (Number(initialCredit) + 2 <= Number(changedCredit)) console.log('success!')
      }
    }
    // // 等待种子下载完成
    await homePage.jumpPage('uploadingStatusTab')
    await client.$('//Text[@Name="' + torrentName + '"]').waitForDisplayed({ timeout: 60000 * 4 })
    const taskStatus = await homePage.getTaskStatus(torrentName)
    await sleep(10000)
    expect(taskStatus).toBe('Status: Seeding')
  })
})
