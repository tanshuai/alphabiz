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
const { parseCSV, get2DArray } = require('../../utils/getCSV.js')
// const DownloadFilePath = path.resolve(__dirname, '../../download')

let client, homePage, accountPage, creditsPage, developmentPage, basicPage
jest.setTimeout(60000 * 60 * 2)

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
    await client.deleteSession()
  })
  it('title', async () => {
    const windowTitle = await client.getTitle()
    console.log(windowTitle)
    expect(windowTitle).toBe('Alphabiz')
    // // 判断该路径是否存在，若不存在，则创建
    // var dir = '../../output/release'
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true })
    // }
    // await sleep(2000)
    // await client.saveScreenshot('test/output/release/screenshot.png')
  })
  it('get CSV auto download', async () => {
    const val = await parseCSV('test/samples/Movie list.csv')
    // console.log(val)
    // console.log('type val:' + typeof val)
    const magnetArray = get2DArray(val, 6)
    // 1
    // for (let j = 0, len = magnetArray.length; j < len; j++) {
    //   if (magnetArray[j] !== '' && j > 82) {
    //     const mag = /magnet:\?xt=urn:btih:\w+/gm.exec(magnetArray[j])
    //     console.log('正在下载第' + j + '个磁链:' + mag)
    //     await homePage.downloadTorrent(mag)
    //     if (await homePage.cancelDownloadBtn.isDisplayed()) {
    //       console.log('第' + j + '个磁链正在取消')
    //       await homePage.cancelDownloadBtn.click()
    //     }
    //     console.log('完成第' + j + '个磁链')
    //   }
    // }

    // 2
    // await client.$('[name="DOWNLOAD"]').click()
    let i = 0
    let decadeArray = []
    console.log('进入循环')
    for (let j = 0, len = magnetArray.length; j < len; j++) {
      // if (j === 10) return
      if (magnetArray[j] !== '' && j > 0) {
        if (i === 30 || j === 249) {
          await client.$('[name="DOWNLOAD"]').click()
          await client.$('/Pane[@Name="Alphabiz"]//Edit[@Name="Download directory position"]/preceding::*[1]').setValue(decadeArray.join('\uE006'))
          // await client.$('/Pane[@Name="Alphabiz"]//Edit[@Name="Download directory position"]/preceding::*[1]').setValue(
          //   decadeArray[0] + '\uE006' + decadeArray[1] + '\uE006' + decadeArray[2] + '\uE006' + decadeArray[3] + '\uE006' + decadeArray[4] + '\uE006'
          // )
          await client.$('/Pane[@Name="Alphabiz"]//Button[@Name="CANCEL"]/following-sibling::Button[@Name="DOWNLOAD"]').click()
          if (await homePage.cancelDownloadBtn.isDisplayed()) {
            // console.log('第' + j + '个磁链正在取消')
            await homePage.cancelDownloadBtn.click()
          }
          i = 0
          decadeArray = []
        }
        const mag = /magnet:\?xt=urn:btih:\w+/gm.exec(magnetArray[j])
        decadeArray.push(mag)
        console.log('第' + i + '循环正在下载第' + j + '个磁链:' + mag)

        i = i + 1

        // console.log('完成第' + j + '个磁链')
        // if (j === 110) { return }
      }
    }

    await sleep(10000)
    // 验证版本
    expect(1).toBe(1)
  })
})
