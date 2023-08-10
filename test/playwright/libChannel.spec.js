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
var accountPassword = process.env.TEST_PASSWORD

const testChannel = {
  title: 'public short film',
  desc: 'Collect popular short film',
  isPrivate: false,
  channelID: 'fxpebrsi9ij5pzinwdky'
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
      if (msg.text().includes('a status of 404')) return
      if (msg.location().url.includes('recommends.txt')) return
      if (msg.location().url.includes('versions.json')) return
      if (msg.location().url.includes('alpha.biz')) return
      if (msg.location().url.includes('take - down.json')) return
      if (msg.text().includes('no such file or directory')) return
      if (msg.text().includes('resolver')) return
      console.log(`Console log: ${msg.text()} \n ${msg.location().url} \n lineNumber:${msg.location().lineNumber} \n columnNumber:${msg.location().columnNumber} \n`)
    }
  })
})



test.beforeEach(async () => {
  test.setTimeout(60000 * 6)
  basePage.checkForPopup()
})
test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test('initialization-频道测试的初始化', async () => {
  await window.waitForLoadState()
  await console.log('准备登录')
  await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true)
  await console.log('登录成功')
})

test.describe('explorePage-探索页面测试', ()=>{
  test("open explore page-开启探索页面",async ()=>{
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
    console.log('出现探索路由')
  })
  test('search-探索页面中搜索频道', async()=>{
      test.setTimeout(5 * 60000)
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      console.log('准备跳转到探索页面')
      await basePage.jumpPage('exploreLink')
      console.log('已跳转, 检查面包屑导航是否出现Explore')
      await libraryPage.checkNavBar('Explore', { timeout: 3000 })
      // 获取第一张卡片的标题
      console.log('等待第一张卡片出现')
      const cardTitleEle = await window.waitForSelector('.post-info .desc-main .desc-title .post-title >> nth=0', {timeout: 5*60000})
      console.log('使用第一张卡片做测试')
      const postTitle = await cardTitleEle.getAttribute('title');
      const postChannelTitle = await libraryPage.getPostCardEle(postTitle, 'channelTitleEle').nth(0).innerText()
      console.log('title: '+ postTitle)
      console.log('channelTitle: '+ postChannelTitle)
      const post = {
        title: postTitle,
        channelTitle: postChannelTitle
      }
      console.log('测试 >> 通过推文标题过滤')
      // 推文标题查找
      console.log('输入推文标题'+postTitle)
      await libraryPage.searchInput.fill(post.title)
      await window.waitForTimeout(2000)
      console.log('统计过滤后的推文数量')
      const postNumByTitle = await libraryPage.getPostCardEle('', 'postTitle').count()
      console.log('逐一遍历，验证推文标题是否一致')
      for (let i = 0; i < postNumByTitle; i++) {
        const postTitle = await libraryPage.getPostCardEle('', 'postTitle').nth(i).innerText()
        if (postTitle !== post.title && !postTitle.startsWith('Post title')) throw new Error('标题查找出现错误:' + postTitle)
      }
      const postLen = await libraryPage.getPostCardEle(post.title, 'postTitle').count()
      await libraryPage.postArrFaitFor(post.title, 'postTitle', postLen)
      console.log('测试 >> 通过频道标题过滤')
      // 频道标题查找
      console.log('切换过滤条件为频道标题')
      await libraryPage.searchCbo.click()
      await window.locator('text=Channel title').click()
      console.log('输入频道标题')
      await libraryPage.searchInput.fill(post.channelTitle)
      await window.waitForTimeout(3000)
      console.log('统计过滤后的推文数量')
      const postNum = await libraryPage.getPostCardEle('', 'channelTitleEle').count()
      console.log('逐一遍历，验证推文标题是否一致')
      for (let i = 0; i < postNum; i++) {
        const postChannelTitle = await libraryPage.getPostCardEle('', 'channelTitleEle').nth(i).innerText()
        expect(postChannelTitle).toBe(post.channelTitle)
      }
  })
  test("close explore page-关闭探索页面", async()=>{
    await basePage.ensureLoginStatus(name, accountPassword, true, true)
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
test.describe('localFavorite-本地收藏', ()=>{
  test('add-添加本地收藏', async()=>{
    await basePage.ensureLoginStatus(name, accountPassword, true, true)
    console.log('准备跳转到主页')
    await basePage.jumpPage('homeLink')
    console.log('跳转到主页, 滚屏加载页面')
    await libraryPage.scrollToLoadPage()
    console.log('滚动结束')
    // 获取第一张卡片的标题
    console.log('等待第一张卡片出现')
    const cardTitleEle = await window.waitForSelector('.post-info .desc-main .desc-title .post-title >> nth=0')
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
  test('delete-取消本地收藏', async()=>{
    await basePage.ensureLoginStatus(name, accountPassword, true, true)
    console.log('准备跳转到本地收藏页面')
    await basePage.jumpPage('localFavoritesLink')
    console.log('已经跳转到本地收藏页面')
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

test.describe('shareChannel-分享频道测试', ()=>{
  test('postCard', async () => {
    await basePage.ensureLoginStatus(name, accountPassword, true, true)
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
  })
})

test.describe('downLoad-测试下载功能',()=>{
  test.beforeEach(async()=>{
    await basePage.ensureLoginStatus(name, accountPassword, true, true)
    console.log('准备跳转首页')
    await basePage.jumpPage('homeLink')
    console.log('跳转成功')
    await basePage.waitForAllHidden(await basePage.centerAlert)
    // 第一步，找到频道fxpebrsi9ij5pzinwdky
    console.log('搜索频道')
    await libraryPage.searchChannelID(testChannel, false)
    // 进入频道
    console.log('找到频道')
    //await window.waitForSelector('.q-card:has-text("Search for channel ID") .channel-image .q-img__content:has-text("public short film")')
    const targetChannel = window.locator('.q-card:has-text("Search for channel ID") .channel-image .q-img__content:has-text("public short film")')
    if (await targetChannel.isVisible()) {
      console.log('进入频道')
      await targetChannel.click()
    }
  })
  test('下载', async()=>{
    // 第二步，找到目标电影
    const downLoadBtn = window.locator('.post-info:has-text("Big Buck Bunny") .q-btn:has-text("Download")')    
    // 第三步，点击下载按钮
    console.log('点击下载按钮')
    await downLoadBtn.click()
    await window.waitForTimeout(2000)
    // 跳转到下载
    console.log('准备跳转到下载页')
    await basePage.jumpPage('downloadingStatus')
    console.log('跳转成功')
    console.log('等待影片出现在下载队列')
    await window.waitForTimeout(5000)
    const downloadingItem = window.locator('.q-virtual-scroll__content:has-text("Big Buck Bunny")')
    if(await downloadingItem.isVisible()){
      console.log('影片正在下载中')
    } else {
      console.log('影片没有出现在下载队列中')
    }
    const cancelBtn = window.locator('.q-virtual-scroll__content:has-text("Big Buck Bunny") button:has-text("close")')
    console.log('取消影片下载')
    await cancelBtn.click()
    const confirmBtn = window.locator('.q-card:has-text("Delete Big Buck Bunny") .block:has-text("Delete")')
    console.log('准备从下载队列中移除')
    await confirmBtn.click()
    console.log('验证是否已经移除')
    await window.waitForSelector('.q-virtual-scroll__content:has-text("Big Buck Bunny")', {state:'detached'})
    console.log('已经移除')
  })
  test('边下边播', async()=>{
    // 第二步，找到目标电影
    const PlayBtn = window.locator('.post-info:has-text("Big Buck Bunny") .q-btn:has-text("Play...")')
    // 第三步，点击边下边播按钮
    console.log('点击边下边播按钮')
    await PlayBtn.click()
    // 自动跳转到playerLink
    console.log('自动跳转到播放器页')
    await window.waitForSelector('.video-js-player:has-text("Big Buck Bunny")', {timeout: 5*60000})
    console.log('影片开始播放')
    console.log('跳转成功')
    // 跳转到下载页面
    console.log('准备跳转到下载页')
    await basePage.jumpPage('downloadingStatus')
    console.log('跳转成功')
    console.log('等待影片出现在下载队列')
    const downloadingItem = window.locator('.q-virtual-scroll__content:has-text("Big Buck Bunny")')
    if (await downloadingItem.isVisible()) {
      console.log('影片正在下载中')
    } else {
      console.log('影片没有出现在下载队列中')
    }
    const cancelBtn = window.locator('.q-virtual-scroll__content:has-text("Big Buck Bunny") button:has-text("close")')
    console.log('取消影片下载')
    await cancelBtn.click()
    const confirmBtn = window.locator('.q-card:has-text("Big Buck Bunny") .block:has-text("Delete")')
    console.log('准备从下载队列中移除')
    await confirmBtn.click()
    console.log('验证是否已经移除')
    await window.waitForSelector('.q-virtual-scroll__content:has-text("Big Buck Bunny")', { state: 'detached' })
    console.log('已经移除')
  })
})