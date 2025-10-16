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
const accountPassword = process.env.TEST_PASSWORD
const accountResetPassword = process.env.TEST_RESET_PASSWORD

const privateChannel = {
  title: 'X特遣队',
  desc: 'X特遣队：全员集结 The Suicide Squad',
  isPrivate: true,
  channelID: 'vvkakh29yfu1hyjfhngw'
}
// const privatePost = {
//   title: 'X特遣队：全员集结 The Suicide Squad (2021)',
//   desc: '关押在美梦监狱的X特遣队成员获得一项可以减轻刑罚的新任务，前往南美洲的科托马耳他岛国，摧毁纳粹时期遗留的约顿海姆监狱和实验室，它当前用于关押该国的政治犯并施行人体实验。执行任务期间，X特遣队遭遇巨型外星生物海星斯塔罗，并与它发生冲突。',
//   poster: '',
//   url: `${app.protocol}://uTorrent+Web+Tutorial+Video/AWGzuIVsSDnt9R9cI0ZZm2vsUkFF&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4ALxATpdABhqCGEMasx_OPsfBFf6STjs7yEovJdH6ObIkXuPJdVFCvNYt4Pc61Bo+mbFMnz74ydATVDkJaObcR0qhiqPrZctZJ7wrQIGnWNpA6Pm9VngzwAxCow6VTNOPsR2ZmQLh6a5lzjcxHj1tP6k7AKbVFqNWDAAB9Xsbku1S+9MyAXPjwUFk9QUFefp0ZcCzVc6_dcNPvyL7tq+N9QPMqfMbSeL0TjRSROCeeZm2zRslPQyYmPX+Gm2uX3jvkBqCiSiWX4vUwGX+j43FHftXg3ettQe4CKgpHNwlgE4mZrw0z5HUmLSXJKrWC7cC4TelK71c2nNMoDc+24nO3RyGNImyf3YhnKLCsiwAbhxGYqg+HTezO_5iIDbQLEKX+GNoYmCIvkBSei+bODtpO0lgJ3Lqw_SToWjaMQsvM8AAAAA8or5xwAB0gLyBQAAXibHzD4wDYsCAAAAAAFZWg==`,
//   rate: 'G'
// }
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

test.describe('initialization', () => {
  test.beforeEach(async () => {
    await window.waitForLoadState()
    await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true)
  })

  test.skip('clear publish and block', async () => {
    let publishLog = true, blockLog = true
    await window.waitForTimeout(30000)
    while (publishLog || blockLog) {
      console.log(publishLog, blockLog)
      if (blockLog) {
        blockLog = await basePage.deleteBlock()
        await accountPage.clickViewport(100, 100)
      }
      if (publishLog) publishLog = await basePage.deletePublish()
      await window.waitForTimeout(60000)
      await basePage.signOut()
      await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true)
    }
  })
})

test.skip('disable cloud key force', async () => {
  await basePage.clearLocalstorage()
  await window.waitForTimeout(3000)
  await basePage.ensureLoginStatus(name, accountPassword, true, true)
  await basePage.waitForAllHidden(await basePage.alert)
  await accountPage.disableCloudKey()

  // 验证取消同步云端
  await basePage.signOut()
  await basePage.signIn(name, accountPassword, true, false)
  await accountPage.ckCard.waitFor()
  // await expect(accountPage.ckFromcloudChk).toHaveText(/Disable cloud storage/)
  // await basePage.signOut()
  await basePage.clearLocalstorage()
  await window.waitForTimeout(3000)
})

test.describe('key', () => {
  test.beforeEach(async () => {
  })
  test.describe('independent password', async () => {
    const inPassword = process.env.TEST_RESET_PASSWORD
    const newPassword = process.env.TEST_PASSWORD
    test.skip('importing a Local Key', async () => { // 此用例已不可用
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await window.waitForTimeout(20000)
      if (await accountPage.recommendTitle.isVisible()) await accountPage.recommendSelected()
      await accountPage.ckImportChk.waitFor()
      const taskAbk = './test/cypress/fixtures/samples/test.abk'
      await window.locator('[name="input-file"][accept=".abk"]').setInputFiles(taskAbk, { timeout: 60000 })
      await window.waitForTimeout(100000)
    })

    test('save cloud key', async () => {
      // await basePage.clearLocalstorage()
      await window.waitForLoadState()
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await window.waitForTimeout(2000)
      await basePage.waitForAllHidden(await basePage.alert)
      await accountPage.disableCloudKey()
      await accountPage.enableCloudKey(inPassword, false)
      await window.waitForTimeout(3000)
      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey(inPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await basePage.jumpPage('homeLink')
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test('config password', async () => {
      await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true, true)
      await accountPage.cfgKeyPassword(inPassword, newPassword)
      // 验证同步云端
      await basePage.signOut()
      await basePage.waitForAllHidden(await basePage.alert)
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await accountPage.syncCloudKey(newPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await basePage.jumpPage('homeLink')
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
      await basePage.waitForAllHidden(await basePage.alert)
    })
    test('update and save key in cloud', async () => {
      test.setTimeout(5 * 60000)
      await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true, false)
      // 创建新的密钥
      await accountPage.createCloudKey(newPassword, true)
      // 等待密钥配置，加载, 等待推文页面出现
      await basePage.jumpPage('homeLink')
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await accountPage.syncCloudKey(newPassword, { isABPassword: true })
      // 等待密钥配置，加载，等待推荐页面出现
      await basePage.jumpPage('homeLink')
      // if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test('disable cloud key', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await window.waitForTimeout(5000)
      await accountPage.disableCloudKey()

      // 验证取消同步云端
      await basePage.signOut()
      // await basePage.signIn(name, accountPassword, true, false)
      // await accountPage.ckCard.waitFor()
      // await expect(accountPage.ckFromcloudChk).toHaveText(/Disable cloud storage/)
      // await basePage.clearLocalstorage()
      // await window.waitForTimeout(3000)
    })
    // 该功能已取消
    test.skip('create and save key in cloud', async () => {
      test.setTimeout(5 * 60000)
      await basePage.clearLocalstorage()
      await window.waitForTimeout(3000)
      await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true, false)
      // 创建新的密钥
      await accountPage.createCloudKey(inPassword, false, false)
      // 等待密钥配置，加载, 等待推荐页面出现
      await libraryPage.tweetsFrist.waitFor({ timeout: 60000 })

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, process.env.TEST_PASSWORD, true, false)
      await basePage.waitForAllHidden(await basePage.alert)
      // 验证密码错误
      await accountPage.syncCloudKey('1234567890', { isCorrectPassword: false })
      await accountPage.syncCloudKey(inPassword)
      // 等待密钥配置，加载，等待推荐页面出现
      await basePage.jumpPage('homeLink')
      await libraryPage.tweetsFrist.waitFor({ timeout: 60000 })
      await basePage.signOut()
    })
    // 该功能已取消
    test.skip('disable cloud key force', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await window.waitForTimeout(15000)
      await accountPage.disableCloudKey()

      // 验证取消同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.ckCard.waitFor()
      await expect(accountPage.ckFromcloudChk).toHaveText(/Disable cloud storage/)
      // await basePage.signOut()
      await basePage.clearLocalstorage()
      await window.waitForTimeout(3000)
    })
  })
  test.describe('aws password', () => {
    test('create and save key in cloud', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      await window.waitForTimeout(10000)
      if (await accountPage.recommendTitle.isVisible()) {
        await accountPage.recommendSelected()
      } else {
        await accountPage.recommendSelected()
        // await libraryPage.tweetsFrist.waitFor()
      }
      await accountPage.disableCloudKey()
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      // 创建新的密钥
      // await accountPage.createCloudKey('', false, true)
      await window.waitForTimeout(5000)
      if (await accountPage.recommendTitle.isVisible()) await accountPage.recommendSelected()
      // 等待密钥配置，加载, 等待推荐页面出现
      await window.waitForTimeout(5000)
      await accountPage.recommendSelected()
      // await basePage.recommendCard.click()
      // await basePage.recommendFollowOenBtn.click()

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载，等待推荐页面出现
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
    })
    test('update and save key in cloud', async () => {
      test.setTimeout(5 * 60000)
      await basePage.ensureLoginStatus(name, accountPassword, true, false)
      // 创建新的密钥
      await accountPage.createCloudKey('', true, true)
      // 等待密钥配置，加载, 等待推荐页面出现
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()

      // 验证同步云端功能
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载，等待推荐页面出现
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test.skip('change password', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await window.waitForTimeout(5000)
      await basePage.jumpPage('accountSettingLink')
      await accountPage.changePassword(accountPassword, accountResetPassword)

      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountResetPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(15000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
      await basePage.signOut()
    })
    test.skip('reset password', async () => {
      await window.waitForTimeout(3000)
      await accountPage.resetPassword(name, accountPassword)
      await basePage.waitForAllHidden(await basePage.alert)
      // 验证同步云端
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey('', { isABPassword: true })
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(10000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    // 若重置失败，手动修改密码
    // test('')
    test.skip('config password', async () => {
      await accountPage.cfgKeyPassword(accountPassword, accountResetPassword)

      // 验证同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      await accountPage.syncCloudKey(accountResetPassword)
      // 等待密钥配置，加载,等待推荐页面出现
      await window.waitForTimeout(5000)
      if (await libraryPage.recommendTitle.isVisible()) await libraryPage.recommendSelectedTest()
      await window.waitForTimeout(5000)
      if (!await basePage.recommendHandle()) await libraryPage.tweetsFrist.waitFor()
    })
    test('disable cloud key', async () => {
      await basePage.ensureLoginStatus(name, accountPassword, true, true)
      await basePage.waitForAllHidden(await basePage.alert)
      await accountPage.disableCloudKey()

      // 验证取消同步云端
      await basePage.signOut()
      await basePage.signIn(name, accountPassword, true, false)
      // await accountPage.ckCard.waitFor()
      await window.waitForTimeout(10000)
      if (await accountPage.recommendTitle.isVisible()) await libraryPage.recommendSelectedTest()
      // await basePage.jumpPage('accountSettingLink')
      // await expect(accountPage.ckFromcloudChk).toHaveText(/Disable cloud storage/)
      // await basePage.clearLocalstorage()
      // await window.waitForTimeout(3000)
    })
  })
})

test.describe('channel', () => {
  test.beforeEach(async ({ }, testInfo) => {
    test.skip()
    await window.waitForLoadState()
    await basePage.ensureLoginStatus(name, process.env.TEST_PASSWORD, true)
  })
  test.skip('save abk', async () => {
    await basePage.jumpPage('accountSettingLink')
    await accountPage.libraryKeyMoreBtn.click()
    await accountPage.exportKeyBtn.click()
    await accountPage.ekfCloudPasswordInput.fill(accountPassword)
    await accountPage.ekfKeyFilePasswordInput.fill(accountPassword)

    const [download] = await Promise.all([
      // Start waiting for the download
      window.waitForEvent('download'),
      // Perform the action that initiates download
      accountPage.ekfOKBtn.click()
    ])
    // Wait for the download process to complete
    console.log(await download.path())
    // Save downloaded file somewhere
    // await download.saveAs('/path/to/save/download/at.txt')
  })

  test.skip('Recommend page follow channel', async () => {
    // await libraryPage.getChannelCardEle('', 'card').nth(0).click()
    await basePage.jumpPage('exploreLink')
    let i = 0
    let previousI = 0
    while (1) {
      if (await libraryPage.locading.count()) await window.waitForTimeout(5000)
      let isBreak = false
      for (i; i < 5 + previousI; i++) {
        const CardText = await libraryPage.getPostCardEle('', 'card').nth(i).innerText()
        if (await CardText.includes('amazing')) {
          console.log('CardText:' + CardText)
          await libraryPage.toChannelCardEle(i)
          await window.waitForTimeout(5000)
          isBreak = true
          break
        }
      }
      if (isBreak) break
      previousI = i
      await libraryPage.scrollToLoadPage(0, 8000, '.virtual-scroll-grid')
      await window.waitForTimeout(2000)
    }

    await libraryPage.channelFollowsBtn.click()
    await window.waitForTimeout(3000)
    if (await basePage.unfollowBtn.isVisible()) await libraryPage.cancel.click()
    await window.waitForTimeout(3000)
    // await expect(libraryPage.showMoreBtn).toHaveCount(0)
    await basePage.jumpPage('followingLink')
    await window.waitForTimeout(3000)
    await libraryPage.checkFollowCard(checkName).waitFor({ timeout: 120000 })
  })
  test('Recommend page follow channel (simplified version)', async () => {
    // await libraryPage.getChannelCardEle('', 'card').nth(0).click()
    await window.waitForTimeout(20000)
    await basePage.recommendHandle()
    await basePage.jumpPage('exploreLink')

    for (let i = 0; i < 5; i++) {
      const CardText = await libraryPage.getPostCardEle('', 'channelTitleEle').nth(i).innerText()
      console.log(`CardText[${i}]:` + CardText)
      if (i === 4) checkName = CardText
      await window.waitForTimeout(1000)
    }
    await libraryPage.scrollToLoadPage(0, 8000, '.virtual-scroll-grid')
    if (await libraryPage.locading.count()) await window.waitForTimeout(5000)
    await libraryPage.toChannelCardEle(4)
    await window.waitForTimeout(2000)

    await libraryPage.channelFollowsBtn.click()
    await window.waitForTimeout(3000)
    if (await basePage.unfollowBtn.isVisible()) await libraryPage.cancel.click()
    await window.waitForTimeout(3000)
    // await expect(libraryPage.showMoreBtn).toHaveCount(0)
    await basePage.jumpPage('followingLink')
    await window.waitForTimeout(3000)
    await libraryPage.checkFollowCard(checkName)
  })
  test('clear env', async ({ }, testInfo) => {
    await basePage.jumpPage('homeLink')
    await libraryPage.searchChannelBtn.waitFor({ timeout: 120000 })
    await window.screenshot({ path: `${ScreenshotsPath}homepage-status-retry-${testInfo.retry}.png` })

    await homePage.clearTask()

    // 关闭推荐页面
    await basePage.jumpPage('basicLink')
    const exploreChk = await basicPage.showExploreChk
    const isOpenExplore = await exploreChk.getAttribute('aria-checked')
    console.log('aria-checked', isOpenExplore)
    if (isOpenExplore === 'true') {
      await exploreChk.click()
      await basicPage.saveSetting()
    }
    expect(await basePage.exploreLink).toHaveCount(0)
    // 清空本地收藏
    await basePage.jumpPage('localFavoritesLink')
    await window.waitForTimeout(1000)
    const starBtn = await window.locator('button:has-text("star") i')
    const starBtnCount = await starBtn.count()
    for (let i = 0; i < starBtnCount; i++) {
      await starBtn.nth(0).click()
    }
    await basePage.waitForAllHidden(await basePage.centerAlert)
  })
  test('set card mode', async () => {
    await basePage.jumpPage('downloadingStatus')
    try {
      await homePage.downRemoveAllBtn.waitFor({ timeout: 5000 })
    } catch (e) {
      await basePage.jumpPage('downloadingStatus')
    }
    // 确保切换到卡片模式
    const cardMode = await homePage.toggleCardModeBtn
    if (await cardMode.isVisible()) {
      await cardMode.click()
    }
    await window.waitForLoadState()
  })
  test('save key to json', async () => {
    const newTime = new Date()
    await channelTest(newTime)
    const keyPath = ScreenshotsPath + `\\key-${newTime.getTime()}.json`
    const localStorageData = await window.evaluate(() => {
      return JSON.stringify(localStorage.getItem('library-pair@ab-test-cate-v4-2'))
    })
    await fs.writeFileSync(keyPath, localStorageData)
  })

  test('open explore page', async () => {
    await basePage.jumpPage('basicLink')
    const exploreChk = await basicPage.showExploreChk
    const isOpenExplore = await exploreChk.getAttribute('aria-checked')
    console.log('aria-checked', isOpenExplore)
    if (isOpenExplore === 'false') {
      await exploreChk.click()
      await basicPage.saveSetting()
    }
    if (await basePage.downloadingStatus.isHidden()) await basePage.menuIcon.click()
    await basePage.exploreLink.waitFor({ timeout: 60000 })
    await basePage.jumpPage('exploreLink')
    await libraryPage.getPostCardEle('', 'channelTitleEle').nth(0).waitFor({ timeout: 60000 })
  })

  test('add channel', async () => {
    await basePage.jumpPage('editLink')
    try {
      await libraryPage.addChannelBtn.waitFor({ timeout: 5000 })
    } catch (e) {
      await basePage.jumpPage('editLink')
    }
    // 判断是否添加了频道
    const isAddChannel = await libraryPage.getChannelCardEle(channelObj.title, 'card').count()
    console.log('isAddChannel', isAddChannel)
    if (!isAddChannel) await libraryPage.addChannel(channelObj)
    await libraryPage.ensureChannelCard(channelObj.title, 'visible')
  })

  test('add post', async () => {
    await basePage.jumpPage('editLink')
    await window.waitForTimeout(5000)
    const editChannelBtn = await libraryPage.editChannelCard(channelObj.title, 'editChannelBtn')
    await editChannelBtn.click()
    // 添加第一个
    const isAddPost1 = await libraryPage.getPostListEle(postObj.title, 'titleEle').isVisible()
    console.log('isAddPost', isAddPost1)
    if (!isAddPost1) {
      await libraryPage.addPost(postObj)
      await window.waitForTimeout(3000)
      await libraryPage.ensurePostList(postObj)
    }
    // 添加第二个
    const isAddPost2 = await libraryPage.getPostListEle(postObj2.title, 'titleEle').isVisible()
    console.log('isAddPost2', isAddPost2)
    if (!isAddPost2) {
      await libraryPage.addPost(postObj2)
      await window.waitForTimeout(3000)
      await libraryPage.ensurePostList(postObj2)
    }
    // 添加第三个
    const isAddPost3 = await libraryPage.getPostListEle(postObj3.title, 'titleEle').isVisible()
    console.log('isAddPost3', isAddPost3)
    if (!isAddPost3) {
      await libraryPage.addPost(postObj3)
      await window.waitForTimeout(3000)
      await libraryPage.ensurePostList(postObj3)
    }

    await libraryPage.ecCloseBtn.click()
    // 等待频道创建
    await window.waitForTimeout(10000)
  })
  test('edit user profile', async () => {
    // 修改
    const userName = 'LLLL的库'
    const desc = 'This is LLLL\'s library'
    await basePage.jumpPage('accountSettingLink')
    await accountPage.editUserBtn.click()
    await accountPage.eupCard.waitFor()
    await accountPage.eupNicknameInput.fill(userName)
    await accountPage.eupDescInput.fill(desc)
    await accountPage.eupSubmitBtn.click()
    await accountPage.eupOKBtn.waitFor()
    await accountPage.eupOKBtn.click()
    // 验证
    const regex = new RegExp(userName)
    const descRegex = new RegExp(desc)
    await basePage.jumpPage('editLink')
    await libraryPage.getChannelCardEle(channelObj.title, 'previewBtn').click()
    await window.waitForTimeout(5000)
    await libraryPage.previewHead.waitFor()
    await expect(libraryPage.cdCreatorTitle).toHaveText(regex)

    // 主页
    await basePage.jumpPage('homeLink')
    await window.waitForTimeout(3000)
    while (1) {
      const remain = await libraryPage.getPostCardEle(postObj.title, 'channelTitleEle')
      if (await remain.nth(0).isVisible()) {
        await remain.nth(0).click()
        break
      }
      await libraryPage.scrollToLoadPage(0, 6000, '.virtual-scroll-grid')
    }
    await window.waitForTimeout(5000)
    await expect(libraryPage.cdCreatorTitle).toHaveText(regex)

    // 关注
    await basePage.jumpPage('followingLink')
    await window.waitForTimeout(3000)
    await libraryPage.getChannelCardEle(channelObj.title, 'card').click()
    await window.waitForTimeout(5000)
    await expect(libraryPage.cdCreatorTitle).toHaveText(regex)

    // 频道详细进入个人主页
    await libraryPage.cdCreatorTitle.click()
    await window.waitForTimeout(3000)
    await libraryPage.checkNavBar(userName)
    await libraryPage.udCard.waitFor()
    await expect(libraryPage.udCreatorTitle).toHaveText(regex)
    await expect(libraryPage.udCreatorDesc).toHaveText(descRegex)
    await libraryPage.getChannelCardEle(channelObj.title, 'card').waitFor()
  })
  test.describe('check', () => {
    test.beforeEach(async ({ }, testInfo) => {
      test.skip()
      // 获取需要检查的信息
      if (!channelObj.channelID) {
        await basePage.jumpPage('editLink')
        const channelIDText = await libraryPage.getChannelCardEle(channelObj.title, 'channelIDEle').innerText()
        channelObj.channelID = channelIDText.replace('ID: ', '').replace(' content_copy', '')
      }
    })

    test('preview channel', async () => {
      await basePage.jumpPage('editLink')
      await window.waitForTimeout(5000)
      // 检查 预览频道页面 channel-header
      await libraryPage.getChannelCardEle(channelObj.title, 'previewBtn').click()
      await libraryPage.previewHead.waitFor()
      await window.waitForTimeout(5000)

      await libraryPage.ensureChannelHeader(channelObj)
      // 检查 预览频道页面 post-card
      await libraryPage.ensurePostCard(postObj)
    })
    test('home page', async () => {
      await basePage.jumpPage('homeLink')
      await basePage.waitForAllHidden(await basePage.centerAlert)
      await libraryPage.scrollToLoadPage()
      await window.waitForTimeout(5000)
      await libraryPage.ensurePostCard(postObj, { page: 'homeLink', favorite: true })
      const channelTitle = await libraryPage.getPostCardEle(postObj.title, 'channelTitleEle')
      const channelTitleText = await channelTitle.innerText()
      expect(channelTitleText).toBe(channelObj.title)
      const channelFollowBtn = await libraryPage.getPostCardEle(postObj.title, 'followBtn').innerText()
      expect(channelFollowBtn).toBe('FOLLOWING')
      await basePage.waitForAllHidden(await basePage.centerAlert)
      // 从主页进入频道详细页面
      await channelTitle.click()
      await libraryPage.checkNavBar(channelObj.title)
      await libraryPage.ensureChannelHeader(channelObj)
      await libraryPage.ensurePostCard(postObj)

      await basePage.jumpPage('homeLink')
      await basePage.waitForAllHidden(await basePage.centerAlert)
      await window.waitForTimeout(5000)
      await libraryPage.searchChannelBtn.click()
      await libraryPage.sciInput.fill(channelObj.channelID)
      await libraryPage.sciSearchBtn.click()
      await libraryPage.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
      const followBtn = await libraryPage.getChannelCardEle(channelObj.title, 'followBtn', 'sci')
      await followBtn.waitFor()
      const followBtnText = await followBtn.innerText()
      await expect(followBtnText).toBe('FOLLOWING')

      // 从主页的搜索卡片进入频道详细页面
      await libraryPage.getChannelCardEle(channelObj.title, 'card', 'sci').click()
      await libraryPage.checkNavBar(channelObj.title)
      await libraryPage.ensureChannelHeader(channelObj)
      await libraryPage.ensurePostCard(postObj)
    })
    test('follow channel', async () => {
      await basePage.jumpPage('followingLink')
      await basePage.waitForAllHidden(await basePage.centerAlert)
      await window.waitForTimeout(5000)
      await libraryPage.ensureChannelCard(channelObj.title, 'visible')
      const followBtnA = await libraryPage.getChannelCardEle(channelObj.title, 'followBtn')
      await followBtnA.waitFor()
      const followBtnAText = await followBtnA.innerText()
      await expect(followBtnAText).toBe('FOLLOWING')

      // 从关注页面进入频道详细页面
      await libraryPage.getChannelCardEle(channelObj.title, 'card').click()

      await libraryPage.checkNavBar(channelObj.title)
      await libraryPage.ensureChannelHeader(channelObj)
      await libraryPage.ensurePostCard(postObj)
      // 查询频道
      await basePage.jumpPage('followingLink')
      await basePage.waitForAllHidden(await basePage.centerAlert)
      await window.waitForTimeout(5000)
      await libraryPage.searchChannelBtn.click()
      await libraryPage.sciInput.fill(channelObj.channelID)
      await libraryPage.sciSearchBtn.click()
      await libraryPage.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
      const followBtnB = await libraryPage.getChannelCardEle(channelObj.title, 'followBtn', 'sci')
      await followBtnB.waitFor()
      const followBtnBText = await followBtnB.innerText()
      await expect(followBtnBText).toBe('FOLLOWING')

      // 从关注的搜索卡片进入频道详细页面
      await libraryPage.getChannelCardEle(channelObj.title, 'card', 'sci').click()
      await libraryPage.checkNavBar(channelObj.title)
      await libraryPage.ensureChannelHeader(channelObj)
      await libraryPage.ensurePostCard(postObj)
    })
    test('local favorites', async () => {
      await basePage.jumpPage('homeLink')
      await libraryPage.scrollToLoadPage()
      const starBtn = await libraryPage.getPostCardEle(postObj.title, 'starBtn')
      const starBtnText = await starBtn.innerText()
      if (starBtnText === 'star_border') await starBtn.click()

      await basePage.jumpPage('localFavoritesLink')
      await window.waitForTimeout(1000)
      await libraryPage.getPostCardEle(postObj.title, 'starBtn').waitFor()
      expect(await libraryPage.getPostCardEle(postObj.title, 'starBtn').innerText()).toBe('star')
    })
    test('download and player', async () => {
      await homePage.clearTask()
      // 获取下载任务数
      await basePage.jumpPage('downloadingStatus')
      const initDownloadStatusText = await basePage.downloadingStatus.innerText()
      const initDownloadingNumMatch = initDownloadStatusText.match(/\d+/)
      let initDownloadingNum = 0
      if (initDownloadingNumMatch !== null) {
        initDownloadingNum = parseInt(initDownloadingNumMatch[0])
      }
      console.log('initDownloadingNum', initDownloadingNum)
      // 下载
      await basePage.jumpPage('homeLink')
      const downloadBtn = await libraryPage.getPostCardEle(postObj.title, 'downloadBtn')
      // await expect(downloadBtn).toHaveText(/Download/)
      await downloadBtn.click()
      // await libraryPage.getPostCardEle(postObj.title, 'playBtn').click()
      // await playerPage.controlBar.waitFor({ timeout: 40000 })

      // 验证下载任务卡片、下载任务数量
      // await basePage.jumpPage('downloadingStatus')
      // await homePage.getCard(postObj.title).waitFor('visible')
      // const downloadStatusText = await basePage.downloadingStatus.innerText()
      // const downloadingNumMatch = downloadStatusText.match(/\d+/)
      // let downloadingNum = 0
      // if (downloadingNumMatch !== null) {
      //   downloadingNum = parseInt(downloadingNumMatch[0])
      // }
      // expect(downloadingNum).toBe(initDownloadingNum + 1)

      // await basePage.jumpPage('homeLink')
      // await expect(await libraryPage.getPostCardEle(postObj.title, 'downloadBtn')).toHaveText(/Downloading|doneCompleted/)
      // 边下边播
      // const playingBtn = await libraryPage.getPostCardEle(postObj.title, 'playBtn')
      // await expect(playingBtn).toHaveText(/Play\.\.\.|play_arrowPlay/)
      // await playingBtn.click()
      // await playerPage.controlBar.waitFor({ timeout: 40000 })

      // 等待下载完成
      await basePage.jumpPage('downloadingStatus')
      await basePage.waitForAllHidden(await homePage.allCard, 60000)

      // 验证下载完成的推文按钮文字
      await basePage.jumpPage('homeLink')
      // await expect(await libraryPage.getPostCardEle(postObj.title, 'downloadBtn')).toHaveText(/Completed/)
      // await expect(await libraryPage.getPostCardEle(postObj.title, 'playBtn')).toHaveText(/play_arrow/)

      // 验证聚焦任务卡片
      await libraryPage.getPostCardEle(postObj.title, 'downloadBtn').click()
      await homePage.getCard(postObj.title).waitFor('visible')

      // 验证播放按钮
      await basePage.jumpPage('homeLink')
      await libraryPage.getPostCardEle(postObj.title, 'playBtn').click()
      await playerPage.stopPlay.waitFor({ timeout: 40000 })
    })
    test('download to library', async () => {
      await basePage.jumpPage('uploadingStatus')
      await homePage.getCardEle(postObj.title, 'libraryBtn').click()
      // 验证弹出推文卡片
      await libraryPage.getPostCardEle(postObj.title, 'card').waitFor()
      await libraryPage.ensurePostCard(postObj)
      // 验证从推文卡片跳转到频道详细页面
      await libraryPage.getPostCardEle(postObj.title, 'channelTitleEle').click()
      await libraryPage.checkNavBar(channelObj.title)
      await libraryPage.ensureChannelHeader(channelObj)
      await libraryPage.ensurePostCard(postObj)
    })
    test.describe('copy', async () => {
      test('postCard', async () => {
        await basePage.jumpPage('homeLink')
        await basePage.waitForAllHidden(await basePage.centerAlert)
        await window.waitForTimeout(5000)
        // 复制分享频道链接
        await libraryPage.getPostCardEle(postObj.title, 'moreBtn').click()
        await libraryPage.mmShareBtn.click()
        await window.waitForTimeout(500)
        await libraryPage.copiedAlert.waitFor('visible')
        // 检查各个页面触发复制
        await libraryPage.checkShareLink('homeLink', channelObj.title, { isCloseDialog: false })
        await libraryPage.checkShareLink('followingLink', channelObj.title)
        await libraryPage.checkShareLink('localFavoritesLink', channelObj.title)
        await libraryPage.checkShareLink('exploreLink', channelObj.title)
        await window.waitForTimeout(5000)
        await libraryPage.checkShareLink('editLink', channelObj.title)
        await libraryPage.checkShareLink('downloadingStatus', channelObj.title)
        await libraryPage.checkShareLink('uploadingStatus', channelObj.title)
        await libraryPage.checkShareLink('downloadedStatus', channelObj.title)
        await libraryPage.checkShareLink('playerLink', channelObj.title)
        await libraryPage.checkShareLink('creditsLink', channelObj.title)
        await libraryPage.checkShareLink('accountSettingLink', channelObj.title)
        await libraryPage.checkShareLink('basicLink', channelObj.title)
        await libraryPage.checkShareLink('advancedLink', channelObj.title)
      })
      test('channelHeader', async () => {
        await basePage.jumpPage('homeLink', '', false)
        await basePage.waitForAllHidden(await basePage.centerAlert)
        await window.waitForTimeout(5000)
        await libraryPage.getPostCardEle(postObj.title, 'channelTitleEle').click()
        // 复制分享频道链接
        await libraryPage.cdshareBtn.click({ timeout: 10000 })
        await window.waitForTimeout(2000)
        await basePage.waitForAllHidden(await basePage.centerAlert)
        // 检查各个页面触发复制
        await libraryPage.checkShareLink('homeLink', channelObj.title, { isCloseDialog: false })
      })
      test('local favorites', async () => {
        await basePage.jumpPage('localFavoritesLink')
        // 复制分享频道链接
        await libraryPage.getPostCardEle(postObj.title, 'moreBtn').click()
        await libraryPage.mmShareBtn.click()
        await window.waitForTimeout(500)
        await libraryPage.copiedAlert.waitFor('visible')
        // 检查触发复制
        await libraryPage.checkShareLink('homeLink', channelObj.title, { isCloseDialog: false })
      })
      test('download card', async () => {
        await basePage.jumpPage('uploadingStatus')
        const isCardMode = await homePage.toggleCardModeBtn.isVisible()
        if (isCardMode) {
          await homePage.toggleCardModeBtn.click()
          expect(await homePage.toggleCardModeBtn).toHaveCount(0)
        }
        await homePage.getCardEle(postObj.title, 'libraryBtn').click()
        // 验证弹出推文卡片
        await libraryPage.getPostCardEle(postObj.title, 'card').waitFor()
        await libraryPage.getPostCardEle(postObj.title, 'moreBtn').click()
        await libraryPage.mmShareBtn.click()
        await window.waitForTimeout(500)
        await libraryPage.copiedAlert.waitFor('visible')
        await homePage.searchBtn.click({ force: true })
        // 检查触发复制
        await libraryPage.checkShareLink('homeLink', channelObj.title, { isCloseDialog: false })
      })
    })
    test('set private channel', async () => {
      await basePage.jumpPage('editLink')
      await window.waitForTimeout(5000)

      await libraryPage.getChannelCardEle(channelObj.title, 'channelSettingBtn').click()
      const isOpenPrivate = await libraryPage.acPrivateChk.getAttribute('aria-checked')
      console.log('aria-checked', isOpenPrivate)
      if (isOpenPrivate === 'false') {
        await libraryPage.acPrivateChk.click()
      }
      await libraryPage.channelSettingSubmitBtn.click()
      // publish页面
      await libraryPage.getChannelCardEle(channelObj.title, 'privateChannelTag').waitFor({ timeout: 30000 })
      // 主页
      await basePage.jumpPage('homeLink')
      await window.waitForTimeout(5000)
      // expect(await libraryPage.getPostCardEle(postObj.title, 'channel')).toHaveText(/Private channel/)
      // 主页搜索频道功能
      await libraryPage.searchChannelID(privateChannel, true)
      await libraryPage.sciCloseBtn.click()
      // 关注页面
      await basePage.jumpPage('followingLink')
      await window.waitForTimeout(5000)
      await libraryPage.getChannelCardEle(channelObj.title, 'privateChannelTag').waitFor({ timeout: 30000 })
      // 关注页面搜索频道功能
      await libraryPage.searchChannelID(privateChannel, true)
      // 频道详细页面
      await libraryPage.getChannelCardEle(privateChannel.title, 'card', 'sci').click()
      await libraryPage.checkNavBar(privateChannel.title)
      await libraryPage.ensureChannelHeader(privateChannel, { followStatus: 'FOLLOW' })
      // 验证tag
      await libraryPage.cdPrivateChannelTag.waitFor({ timeout: 30000 })
      // 创建者页面
      await libraryPage.cdCreatorTitle.click()
      await window.waitForTimeout(3000)
      await libraryPage.udCard.waitFor()
      await libraryPage.searchCreatorChannel(privateChannel, true)
      // 探索页面搜索
      await basePage.jumpPage('exploreLink')
      // 等待推荐页加载
      await libraryPage.getPostCardEle('', 'channelTitleEle').nth(0).waitFor()
      await libraryPage.searchChannelID(privateChannel, true)
      await libraryPage.sciCloseBtn.click()

      // 关闭私人频道
      await basePage.jumpPage('editLink')
      await window.waitForTimeout(5000)
      await libraryPage.getChannelCardEle(channelObj.title, 'channelSettingBtn').click()
      await libraryPage.acPrivateChk.click()
      await libraryPage.channelSettingSubmitBtn.click()
      await window.waitForTimeout(3000)
      // 验证私有频道关闭
      expect(await libraryPage.getChannelCardEle(channelObj.title, 'privateChannelTag')).toHaveCount(0)
      // 主页
      await basePage.jumpPage('homeLink')
      await window.waitForTimeout(5000)
      // expect(await libraryPage.getPostCardEle(postObj.title, 'channel')).not.toHaveText(/Private channel/)
      // 主页搜索频道功能
      await libraryPage.searchChannelID(channelObj, false)
      await libraryPage.sciCloseBtn.click()
      // 关注页面
      await basePage.jumpPage('followingLink')
      await window.waitForTimeout(5000)
      expect(await libraryPage.getChannelCardEle(channelObj.title, 'privateChannelTag')).toHaveCount(0)
      // 关注页面搜索频道功能
      await libraryPage.searchChannelID(channelObj, false)
      // 频道详细页面
      await libraryPage.getChannelCardEle(channelObj.title, 'card', 'sci').click()
      await libraryPage.checkNavBar(channelObj.title)
      await libraryPage.ensureChannelHeader(channelObj)
      expect(await libraryPage.cdPrivateChannelTag).toHaveCount(0)
      // 创建者页面
      await libraryPage.cdCreatorTitle.click()
      await window.waitForTimeout(3000)
      await libraryPage.udCard.waitFor()
      await libraryPage.searchCreatorChannel(channelObj, false)
    })
    test('block channel', async () => {
      // 如果未拉黑,拉黑
      await basePage.jumpPage('followingLink')
      await window.waitForTimeout(5000)
      const descText = await libraryPage.getChannelCardEle(channelObj.title, 'descEle').innerText()
      if (!descText.includes('Blocked')) {
        await libraryPage.getChannelCardEle(channelObj.title, 'card').click()
        await window.waitForTimeout(5000)
        await libraryPage.getPostCardEle(postObj.title, 'moreBtn').click()
        await window.waitForTimeout(500)
        if (!await libraryPage.unBlockBtn.count()) {
          await libraryPage.mmBlockChannelBtn.click()
          await window.waitForTimeout(500)
          await libraryPage.bcBlockBtn.click()
        }
        await libraryPage.cdBlockedTag.waitFor()
      }
      // 主页屏蔽，关注页标记，编辑页标记，搜索页标记
      await basePage.jumpPage('homeLink')
      await libraryPage.scrollToLoadPage()
      await expect(libraryPage.getChannelCardEle(channelObj.title, 'card')).toHaveCount(0)
      await basePage.jumpPage('followingLink')
      await window.waitForTimeout(5000)
      await libraryPage.getChannelCardEle(channelObj.title, 'blockedTag').waitFor()
      await libraryPage.searchChannelBtn.click()
      await libraryPage.sciInput.fill(channelObj.channelID)
      await libraryPage.sciSearchBtn.click()
      await libraryPage.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
      await libraryPage.getChannelCardEle(channelObj.title, 'blockedTag', 'sci').waitFor()
      await libraryPage.sciCloseBtn.click()

      await basePage.jumpPage('editLink')
      await window.waitForTimeout(5000)
      await libraryPage.getChannelCardEle(channelObj.title, 'blockedTag').waitFor()
      // 账号设置，验证黑名单 恢复
      await basePage.jumpPage('accountSettingLink')
      await accountPage.BlockListBtn.click()
      await window.waitForTimeout(5000)
      await accountPage.getBlockListCloseBtn(channelObj.title).click()
      await accountPage.allBlockCloseBtn()
      await accountPage.NoBlockChannel.waitFor()
      // await accountPage.BlockListCancelBtn.click()
      await accountPage.clickViewport(100, 100)

      // 验证关注页，主页，编辑页标记，搜索页标记
      await basePage.jumpPage('homeLink')
      await libraryPage.scrollFindTarget(postObj.title, 'postTitle', 'getPostCardEle')

      await basePage.jumpPage('followingLink')
      await window.waitForTimeout(5000)
      await expect(libraryPage.getChannelCardEle(channelObj.title, 'blockedTag')).toHaveCount(0)
      await libraryPage.searchChannelBtn.click()
      await libraryPage.sciInput.fill(channelObj.channelID)
      await libraryPage.sciSearchBtn.click()
      await libraryPage.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
      await expect(libraryPage.getChannelCardEle(channelObj.title, 'blockedTag', 'sci')).toHaveCount(0)
      await libraryPage.sciCloseBtn.click()

      await basePage.jumpPage('editLink')
      await window.waitForTimeout(5000)
      await expect(libraryPage.getChannelCardEle(channelObj.title, 'blockedTag')).toHaveCount(0)
    })
    // 从各个卡片取关频道
    test('unfollow', async () => {
      test.beforeEach(async ({ }, testInfo) => {
        // 编辑页面检查是否关注
        await libraryPage.checkChannelFollowStatus(channelObj.title)
      })

      test('channel header', async () => {
        await basePage.jumpPage('homeLink')
        await libraryPage.scrollToLoadPage()
        // 进入频道详细页面
        await libraryPage.scrollFindTarget(postObj.title, 'channelTitleEle', 'getPostCardEle')
        await libraryPage.getPostCardEle(postObj.title, 'channelTitleEle').click()
        const cdFollowBtn = await libraryPage.cdFollowBtn
        // expect(await cdFollowBtn.innerText()).toBe('FOLLOWING')
        // 取关
        await cdFollowBtn.click()
        await libraryPage.ucUnfollowBtn.click()
        await window.waitForTimeout(3000)
        // expect(await libraryPage.cdFollowBtn.innerText()).toBe('FOLLOW')

        // 验证取关频道
        await libraryPage.checkUnfollowChannel(channelObj, postObj)
      })
      test('download task', async () => {
        await basePage.jumpPage('uploadingStatus')
        await homePage.getCardEle(postObj.title, 'libraryBtn').click()
        // 验证弹出推文卡片
        await libraryPage.getPostCardEle(postObj.title, 'card').waitFor()
        const followBtn = await libraryPage.getPostCardEle(postObj.title, 'followBtn')
        // expect(await followBtn.innerText()).toBe('FOLLOWING')
        // 取关
        await followBtn.click()
        await libraryPage.ucUnfollowBtn.click()
        // 退出卡片
        await window.waitForTimeout(2000)
        await homePage.searchBtn.click({ force: true })

        // 验证取关频道
        await libraryPage.checkUnfollowChannel(channelObj, postObj)
      })
      test('channel card', async () => {
        // 取关
        await libraryPage.unfollowChannel('followingLink', channelObj.title, 'followBtn', 'ChannelCard')
        await window.waitForTimeout(3000)
        // 验证取关频道
        await libraryPage.checkUnfollowChannel(channelObj, postObj)
      })
      test('poster card', async () => {
        // 取关
        await libraryPage.unfollowChannel('homeLink', postObj.title, 'followBtn', 'PostCard')
        // 验证取关频道
        await libraryPage.checkUnfollowChannel(channelObj, postObj, false)
      })
      test('local favorites', async () => {
        await basePage.jumpPage('homeLink')
        await window.waitForTimeout(3000)
        await libraryPage.scrollFindTarget(postObj.title, 'channelTitleEle', 'getPostCardEle')
        await libraryPage.getPostCardEle(postObj.title, 'card').waitFor()
        // 取关
        await libraryPage.unfollowChannel('localFavoritesLink', postObj.title, 'followBtn', 'PostCard')
        await window.waitForTimeout(3000)
        // expect(await libraryPage.getPostCardEle(postObj.title, 'followBtn').innerText()).toBe('FOLLOW')

        // 验证取关频道
        await libraryPage.checkUnfollowChannel(channelObj, postObj)
      })
    })
    test('explore search', async () => {
      test.setTimeout(5 * 60000)
      // 查询探索页第五个推文
      await basePage.jumpPage('exploreLink')
      await libraryPage.checkNavBar('Explore', { timeout: 3000 })
      // 等待推荐页加载
      await libraryPage.getPostCardEle('', 'channelTitleEle').nth(0).waitFor()
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
      // 推文标题查找
      for (let j = 0; j < postArr.length; j++) {
        await libraryPage.searchInput.fill(postArr[j].title)
        await window.waitForTimeout(2000)
        const postNum = await libraryPage.getPostCardEle('', 'postTitle').count()
        for (let i = 0; i < postNum; i++) {
          const postTitle = await libraryPage.getPostCardEle('', 'postTitle').nth(i).innerText()
          if (postTitle !== postArr[j].title && !postTitle.startsWith('Post title')) throw new Error('标题查找出现错误:' + postTitle)
        }
        const postLen = await libraryPage.getPostCardEle(postArr[j].title, 'postTitle').count()
        await libraryPage.postArrFaitFor(postArr[j].title, 'postTitle', postLen)
      }
      // 频道标题查找
      await libraryPage.searchCbo.click()
      await window.locator('text=Channel title').click()
      await libraryPage.searchInput.fill(postArr[0].channelTitle)
      await window.waitForTimeout(3000)
      const postNum = await libraryPage.getPostCardEle('', 'channelTitleEle').count()
      for (let i = 0; i < postNum; i++) {
        const postChannelTitle = await libraryPage.getPostCardEle('', 'channelTitleEle').nth(i).innerText()
        expect(postChannelTitle).toBe(postArr[0].channelTitle)
      }
    })
  })
  test('delete post', async () => {
    // 编辑页面检查是否关注
    await libraryPage.checkChannelFollowStatus(channelObj.title)
    await window.waitForTimeout(15000)
    await basePage.jumpPage('editLink')
    // 删除第二个推文
    await window.waitForTimeout(5000)
    const editChannelBtn = await libraryPage.getChannelCardEle(channelObj.title, 'editChannelBtn')
    await editChannelBtn.click()
    await window.waitForTimeout(5000)
    // 判断第二个推文是否删除
    await window.waitForTimeout(5000)
    const isAddPost2 = await libraryPage.getPostListEle(postObj2.title, 'titleEle').isVisible()
    console.log('isAddPost', isAddPost2)
    if (isAddPost2) {
      await libraryPage.getPostListEle(postObj2.title, 'deletePostBtn').click()
      await libraryPage.removePostBtn.click()
    }
    await window.waitForTimeout(5000)
    // 验证第二个推文消失
    expect(await libraryPage.getPostListEle(postObj2.title, 'deletePostBtn')).toHaveCount(0)
    await libraryPage.ecCloseBtn.click()
    // 主页
    await basePage.jumpPage('homeLink')
    await libraryPage.scrollToLoadPage()
    await window.waitForTimeout(5000)
    await expect(libraryPage.getPostCardEle(postObj2.title, 'postTitle')).toHaveCount(0)
    // 频道详细
    await libraryPage.getPostCardEle(postObj.title, 'channelTitleEle').click()
    await window.waitForTimeout(5000)
    await expect(libraryPage.getPostCardEle(postObj2.title, 'postTitle')).toHaveCount(0)
  })
  test('remove channel', async () => {
    await basePage.jumpPage('editLink')
    await window.waitForTimeout(5000)
    // 若频道没有删除 保存频道id，删除频道，查找频道
    await libraryPage.getChannelCardEle(channelObj.title, 'card').waitFor({ timeout: 5000 })
    // const channelIDText = await libraryPage.getChannelCardEle(channelObj.title, 'channelIDEle').innerText()
    // const channelID = channelIDText.replace('ID: ', '').replace(' content_copy', '')
    await libraryPage.getChannelCardEle(channelObj.title, 'removeChannelBtn').click()
    await libraryPage.removeChannelBtn.click()
    // 编辑页 频道消失
    await window.waitForTimeout(3000)
    await expect(libraryPage.getChannelCardEle(channelObj.title, 'card')).toHaveCount(0)
    // 验证主页 推文卡片消失
    await basePage.jumpPage('homeLink')
    await window.waitForTimeout(5000)
    await expect(libraryPage.getPostCardEle(postObj.title, 'postTitle')).toHaveCount(0)
    // 验证关注页 频道消失
    await basePage.jumpPage('followingLink')
    await window.waitForTimeout(5000)
    await expect(libraryPage.getChannelCardEle(channelObj.title, 'card')).toHaveCount(0)
    await window.waitForTimeout(60000 * 2)
  })
})
