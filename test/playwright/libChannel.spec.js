const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const electronMainPath = require('../../test.config.js').electronMainPath
const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { LibraryPage } = require('./models/libraryPage')
const { PlayerPage } = require('./models/playerPage')
const { BasicPage } = require('./models/basicPage')
const { AccountPage } = require('./models/accountPage')
const app = require('../../developer/app.js')
let window, windows, electronApp, basePage, homePage, libraryPage, playerPage, basicPage, accountPage
const ScreenshotsPath = 'test/output/playwright/library.spec/'
let name, checkName
if (process.platform === 'win32') {
  name = 'test7'
} else if (process.platform === 'linux') {
  name = 'test8'
} else {
  name = 'test9'
}
name = name + process.env.TEST_EMAIL_DOMAIN

const testChannel = {
  title: 'Free Guy',
  desc: '失控玩家 Free Guy(2021)',
  isPrivate: true,
  channelID: '5y2mk4yx2jmoylzlbkrf'
}
const privateChannel = {
  title: 'X特遣队',
  desc: 'X特遣队：全员集结 The Suicide Squad',
  isPrivate: true,
  channelID: 'vvkakh29yfu1hyjfhngw'
}
const channelObj = {
  title: 'first channel by ',
  desc: '',
  isPrivate: false
}
const postObj = {
  title: 'first post by ',
  desc: '1231231232',
  poster: '',
  url: `${app.protocol}://uTorrent+Web+Tutorial+Video/AWGzuIVsSDnt9R9cI0ZZm2vsUkFF&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4ALxATpdABhqCGEMasx_OPsfBFf6STjs7yEovJdH6ObIkXuPJdVFCvNYt4Pc61Bo+mbFMnz74ydATVDkJaObcR0qhiqPrZctZJ7wrQIGnWNpA6Pm9VngzwAxCow6VTNOPsR2ZmQLh6a5lzjcxHj1tP6k7AKbVFqNWDAAB9Xsbku1S+9MyAXPjwUFk9QUFefp0ZcCzVc6_dcNPvyL7tq+N9QPMqfMbSeL0TjRSROCeeZm2zRslPQyYmPX+Gm2uX3jvkBqCiSiWX4vUwGX+j43FHftXg3ettQe4CKgpHNwlgE4mZrw0z5HUmLSXJKrWC7cC4TelK71c2nNMoDc+24nO3RyGNImyf3YhnKLCsiwAbhxGYqg+HTezO_5iIDbQLEKX+GNoYmCIvkBSei+bODtpO0lgJ3Lqw_SToWjaMQsvM8AAAAA8or5xwAB0gLyBQAAXibHzD4wDYsCAAAAAAFZWg==`,
  rate: 'G'
}
const postObj2 = {
  title: 'second post by ',
  desc: '2222222222',
  poster: '',
  url: `${app.shortProtocol}://AYhZSqrL3kDvPiUQxHN07AqjlsCO`,
  rate: 'G'
}
const postObj3 = {
  title: 'third post by ',
  desc: '3333333333',
  poster: '',
  url: 'magnet:?xt=urn:btih:a88fda5954e89178c372716a6a78b8180ed4dad3&dn=The+WIRED+CD+-+Rip.+Sample.+Mash.+Share&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F',
  rate: 'G'
}

function channelTest (newTime) {
  const formattedTime = `${newTime.getHours()}-${newTime.getMinutes()}`
  channelObj.title = channelObj.title + formattedTime
  channelObj.desc = `${newTime}`
  postObj.title = postObj.title + formattedTime
  postObj2.title = postObj2.title + formattedTime
  postObj3.title = postObj3.title + formattedTime
  console.log(formattedTime, newTime)
}

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
  playerPage = new PlayerPage(window)
  basicPage = new BasicPage(window)
  accountPage = new AccountPage(window)
  // // fix electron test - ServiceWorker is not defined
  // await basePage.newReload()
  window.on('console', msg => {
    if (msg.type() === 'error') {
      if (msg.text().includes('WebSocket connection')) return
      if (msg.text().includes('get channel list')) return
      if (msg.text().includes('wire')) return
      if (msg.text().includes('recommends.txt')) return
      console.log(`Console log: ${msg.text()} \n ${msg.location().url} \n lineNumber:${msg.location().lineNumber} \n columnNumber:${msg.location().columnNumber} \n`)
    }
  })
})
test.beforeEach(async () => {
  test.setTimeout(60000 * 6)
})
test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test('initialization: 频道测试的初始化', async () => {
  await window.waitForLoadState()
  await console.log('准备登录')
  await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true)
  await console.log('登录成功')
})

test.describe('explorePage: 探索页面测试', ()=>{
  test("open explore page: 开启探索页面",async ()=>{
    console.log('准备跳转到基本设置')
    await basePage.jumpPage('basicLink')
    console.log('页面已跳转')
    const exploreChk = await basicPage.showExploreChk
    console.log('检查探索功能是否开启')
    const isOpenExplore = await exploreChk.getAttribute('aria-checked')
    console.log('aria-checked', isOpenExplore)
    if (isOpenExplore === 'false') {
      console.log('没有开启，准备开启')
      await exploreChk.click()
      console.log('成功开启, 准备保存')
      await basicPage.saveSetting()
      console.log('成功保存')
    }
    if (await basePage.downloadingStatus.isHidden()) {
      console.log('点击菜单')
      await basePage.menuIcon.click()
    }
    console.log('等待出现探索路由')
    await basePage.exploreLink.waitFor({ timeout: 60000 })
    console.log('出现探索路由，准备跳转到探索页面')
    await basePage.jumpPage('exploreLink')
    console.log('页面跳转完成')
    await libraryPage.getPostCardEle('', 'channelTitleEle').nth(0).waitFor({ timeout: 60000 })
  })
  test('search: 探索页面中搜索频道', async()=>{
      test.setTimeout(5 * 60000)
      console.log('跳转到探索页面')
      await basePage.jumpPage('exploreLink')
      console.log('已跳转, 检查面包屑导航是否出现Explore')
      await libraryPage.checkNavBar('Explore', { timeout: 3000 })
      console.log('等待推荐页面加载')
      await libraryPage.getPostCardEle('', 'channelTitleEle').nth(0).waitFor()
      // 存四个视频对象到PostArr中
      const postArr = []
      for (let i = 3; i < 7; i++) {
        const postTitle = await libraryPage.getPostCardEle('', 'postTitle').nth(i).innerText()
        const postChannelTitle = await libraryPage.getPostCardEle('', 'channelTitleEle').nth(i).innerText()
        const postDesc = await libraryPage.getPostCardEle('', 'desc').nth(i).innerText()
        postArr.push({
          title: postTitle,
          channelTitle: postChannelTitle,
          desc: postDesc
        })
      }
      console.log('测试 >> 通过推文标题过滤')
      // 推文标题查找
      for (let j = 0; j < postArr.length; j++) {
        console.log('输入推文标题'+j)
        await libraryPage.searchInput.fill(postArr[j].title)
        await window.waitForTimeout(2000)
        console.log('统计过滤后的推文数量')
        const postNum = await libraryPage.getPostCardEle('', 'postTitle').count()
        console.log('逐一遍历，验证推文标题是否一致')
        for (let i = 0; i < postNum; i++) {
          const postTitle = await libraryPage.getPostCardEle('', 'postTitle').nth(i).innerText()
          if (postTitle !== postArr[j].title && !postTitle.startsWith('Post title')) throw new Error('标题查找出现错误:' + postTitle)
        }
        const postLen = await libraryPage.getPostCardEle(postArr[j].title, 'postTitle').count()
        await libraryPage.postArrFaitFor(postArr[j].title, 'postTitle', postLen)
      }
      console.log('测试 >> 通过频道标题过滤')
      // 频道标题查找
      console.log('切换过滤条件为频道标题')
      await libraryPage.searchCbo.click()
      await window.locator('text=Channel title').click()
      console.log('输入频道标题')
      await libraryPage.searchInput.fill(postArr[0].channelTitle)
      await window.waitForTimeout(3000)
      console.log('统计过滤后的推文数量')
      const postNum = await libraryPage.getPostCardEle('', 'channelTitleEle').count()
      console.log('逐一遍历，验证推文标题是否一致')
      for (let i = 0; i < postNum; i++) {
        const postChannelTitle = await libraryPage.getPostCardEle('', 'channelTitleEle').nth(i).innerText()
        expect(postChannelTitle).toBe(postArr[0].channelTitle)
      }
  })
  test("close explore page: 关闭探索页面", async()=>{
    console.log('准备跳转到基本设置')
    await basePage.jumpPage('basicLink')
    console.log('页面已跳转')
    const exploreChk = await basicPage.showExploreChk
    console.log('检查探索功能是否开启')
    const isOpenExplore = await exploreChk.getAttribute('aria-checked')
    console.log('aria-checked', isOpenExplore)
    if (isOpenExplore === 'true') {
      console.log('开启，准备关闭')
      await exploreChk.click()
      console.log('成功关闭, 准备保存')
      await basicPage.saveSetting()
      console.log('成功保存')
    }
    if (await basePage.downloadingStatus.isHidden()) {
      console.log('点击菜单')
      await basePage.menuIcon.click()
    }
    console.log('等待探索路由消失')
    await basePage.exploreLink.waitFor({ timeout: 60000, state:'detached' })
  })
})
test.describe('localFavorite: 本地收藏', ()=>{
  test('add: 添加本地收藏', async()=>{
    console.log('准备跳转到主页')
    await basePage.jumpPage('homeLink')
    console.log('跳转到主页, 滚屏加载页面')
    //await libraryPage.scrollToLoadPage()
    console.log('滚动结束')
    // 获取第一张卡片的标题
    console.log('获取第一张卡片的标题')
    const cardTitleEle = await window.locator('.post-info .desc-main .desc-title .post-title >> nth=0')
    console.log(cardTitleEle)
    const title = await cardTitleEle.getAttribute('title');
    console.log('title: ' + title)
    console.log('获取第一张卡片的星星按钮')
    const starBtn = await libraryPage.getPostCardEle(title, 'starBtn')
    const starBtnText = await starBtn.innerText()
    console.log(starBtnText)
    if (starBtnText === 'star_border') {
      console.log('星星没有点亮，准备点亮')
      await starBtn.click()
      console.log('成功点亮')
    } else {
      console.log('星星已经点亮')
    }
    console.log('准备跳转到本地收藏页面')
    await basePage.jumpPage('localFavoritesLink')
    console.log('已经跳转到本地收藏页面')
    await window.waitForTimeout(1000)
    console.log('等待卡片上的星星出现')
    await libraryPage.getPostCardEle(title, 'starBtn').waitFor()
    console.log('断定卡片上的星星是点亮的')
    expect(await libraryPage.getPostCardEle(title, 'starBtn').innerText()).toBe('star')
  })
  test('delete: 取消本地收藏', async()=>{
    // 设定现在正处于本地收藏页面
    // 获取第一张卡片的标题
    console.log('获取第一张卡片的标题')
    const cardTitleEle = await window.locator('.post-info .desc-main .desc-title .post-title >> nth=0')
    console.log(cardTitleEle)
    const title = await cardTitleEle.getAttribute('title');
    console.log('title: ' + title)
    console.log('获取第一张卡片的星星按钮')
    const starBtn = await libraryPage.getPostCardEle(title, 'starBtn')
    console.log('取消收藏')
    await starBtn.click()
    console.log('等待卡片消失')
    await starBtn.waitFor({timeout:2000, state:'detached'})
    console.log('卡片已经消失')
  })
})

test.describe('shareChannel: 分享频道测试', ()=>{
  test('postCard', async () => {
    await basePage.jumpPage('homeLink')
    await basePage.waitForAllHidden(await basePage.centerAlert)
    await window.waitForTimeout(5000)
    console.log('获取第一个频道的标题')
    const channelTitleEle = await window.locator('.post-channel-info .channel .channel-title >> nth=0')
    const cardTitleEle = await window.locator('.post-info .desc-main .desc-title .post-title >> nth=0')
    console.log(cardTitleEle)
    const channelTitle = await channelTitleEle.getAttribute('title')
    const cardTitle = await cardTitleEle.getAttribute('title')
    console.log('channelTitle: ' + channelTitle)
    console.log('cardTitle: ' + cardTitle)
    // 复制分享频道链接
    console.log('点击更多选项')
    await libraryPage.getPostCardEle(cardTitle, 'moreBtn').click()
    await window.waitForTimeout(1000)
    console.log('点击分享按钮-拷贝ID')
    await libraryPage.mmShareBtn.click()
    await window.waitForTimeout(500)
    console.log('等待提示: 已复制ID')
    await libraryPage.copiedAlert.waitFor('visible')
    // 检查各个页面触发复制
    console.log('检查各个页面-粘贴触发-定位到对应频道')
    console.log('home')
    await libraryPage.checkShareLink('homeLink', channelTitle, { isCloseDialog: false })
    console.log('follow')
    await libraryPage.checkShareLink('followingLink', channelTitle)
    console.log('local_favorite')
    await libraryPage.checkShareLink('localFavoritesLink', channelTitle)
    // console.log('explore')
    // await libraryPage.checkShareLink('exploreLink', channelTitle)
    await window.waitForTimeout(5000)
    await libraryPage.checkShareLink('editLink', channelTitle)
    await libraryPage.checkShareLink('downloadingStatus', channelTitle)
    await libraryPage.checkShareLink('uploadingStatus', channelTitle)
    await libraryPage.checkShareLink('downloadedStatus', channelTitle)
    await libraryPage.checkShareLink('playerLink', channelTitle)
    await libraryPage.checkShareLink('creditsLink', channelTitle)
    await libraryPage.checkShareLink('accountSettingLink', channelTitle)
    await libraryPage.checkShareLink('basicLink', channelTitle)
    await libraryPage.checkShareLink('advancedLink', channelTitle)
  })
})