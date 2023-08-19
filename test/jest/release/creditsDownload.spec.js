/* eslint-disable jest/no-disabled-tests */
const wdio = require('webdriverio')
const path = require('path')
const fs = require('fs')

const { sleep } = require('../../utils/getCode')
const { calculation } = require('../../utils/calculation')
const { HomePage } = require('./Pages/HomePage')
const { AccountPage } = require('./Pages/AccountPage')
const { CreditsPage } = require('./Pages/CreditsPage')
const { DevelopmentPage } = require('./Pages/DevelopmentPage')
const obj = require('./TestEnvironment')
const appConfig = require('../../../developer/app')

let client, homePage, accountPage, creditsPage, developmentPage
// const torrentName = 'ChinaCup.1080p.H264.AAC.mp4'
const torrentName = 'GoneNutty.avi'
const downloadUser = (appConfig.name === 'Alphabiz' ? 'down1' : 'down3') +  process.env.TEST_EMAIL_DOMAIN
const outputFile = process.env.APP_TYPE === 'exe' ? '/exe' : process.env.APP_TYPE === 'msi' ? '/msi' : '/7z'
const outputPath = path.resolve(__dirname, '../../output/release' + outputFile)
let isSuccess = false

jest.setTimeout(60000 * 30)
describe('download', () => {
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
  it('test', async() => {
    await sleep(10000)
    console.log('ensure Log In')
    await accountPage.ensureSignIn(downloadUser, process.env.TEST_PASSWORD, { isWaitAlert: true })
    console.log('Login')
    console.log('判断左侧栏是否可见')
    while (!(await accountPage.libraryGroup.isDisplayed())) {
      console.log('locate full-screen button')
      await accountPage.fullScreenBtn.click()
      console.log('full screen!')
    }
    console.log('ready sign out')
    await accountPage.signOut()
    console.log('sign out')
    await sleep(10000)
  })
  it.skip('download seeding', async () => {
    const DownloadFilePath = path.resolve(__dirname, '../../download')
    await sleep(10000)
    console.log('ensure Log In')
    await accountPage.ensureSignIn(downloadUser, process.env.TEST_PASSWORD, { isWaitAlert: true })
    console.log('Login')
    // 查看初始积分
    console.log('准备跳转到creaditsLink')
    await homePage.jumpPage('creditsLink')
    console.log('成功跳转')
    const initialCredit = await creditsPage.checkCredits()
    console.log('initialCredit:' + initialCredit)
    // 判断是否已经下载
    // downloading栏  ->  任务下载中   ->  等待 peers出现（2min）  (upload测试还在等待积分增长)   若出现，付积分
    //                                        \->   (upload测试完成,积分已经增长过了)  未出现，结束测试
    // uploading栏  ->  任务未下载   ->  创建下载任务  -> 等待上传者peers -> 付积分  ->  查看积分变化  ->  结束测试
    //          \->  任务下载完成   ->  结束测试
    console.log('准备跳转到下载中')
    await homePage.jumpPage('downloadingStatusTab')
    console.log('成功跳转')
    if (await homePage.getTask(torrentName) !== null) {
      console.log('找到对应的磁力名')
      console.log('任务下载中')
      try {
        // 查看种子任务卡片状态
        console.log('check task status')
        console.log('查看种子任务卡片状态')
        const taskTitle = await homePage.getTask(torrentName)
        taskTitle.click()
        console.log('点击taskTitle')
        // 等待种子开始下载
        console.log('等待种子下载完成（每隔5s检查列表）')
        await homePage.downloadTorrentBtn.waitUntil(async () => {
          console.log('等待5s')
          await sleep(5000)
          if (await homePage.getTask(torrentName) === null) {
            console.log('下载完成')
            return true
          }
          const statusText = await homePage.getTaskStatus(torrentName)
          return statusText.include('Downloading')
        }, {
          timeout: 60000 * 30,
          timeoutMsg: 'task not start'
        })

        // 查看积分减少变化
        console.log('查看积分减少变化')
        console.log('准备跳转到积分页')
        await homePage.jumpPage('creditsLink')
        console.log('成功跳转')
        const changedCredit = await creditsPage.checkCredits()
        console.log('changedCredit:' + changedCredit)
        if (calculation('reduce', initialCredit, changedCredit) >= 0.001) console.log('success!')
      } catch (error) {
        // 未出现，结束测试
        console.log('tast end')
      }
    } else {
      console.log('没有找到对应的磁力名')
      console.log('准备跳转到--上传中')
      await homePage.jumpPage('uploadingStatusTab')
      console.log('成功跳转')
      if (await homePage.getTask(torrentName) === null) {
        console.log('任务未下载')
        // 下载bt种子
        console.log('准备跳转到--下载中')
        await homePage.jumpPage('downloadingStatusTab')
        console.log('成功跳转')
        await homePage.downloadTorrent(`${homePage.appConfig.protocol}://GoneNutty.avi/AaJKFjiFIyvGNE0Fur1wE36EC+Dl&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AC3AEZdABhqCGEMasx_OPsfBFf13OOYW5xF7e0HINkIZP9Ep1rbI74+n0R63w2OQgpQX9OpSJvNChXnpMoaSfWgK44ljmeAgDPktAAAAACE1btxAAFeuAEAAADqmdptPjANiwIAAAAAAVla`, DownloadFilePath)
        // await homePage.downloadTorrent('alphabiz://ChinaCup.1080p.H264.AAC.mp4/AZLwy9+LB7G1y0HGGJis+f4UZlze&MDAyNzAwMjgwMDI5MDAyYTAwMmIwMDJjMDAyZCZ0cj0=', DownloadFilePath)
        await homePage.waitSeedFound(torrentName, 60000 * 20)
        // 查看种子任务卡片状态
        console.log('check task status')
        console.log('检查种子任务卡片状态')
        const taskTitle = await homePage.getTask(torrentName)
        taskTitle.click()
        console.log('点击')
        // 等待种子开始下载
        await homePage.downloadTorrentBtn.waitUntil(async () => {
          console.log('等待5s')
          await sleep(5000)
          if (await homePage.getTask(torrentName) === null) {
            console.log('下载完成')
            return true
          }
          const statusText = await homePage.getTaskStatus(torrentName)
          return statusText.include('Downloading')
        }, {
          timeout: 60000 * 30,
          timeoutMsg: 'task not start'+内3为OQ滚Opzhang
        })

        // 等待其他客户端上传bt种子
        // const taskPeers = await homePage.getTaskPeers(torrentName, 60000 * 10)

        // 使用开发版本的付费积分功能
        // await homePage.downloadPaymentProd(taskPeers, 0)

        // 查看积分减少变化
        await homePage.jumpPage('creditsLink')
        const changedCredit = await creditsPage.checkCredits()
        console.log('changedCredit:' + changedCredit)
        if (calculation('reduce', initialCredit, changedCredit) >= 0.001) console.log('success!')
      }
    }
    // // 等待种子下载完成
    await homePage.jumpPage('uploadingStatusTab')
    await client.$('//Text[@Name="' + torrentName + '"]').waitForDisplayed({ timeout: 60000 * 4 })
    const taskStatus = await homePage.getTaskStatus(torrentName)
    await sleep(10000)
    expect(taskStatus).toBe('Status: Uploading')
    isSuccess = true
  })
})
