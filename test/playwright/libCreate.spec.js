const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const electronMainPath = require('../../test.config.js').electronMainPath
const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { LibraryPage } = require('./models/libraryPage')
const { parseCSV, get2DArray } = require('../utils/getCSV')
const { randomNum } = require('../utils/calculation')
const app = require('../../developer/app.js')
let window, windows, electronApp, basePage, homePage, libraryPage
const ScreenshotsPath = 'test/output/playwright/libraryCreate.spec/'

const channelObj = require('./mostPeer_list/mostPeer10_ChannelList.json')

test.beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: [
      '--inspect=5858',
      electronMainPath
    ]
  })
  // Evaluation expression in the Electron context.
  await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath()
  })
  // Get the first window that the app opens, wait if necessary.
  window = await electronApp.firstWindow()

  await window.waitForTimeout(6000)
  // should main window
  windows = electronApp.windows()

  for (const win of windows) {
    console.log(await win.title())
    if (await win.title() === 'Alphabiz') window = win
  }
  // new Pege Object Model
  basePage = new BasePage(window)
  homePage = new HomePage(window)
  libraryPage = new LibraryPage(window)
  basePage.checkForPopup()
})
test.beforeEach(async () => {
})
test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    // await window.waitForTimeout(10000)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test('close set default', async () => {
  try {
    await basePage.defaultAppAlert.waitFor({ timeout: 3000 })
    await basePage.noShowAgainBtn.click()
    console.log('dont show again')
  } catch (error) {
    console.log('no wait for btn[dont show again]')
  }
})

test('add channel', async () => {
  test.setTimeout(60000 * 3)
  await window.waitForLoadState()
  await basePage.jumpPage('editLink')
  try {
    await libraryPage.addChannelBtn.waitFor({ timeout: 5000 })
  } catch (e) {
    await basePage.jumpPage('editLink')
  }
  await window.waitForTimeout(3000)
  for (i = 0; i < channelObj.length; i++) {
    const isAddChannel = await libraryPage.getChannelCardEle(channelObj[i].title, 'card').isVisible()
    console.log(`第${i}个频道${channelObj[i].title} isAddChannel, ${isAddChannel}`)
    if (!isAddChannel) await libraryPage.addChannel(channelObj[i])
    await libraryPage.ensureChannelCard(channelObj[i].title, 'visible')
    await window.waitForTimeout(3000)
  }
})
test('add post', async () => {
  await basePage.jumpPage('editLink')
  // 1. csv文件路径
  const channelIDlist = await parseCSV(`test/playwright/mostPeer_list/mostPeer10_list.csv`)
  for (i = 0; i < channelObj.length; i++) {
    // 2.读取每个频道的csv文件,一个csv分多个频道
    channelObj[i].val = channelIDlist.slice(i ? i * 25 : i * 25 + 1, i === 8 ? i * 25 + 9 : i * 25 + 25)
    // 3.初始化添加的数量
    channelObj[i].postNum = 0
  }
  const getPostObj = (val) => {
    const postObj = {}
    postObj.title = val[2]
    postObj.desc = val[4]
    postObj.poster = val[5]
    postObj.poster2 = val[6]
    postObj.url = val[3]
    postObj.rate = val[7]
    postObj.subtitleList = JSON.parse(val[8])
    // console.log('postObj', postObj)
    return postObj
  }
  // 频道轮流添加
  while(1){
    let isAdd
    for (j = 0; j < channelObj.length; j++) {
      if (channelObj[j].postNum < channelObj[0].val.length) {
        isAdd = true
        break
      }
    }
    if (!isAdd) break
    // 遍历频道
    for (j = 0; j < channelObj.length; j++) {
      if (channelObj[j].postNum >= channelObj[j].val.length) continue
      // 4. 生成随机数 每个频道添加个数
      const randomNumber = randomNum(10, 10)
      let needAddNum = 0
      await libraryPage.getChannelCardEle(channelObj[j].title, 'editChannelBtn').click()
      await window.waitForTimeout(10000)
      for (i = channelObj[j].postNum; i < channelObj[j].postNum + randomNumber; i++) {
        let isSkipChannel = typeof channelObj[j].val[i] === 'undefined' || channelObj[j].val[i][2] === '' || channelObj[j].val[i][3] === '' || channelObj[j].val[i][4] === ''
        // if (j < 7 && channelObj[j].postNum < 185) isSkipChannel = true
        // if (j === 9 && i === 169) isSkipChannel = true
        if (!isSkipChannel) {
          const postObj = getPostObj(channelObj[j].val[i])
          let isAddPost = false
          const postNum = await libraryPage.getPostListEle('', 'titleEle').count()
          for (let k = 0; k < channelObj[j].postNum; k++) {
            if (postNum === 0) break
            const postTitle = await libraryPage.getPostListEle('', 'titleEle').nth(k).innerText()
            if (postTitle === postObj.title) isAddPost = true
          }
          // const postDescText = await libraryPage.getPostListEle(postObj.title, 'descEle').innerText()
          // const isAddPost = postDescText.includes(postObj.desc.slice(0, 10))
          console.log(`第${j}个频道${channelObj[j].title}第${i}个电影 ${postObj.title} ${isAddPost}`)
          if (!isAddPost) {
            await libraryPage.addPost(postObj)
            await window.waitForTimeout(3000)
            await libraryPage.getPostListEle(postObj.title, 'titleEle').waitFor()
            await window.waitForTimeout(1000)
            await libraryPage.ensurePostList(postObj)
          }
        }
        needAddNum = needAddNum + 1
      }
      await window.waitForTimeout(2000)
      await libraryPage.ecCloseBtn.click()
      channelObj[j].postNum = channelObj[j].postNum + needAddNum
      console.log(`第${j}个频道${channelObj[j].title}添加后 ${channelObj[j].postNum}`)
    }
  }
  await window.waitForTimeout(10000)
})