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
let name
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
const testMovie = "Big Buck Bunny"
const privateChannel = {
  title: 'X特遣队',
  desc: 'X特遣队：全员集结 The Suicide Squad',
  isPrivate: true,
  channelID: 'vvkakh29yfu1hyjfhngw'
}
const fullLevelChannel = {
  title: '失控玩家 Free Guy (2021)',
  desc:  '失控玩家 Free Guy (2021)',
  isPrivate: true,
  channelID: '5y2mk4yx2jmoylzlbkrf'
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
  basePage.checkForPopup()
})

test.afterAll(async()=>{
  console.log('测试完成之后，退出登录')
  await basePage.signOut()
})



test.beforeEach(async () => {
  test.setTimeout(60000 * 6)
  const message = await basePage.ensureLoginStatus(name, accountPassword, true, true)
  if(message == "success") {
    await basePage.waitForAllHidden(await basePage.alert)
  }
  const inHome = await window.locator('.left-drawer-menu .q-item:has-text("home").active-item').count()
  if(inHome > 0){
    console.log('当前在首页')
    console.log('检查是否存在Follow菜单项')
    //等待
    await basePage.waitForSelectorOptional('.left-drawer-menu >> text=following',{timeout: 10000},'不可见')
    const followExist = await window.locator('.left-drawer-menu >> text=following').count() //小屏（不可见但存在）
    if(followExist > 0){
      console.log('有')
    }else{
      console.log('没有')
      console.log('等待出现局部推荐页面的第一个频道')
      await window.waitForSelector('.channel-card >> nth=5', { timeout: 60000 })
      if (!await libraryPage.channelSelected.isVisible()) {
        console.log('选中第一个频道')
        await libraryPage.chanel1Local.click(); //局部推荐页的第一个频道定位
        console.log('成功选中')
      }
      console.log('点击Follow')
      // 3. 点击Follow按钮
      await libraryPage.channelFollowsBtn.click();
      console.log('成功Follow了一个频道')
      if (await basePage.followingLink.isVisible()) {
        console.log('菜单中出现了Follow选项')
      }
    }
    console.log('等待主页中的频道出现，否则稍等片刻会强制跳转回主页')
    const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
    if (mainLoad) console.log('已出现，页面加载完毕')
  }
})
test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test('checkNetwork-检查节点连接是否正常', async ()=>{
  const connector = await window.waitForSelector('.connection-status')
  await connector.click()
  console.log('检查gun-manhattan的节点是否正常')
  const manhattan = await basePage.waitForSelectorOptional('.q-table:has-text("status") tr>>nth=1>>.text-green', { timeout: 30000}, '异常, 在30s之内不能连接上gun-manhattan的节点')
  if(manhattan) console.log('正常')
  console.log('检查gun-server的节点是否正常')
  const server = await basePage.waitForSelectorOptional('.q-table:has-text("status") tr>>nth=2>>.text-green', { timeout: 30000}, '异常, 在30s之内不能连接上gun-server的节点')
  if(server) console.log('正常')
  console.log('有没有关闭按钮')
  const seeCloseBtn = await window.locator('button:has-text("close")').isVisible()
  if(seeCloseBtn){
    console.log('有')
    await window.locator('button:has-text("close")').click()
    console.log('点击关闭按钮')
  }else{
    console.log('没有')
    const dialogSelector = await window.locator('.q-table:has-text("status") tr>>nth=1')
    await dialogSelector.click()
    console.log('点击对话框中的内容，以确保它获得焦点')
    await window.waitForTimeout(1000)
    await window.keyboard.press('Escape');
    await window.keyboard.press('Escape');
    console.log('按下Esc键以关闭对话框')
    await window.waitForTimeout(1000)
    if (await window.locator('.q-dialog >>.peer-dialog-card').isVisible()) {
      console.log('没有关闭')
    }
  }
  console.log('已经关闭弹窗')
})

test.describe('explorePage-探索页面测试', ()=>{
  test("open explore page-开启探索页面",async ()=>{
    console.log('准备跳转到基本设置')
    if(!await basePage.jumpPage('basicLink')){
      console.log('跳转失败')
      test.skip()
    }
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
      console.log('准备跳转到探索页面')
      if(!await basePage.jumpPage('exploreLink')){
        console.log('跳转失败')
        test.skip()
      }
      console.log('已跳转, 检查面包屑导航是否出现Explore')
      try{
        await libraryPage.checkNavBar('Explore', { timeout: 6000 })
      }catch(error){
        console.log(error)
        test.skip()
      }
      // 获取第一张卡片的标题
      console.log('等待第一张卡片出现')
      try{
        await window.waitForSelector('.post-info .desc-main .desc-title .post-title >> nth=0', {timeout: 60000} )
      }catch(error){
        console.log(error)
        test.skip()
      }
      const cardTitleEle = window.locator('.post-info .desc-main .desc-title .post-title >> nth=0')
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
      const postNumByTitle = await window.locator('.post-card .post-title').count()
      console.log(postNumByTitle)
      console.log('逐一遍历，断言推文标题都包含目标字符串')
      for (let i = 0; i < postNumByTitle; i++) {
        const postTitle = await window.locator('.post-card .post-title').nth(i).innerText()
        if (!postTitle.includes(post.title)) throw new Error('标题查找出现错误:' + postTitle)
      }
      console.log('断言成功')
      console.log('测试 >> 通过频道标题过滤')
      // 频道标题查找
      console.log('切换过滤条件为频道标题')
      await libraryPage.searchCbo.click()
      await window.locator('text=Channel title').click()
      console.log('输入频道标题')
      await libraryPage.searchInput.fill(post.channelTitle)
      console.log('统计过滤后的推文数量')
      const postNumByChannel = await window.locator('.post-card .channel-title').count()
      console.log(postNumByChannel)
      console.log('逐一遍历, 断言频道名称都包含目标字符串')
      for (let i = 0; i < postNumByChannel; i++) {
        const postChannelTitle = await window.locator('.post-card .channel-title').nth(i).innerText()
        if (!postChannelTitle.includes(post.channelTitle)) throw new Error('频道查找出现错误:' + postTitle)
      }
      console.log('断言成功')
  })
  test('follow-关注功能的测试', async () => {
    console.log('准备跳转到探索页面')
    if(!await basePage.jumpPage('exploreLink')){
      console.log('跳转失败')
      test.skip()
    }
    console.log('已跳转, 检查面包屑导航是否出现Explore')
    try{
      await libraryPage.checkNavBar('Explore', { timeout: 6000 })
    }catch(error){
      console.log(error)
      test.skip()
    }
    // 获取第一张卡片的标题
    console.log('等待第一张卡片出现')
    try{
      await window.waitForSelector('.post-info .desc-main .desc-title .post-title >> nth=0', { timeout: 30000 })
    }catch(error){
      console.log(error)
      test.skip()
    }
    const cardTitleEle = await window.waitForSelector('.post-info .desc-main .desc-title .post-title >> nth=0', { timeout: 30000 })
    console.log('使用第一张卡片做测试')
    const postTitle = await cardTitleEle.getAttribute('title');
    const postChannelTitle = await libraryPage.getPostCardEle(postTitle, 'channelTitleEle').nth(0).innerText()
    console.log('title: ' + postTitle)
    console.log('channelTitle: ' + postChannelTitle)
    const followBtn = window.locator('.post-channel-info .follow-btn-label >> nth = 0')
    console.log('准备关注')
    await window.waitForSelector('.post-channel-info .follow-btn-label >> nth = 0', { timeout: 10000 })
    console.log('关注按钮已经加载出来')
    await followBtn.click()
    console.log('关注按钮已经按下')
    console.log('等待按钮出现Following')
    try{
      await window.waitForSelector('.post-channel-info .follow-btn-label:has-text("Following")', {timeout: 6000})
    }catch(error){
      console.error('6s之内没有出现Following')
      return
    }
    console.log('按钮成功出现Following')
    console.log('准备跳转到关注页面')
    if(!await basePage.jumpPage('followingLink')){
      console.log('跳转失败')
      test.skip()
    }
    console.log('已跳转')
    console.log('等待出现刚才关注的频道')
    const appear = await basePage.waitForSelectorOptional(`.q-img__content:has-text("${postChannelTitle}")`, {timeout: 10000})    
    if(appear)console.log('成功出现')
    else {
      console.log('没有成功出现')
      return
    }
    const unfollowBtn = window.locator(`.channel-card:has-text("${postChannelTitle}") .follow-btn`)
    console.log('准备取消关注这个频道')
    await unfollowBtn.click()
    console.log('出现确认弹窗')
    await window.locator('.q-card:has-text("Unfollow") .q-btn:has-text("Unfollow")').click()
    await window.waitForSelector(`.q-img__content:has-text("${postChannelTitle}")`, { state: "detached" })
    console.log('成功取消关注')
  })
  test("close explore page-关闭探索页面", async()=>{
    console.log('准备跳转到基本设置')
    if(!await basePage.jumpPage('basicLink')){
      console.log('跳转失败')
      test.skip()
    }
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
    console.log('准备跳转到主页')
    if (!await basePage.jumpPage('homeLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转到主页, 滚屏加载页面')
    await libraryPage.scrollToLoadPage()
    console.log('滚动结束')
    // 获取第一张卡片的标题
    console.log('等待第一张卡片出现')
    try{
      await window.waitForSelector('.post-info .desc-main .desc-title .post-title >> nth=0')
    }catch(error){
      console.log(error)
      test.skip()
    }
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
    if (!await basePage.jumpPage('localFavoritesLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('已经跳转到本地收藏页面')
    await window.waitForTimeout(1000)
    console.log('等待卡片上的星星出现')
    await libraryPage.getPostCardEle(title, 'starBtn').waitFor()
    console.log('断言卡片上的星星是点亮的')
    expect(await libraryPage.getPostCardEle(title, 'starBtn').innerText()).toBe('star')
    console.log('断言成功')
  })
  test('delete-取消本地收藏', async()=>{
    console.log('准备跳转到本地收藏页面')
    if (!await basePage.jumpPage('localFavoritesLink')) {
      console.log('跳转失败')
      test.skip()
    }
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
    console.log('取消成功')
    console.log('等待卡片消失')
    await starBtn.waitFor({timeout:2000, state:'detached'})
    console.log('卡片已经消失')
  })
})

test.describe('shareChannel-分享频道测试', ()=>{
  test('到主页拷贝一个频道链接', async () => {
    if (!await basePage.jumpPage('homeLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('获取第一个频道的标题')
    const channelTitleEle = await window.locator('.post-channel-info .channel .channel-title >> nth=0')
    const cardTitleEle = await window.locator('.post-info .desc-main .desc-title .post-title >> nth=0')
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
    if(await libraryPage.checkShareLink('homeLink', channelTitle, { isCloseDialog: false })){
      console.log('home页面触发成功')
    } else{
      console.log('home页面触发失败')
    }
    if(await libraryPage.checkShareLink('followingLink', channelTitle, { isCloseDialog: false })){
      console.log('follow页面触发成功')
    } else {
      console.log('follow页面触发失败')
    }
  })
})

test.describe('downLoad-测试下载功能',()=>{
  test.beforeEach(async()=>{
    const message = await basePage.ensureLoginStatus(name, accountPassword, true, true)
    if (message == "success") {
      await basePage.waitForAllHidden(await basePage.alert)
    }
    const inHome = await window.locator('.left-drawer-menu .q-item:has-text("home").active-item').count()
    if (inHome > 0) {
      console.log('检查是否存在Follow菜单项')
      //等待
      await basePage.waitForSelectorOptional('.left-drawer-menu >> text=following', { timeout: 10000 }, '不可见')
      const followExist = await window.locator('.left-drawer-menu >> text=following').count() //小屏（不可见但存在）
      if (followExist > 0) {
        console.log('有')
      } else {
        console.log('没有')
        console.log('等待出现局部推荐页面的第一个频道')
        await window.waitForSelector('.channel-card >> nth=5', { timeout: 60000 })
        if (!await libraryPage.channelSelected.isVisible()) {
          console.log('选中第一个频道')
          await libraryPage.chanel1Local.click(); //局部推荐页的第一个频道定位
          console.log('成功选中')
        }
        console.log('点击Follow')
        // 3. 点击Follow按钮
        await libraryPage.channelFollowsBtn.click();
        console.log('成功Follow了一个频道')
        if (await basePage.followingLink.isVisible()) {
          console.log('菜单中出现了Follow选项')
        }
      }
      console.log('等待主页中的频道出现，否则稍等片刻会强制跳转回主页')
      const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
      if (mainLoad) console.log('已出现，页面加载完毕')
    }else{
      console.log('准备跳转首页')
      if (!await basePage.jumpPage('homeLink')) {
        console.log('跳转失败')
        test.skip()
      }
      console.log('跳转成功')
    }
    // 第一步，找到频道fxpebrsi9ij5pzinwdky
    console.log('搜索频道')
    await libraryPage.searchChannelID(testChannel, false)
    // 进入频道
    const targetChannel = await basePage.waitForSelectorOptional(`.q-card:has-text("Search for channel ID") .channel-image .q-img__content:has-text("${testChannel.title}")`, {timeout:20000}, '找不到频道')
    if (targetChannel) {
      console.log('进入频道')
      await targetChannel.click()
    } else {
      await libraryPage.sciCloseBtn.click()
      console.log('关闭搜索页')
      test.skip()
    }
  })
  test('下载', async()=>{
    console.log('滚屏加载')
    await window.locator('.posts').hover()
    await window.mouse.wheel(0, 1000)
    console.log('寻找目标电影')
    const targetFilm = await basePage.waitForSelectorOptional(`.post-info:has-text("${testMovie}")`, {timeout:60000},'没有找到')
    if(targetFilm) console.log('成功找到')
    else{
      test.skip()
    } 
    const downLoadBtn = window.locator(`.post-info:has-text("${testMovie}") .q-btn:has-text("Download")`)    
    // 第三步，点击下载按钮
    await downLoadBtn.click()
    console.log('点击下载按钮')
    await window.waitForTimeout(2000)
    // 跳转到下载
    console.log('准备跳转到下载页')
    if (!await basePage.jumpPage('downloadingStatus')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转成功')
    console.log('等待影片出现在下载队列')
    await window.waitForTimeout(5000)
    const downloadingItem = window.locator(`.q-virtual-scroll__content:has-text("${testMovie}")`)
    if(await downloadingItem.isVisible()){
      console.log('影片正在下载中')
    } else {
      console.log('影片没有出现在下载队列中')
    }
    const cancelBtn = window.locator(`.q-virtual-scroll__content:has-text("${testMovie}") button:has-text("close")`)
    console.log('取消影片下载')
    await cancelBtn.click()
    const confirmBtn = window.locator(`.q-card:has-text("Delete ${testMovie}") .block:has-text("Delete")`)
    console.log('准备从下载队列中移除')
    await confirmBtn.click()
    console.log('验证是否已经移除')
    await window.waitForSelector(`.q-virtual-scroll__content:has-text("${testMovie}")`, {state:'detached'})
    console.log('已经移除')
  })
  test('边下边播', async()=>{
    console.log('寻找目标电影')
    const targetFilm = await basePage.waitForSelectorOptional(`.post-info:has-text("${testMovie}")`, { timeout: 60000 }, '没有找到')
    if (targetFilm) console.log('成功找到')
    else {
      test.skip()
    } 
    // 点击边下边播按钮
    const PlayBtn = window.locator(`.post-info:has-text("${testMovie}") .q-btn:has-text("Play...")`)
    console.log('点击边下边播按钮')
    try{
      await PlayBtn.click({delay: 500})
    }catch(error){
      console.log(error)
      test.skip()
    }
    // 自动跳转到playerLink
    console.log('完成点击，自动跳转到播放器页, 等待影片播放')
    const playing = await basePage.waitForSelectorOptional(`.video-js-player:has-text("${testMovie}")`, {timeout: 30000}, '30s内无响应')
    if(playing){
      console.log('影片开始播放')
    }
    // 跳转到下载页面
    console.log('准备跳转到下载页')
    if (!await basePage.jumpPage('downloadingStatus')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转成功')
    console.log('等待影片出现在下载队列')
    const downloadingItem = window.locator(`.q-virtual-scroll__content:has-text("${testMovie}")`)
    if (await downloadingItem.isVisible()) {
      console.log('影片正在下载中')
    } else {
      console.log('影片没有出现在下载队列中')
    }
    const cancelBtn = window.locator(`.q-virtual-scroll__content:has-text("${testMovie}") button:has-text("close")`)
    console.log('取消影片下载')
    await cancelBtn.click()
    const confirmBtn = window.locator(`.q-card:has-text("${testMovie}") .block:has-text("Delete")`)
    console.log('准备从下载队列中移除')
    await confirmBtn.click()
    console.log('验证是否已经移除')
    await window.waitForSelector(`.q-virtual-scroll__content:has-text("${testMovie}")`, { state: 'detached' })
    console.log('已经移除')
  })
})

test.describe('homePage-SearchChannel-在主页中搜索频道', ()=>{
  test('privateChannel搜索频道', async()=>{
    console.log('准备跳转首页')
    if (!await basePage.jumpPage('homeLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转成功')
    await basePage.waitForAllHidden(await basePage.centerAlert)
    console.log('搜索私有频道')
    await libraryPage.searchChannelID(privateChannel, true)
    // 等待频道出现
    const targetChannel = await basePage.waitForSelectorOptional(`.q-card:has-text("Search for channel ID") .channel-image .q-img__content:has-text("${privateChannel.title}")`, { timeout: 20000 }, '找不到频道')
    if (targetChannel) {
      console.log('进入频道')
      await targetChannel.click()
    }else{
      await libraryPage.sciCloseBtn.click()
      console.log('关闭搜索页')
      test.skip()
    }
  })
  test('available-firm-rate搜索不同级别的电影(NC-17)', async ()=>{
    console.log('准备跳转基础设置页')
    if (!await basePage.jumpPage('basicLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转成功')
    console.log('准备设置限制级为NC-17')
    const selectBtn = window.locator('.setting-block:has-text("Library") .q-field__append')
    await selectBtn.click()
    const Nc17Option = window.locator('.q-menu >> text=17')
    await Nc17Option.click()
    console.log('设置完毕')
    console.log('准备保存')
    await basicPage.saveSetting()
    console.log('成功保存')
    await window.waitForTimeout(2000)
    console.log('准备跳转首页')
    if (!await basePage.jumpPage('homeLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转成功')
    await basePage.waitForAllHidden(await basePage.centerAlert)
    console.log('搜索拥有全级别的频道')
    await libraryPage.searchChannelID(fullLevelChannel, true)
    // 进入频道
    const targetChannel = await basePage.waitForSelectorOptional(`.q-card:has-text("Search for channel ID") .channel-image .q-img__content:has-text("${fullLevelChannel.title}")`, { timeout: 20000 }, '找不到频道')
    if (targetChannel) {
      console.log('进入频道')
      await targetChannel.click()
    } else {
      await libraryPage.sciCloseBtn.click()
      console.log('关闭搜索页')
      test.skip()
    }
    // 遍历影片列表
    const firm = await basePage.waitForSelectorOptional('.desc-main > .text-subtitle2', {timeout: 10000}, '10s内没有影片出现')
    if(firm){
      console.log('滚屏')
      await window.locator('.posts').hover()
      await window.mouse.wheel(0, 1000)
      const foot = await basePage.waitForSelectorOptional('.channel-page >> text=You have already got all posts', { timeout: 5000 }, '还没有滑到底部')
      if (foot) console.log('已经到底部')
      console.log('统计列表中可见的影片个数：（一级一个影片，总共五个影片）')
      console.log('应该出现G,PG,PG-13,R,NC-17')
      const seeG = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=G', { timeout: 5000 })
      const seePG = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=PG', { timeout: 5000 })
      const seePG13 = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=PG-13', { timeout: 5000 })
      const seeR = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=R', { timeout: 5000 })
      const seeNC17 = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=NC-17', { timeout: 5000 })
      if (seeG) console.log('G√')
      if (seePG) console.log('PG√')
      if (seePG13) console.log('PG13√')
      if (seeR) console.log('R√')
      if (seeNC17) console.log('NC17√')
    } 
  })

  test('available-firm-rate搜索不同级别的电影(PG-13)', async () => {
    await window.waitForTimeout(2000)
    console.log('准备跳转基础设置页')
    if (!await basePage.jumpPage('basicLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转成功')
    console.log('准备设置限制级为PG-13')
    const selectBtn = window.locator('.setting-block:has-text("Library") .q-field__append')
    await selectBtn.click()
    const Nc17Option = window.locator('.q-menu >> text=PG-13')
    await Nc17Option.click()
    console.log('设置完毕')
    console.log('准备保存')
    await basicPage.saveSetting()
    console.log('成功保存')
    await window.waitForTimeout(2000)
    console.log('准备跳转首页')
    if (!await basePage.jumpPage('homeLink')) {
      console.log('跳转失败')
      test.skip()
    }
    console.log('跳转成功')
    await basePage.waitForAllHidden(await basePage.centerAlert)
    console.log('搜索拥有全级别的频道')
    await libraryPage.searchChannelID(fullLevelChannel, true)
    // 进入频道
    const targetChannel = await basePage.waitForSelectorOptional(`.q-card:has-text("Search for channel ID") .channel-image .q-img__content:has-text("${fullLevelChannel.title}")`, { timeout: 20000 }, '找不到频道')
    if (targetChannel) {
      console.log('进入频道')
      await targetChannel.click()
    } else {
      await libraryPage.sciCloseBtn.click()
      console.log('关闭搜索页')
      test.skip()
    }
    // 遍历影片列表
    const firm = await basePage.waitForSelectorOptional('.desc-main > .text-subtitle2', { timeout: 10000 }, '10s内没有影片出现')
    if (firm) {
      console.log('滚屏')
      await window.locator('.posts').hover()
      await window.mouse.wheel(0, 1000)
      const foot = await basePage.waitForSelectorOptional('.channel-page >> text=You have already got all posts', { timeout: 5000 }, '还没有滑到底部')
      if(foot)console.log('已经到底部')
      console.log('统计列表中可见的影片个数：（一级一个影片，总共五个影片）')
      console.log('应该出现G,PG,PG-13')
      const seeG = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=G', { timeout: 5000 })
      const seePG = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=PG', { timeout: 5000 })
      const seePG13 = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=PG-13', { timeout: 5000 })
      if (seeG) console.log('G√')
      if (seePG) console.log('PG√')
      if (seePG13) console.log('PG13√')
      console.log('不应该出现R,NC-17')
      const seeR = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=R', { timeout: 5000 })
      const seeNC17 = await basePage.waitForSelectorOptional('.text-subtitle2 >> text=NC-17', { timeout: 5000 })
      if(seeR) console.log('危险, 能看到R')
      if(seeNC17) console.log('危险, 能看到NC-17')
      if(!seeR && !seeNC17)console.log('正常, 没有出现')
    }
  })
})
