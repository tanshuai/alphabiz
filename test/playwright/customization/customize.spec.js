const { test, expect } = require('@playwright/test')
const { _electron: electron } = require('playwright')
const path = require('path')
const fs = require('fs')

const { modifyVersion, getminversions, getUpdatableVersion } = require('../../utils/modifyVersion')
const electronMainPath = require('../../../test.config.js').electronMainPath
const testcfg = require('./testcfg')
let window, windows, electronApp, basePage, homePage, playerPage, creditsPage, basicPage, accountPage, walletPage, libraryPage, developmentPage

const { BasePage } = require('../models/basePage')
const { HomePage } = require('../models/homePage')
const { PlayerPage } = require('../models/playerPage')
const { CreditsPage } = require('../models/creditsPage')
const { BasicPage } = require('../models/basicPage')
const { AccountPage } = require('../models/accountPage')
const { WalletPage } = require('../models/walletPage')
const { LibraryPage } = require('../models/libraryPage')
const { DevelopmentPage } = require('../models/developmentPage')
const appconfig = require('../../../developer/app.js')
const ScreenshotsPath = 'test/output/playwright/customize.spec/'
let currentVersion
let from
let to
if (process.platform === 'win32') {
  from = 'test1'
  to = 'test2'
} else if (process.platform === 'linux') {
  from = 'test3'
  to = 'test4'
} else {
  from = 'test5'
  to = 'test6'
}
from = from + process.env.TEST_EMAIL_DOMAIN
to = to + process.env.TEST_EMAIL_DOMAIN
const testBt = {
  btName: 'uTorrent Web Tutorial Video',
  magnetLink: 'magnet:?xt=urn:btih:61b3b8856c4839edf51f5c2346599b6bec524145'
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
    if (await win.title() === appconfig.displayName) window = win
  }
  // new Pege Object Model
  basePage = new BasePage(window)
  homePage = new HomePage(window)
  playerPage = new PlayerPage(window)
  creditsPage = new CreditsPage(window)
  basicPage = new BasicPage(window)
  accountPage = new AccountPage(window)
  libraryPage = new LibraryPage(window)
  walletPage = new WalletPage(window)
  developmentPage = new DevelopmentPage(window)

  const version = await basePage.versionBtn.innerText()
  currentVersion = version.replace(/^v/, '')
  if (version.includes('internal')) {
    modifyVersion({ version: currentVersion.replace('internal', 'nightly') })
    await basePage.newReload()
  }
})
test.afterAll(async () => {
  await electronApp.close()
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

test.describe('custom', () => {
  test.beforeEach(async () => {
    if (process.platform === 'darwin') test.setTimeout(60000 * 5)
    else test.setTimeout(60000 * 3)
    await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
  })
  test('app name', async () => {
    const appTitle = await basePage.appBarTitle.innerText()
    console.log('appTitle: ', appTitle)
    expect(appTitle).toBe(testcfg.name)
    if (!await basePage.aboutDialog.isVisible()) {
      await basePage.versionBtn.click()
      await basePage.aboutDialog.waitFor()
    }
    const aboutAppName = await basePage.alphabizName.innerText()
    expect(aboutAppName).toBe(testcfg.name)
    await basePage.AboutDialogCloseBtn.click()
    expect(await basePage.aboutDialog).toHaveCount(0)
  })
  test('app color', async () => {
    const header = await window.locator('header')
    const color = await header.evaluate((e) => {
      return window.getComputedStyle(e).getPropertyValue("background-color")
    })
    console.log('header color', color)
    await expect(header).toHaveCSS('background-color', 'rgb(51, 0, 255)')
    await basePage.jumpPage('accountRatingTabel')
    const accountRate = await basePage.accountRatingTabel
    await expect(accountRate).toHaveCSS('background-color', 'rgb(51, 204, 255)')
    const accountRateColer = await accountRate.evaluate((e) => {
      return window.getComputedStyle(e).getPropertyValue("background-color")
    })
    console.log('accountRateColer', accountRateColer)
  })
  test('icon', async () => {
    const appBarIcon = await basePage.appBarIcon
    const appBarIconImage = await appBarIcon.evaluate((e) => {
      return window.getComputedStyle(e).getPropertyValue("background-image")
    })
    console.log('appBarIconImage', appBarIconImage)
    expect(appBarIconImage).toBe('url("http://localhost:8080/developer/assets/icon-256.png")')
    await basePage.jumpPage('accountLogo')
    const accountLogo = await basePage.accountLogoImage
    const accountLogoImage = await accountLogo.evaluate((e) => {
      return window.getComputedStyle(e).getPropertyValue("background-image")
    })
    console.log('accountLogoImage', accountLogoImage)
    expect(accountLogoImage).toBe('url("http://localhost:8080/developer/assets/icon-256.png")')
    if (!await basePage.aboutDialog.isVisible()) {
      await basePage.versionBtn.click()
      await basePage.aboutDialog.waitFor()
      const alphabizLogo = await basePage.alphabizLogo.locator('.q-img__image')
      const alphabizLogoImage = await alphabizLogo.evaluate((e) => {
        return window.getComputedStyle(e).getPropertyValue("background-image")
      })
      console.log('alphabizLogoImage', alphabizLogoImage)
      expect(alphabizLogoImage).toBe('url("http://localhost:8080/developer/assets/icon-256.png")')
    }
  })
  test('terms', async () => {
    if (!await basePage.aboutDialog.isVisible()) {
      await basePage.versionBtn.click()
      await basePage.aboutDialog.waitFor()
    }
    await basePage.licenseBtn.click()
    await basePage.licenseCard.waitFor()
    await basePage.termsTab.click()
    // const licenseCardContentText = await basePage.licenseCardContent.innerText()
    await expect(await basePage.termsContent).toHaveText(/Here are the customized functionality e2e test cases/gm)
    await basePage.licenseCardCloseBtn.click()
  })
  test.skip('url', async () => {
    if (!await basePage.aboutDialog.isVisible()) {
      await basePage.versionBtn.click()
      await basePage.aboutDialog.waitFor()
    }
    // release
    // const [releasePopup] = await Promise.all([
    //   window.waitForEvent('popup'),
    //   // Opens the popup.
    //   basePage.releaseBtn.click()
    // ])
    // console.log(await releasePopup.title())
    // console.log(await releasePopup.url())

    // twitter
    // await basePage.submitFeedbackBtn.click()
    // await basePage.feedbackCard.waitFor()
    // await basePage.feedbackCardDescInput.fill('123123')
    // const [popup] = await Promise.all([
    //   window.waitForEvent('popup'),
    //   // Opens the popup.
    //   basePage.feedbackCardDescSubmitBtn.click()
    // ])
    // console.log(await popup.title())
    // console.log(await popup.url())
  })
  test('check app website', async () => {
    if (!await basePage.aboutDialog.isVisible()) {
      await basePage.versionBtn.click()
      await basePage.aboutDialog.waitFor()
    }
    await basePage.networkDiagnoticBtn.click()
    await basePage.networkDiagnoticCard.waitFor()
    await basePage.networkDiagnoticCardCheckBtn.click()
    await basePage.networkDiagnoticCardCheckBtn.click({ trial: true, timeout: 60000 })
    await basePage.networkDiagnoticCard.locator('text=Official Site').click()
    await window.waitForTimeout(5000)
    const websiteText = await basePage.networkDiagnoticCard.locator('.q-expansion-item:has-text("Official Site")').innerText()
    // expect(websiteText.includes(testcfg.homepage)).toBe(true)
    expect(await basePage.networkDiagnoticCard.locator('.q-expansion-item:has-text("Official Site")')).toHaveText(/alpha.biz/)
    await basePage.networkDiagnoticCardCloseBtn.click()
    await basePage.AboutDialogCloseBtn.click()
  })
  test('bt Protocol', async () => {
    await homePage.clearTask()
    await basePage.jumpPage('downloadingStatus')
    await homePage.searchBtn.click({ force: true })
    await homePage.downloadTorrent(testBt.magnetLink)

    await basePage.jumpPage('uploadingStatus')
    await homePage.getCard(testBt.btName).waitFor('visible')

    await homePage.getCardEle(testBt.btName, 'moreBtn').click()
    await homePage.moreCard.waitFor()
    await window.waitForTimeout(1000)
    await homePage.copyUrlBtn.click()
    await homePage.copySuccessAlert.waitFor('visible')
    await basePage.headerTitle.click({ force: true })
    await basePage.waitForAllHidden(await homePage.copySuccessAlert)
    // 验证protocol链接
    const protocolReg = new RegExp(`${testcfg.name.toLocaleLowerCase()}:\/\/`)
    if (process.platform !== 'darwin') {
      await window.keyboard.press(`${basePage.modifier}+KeyV`)
      expect(await homePage.magnetTarea).toHaveValue(protocolReg)
      await homePage.cardCancelBtn.click()
    }
    await basePage.jumpPage('downloadingStatus')
    await homePage.downloadBtn.click()
    expect(await homePage.magnetTarea).toHaveValue(protocolReg)
    await homePage.cardDownloadBtn.click()
    await homePage.taskExistAlert.waitFor()
    await basePage.waitForAllHidden(await homePage.taskExistAlert)

    // 验证shortProtocol链接
    await basePage.jumpPage('uploadingStatus')
    await window.waitForTimeout(1000)
    await homePage.getCardEle(testBt.btName, 'moreBtn').click()
    await homePage.moreCard.waitFor()
    await window.waitForTimeout(1000)
    await homePage.copyShareUrlBtn.click()
    await homePage.copySuccessAlert.waitFor('visible')
    await basePage.headerTitle.click({ force: true })
    const showProtocolReg = new RegExp(`${testcfg.shortProtocol}:\/\/`)
    if (process.platform !== 'darwin') {
      await window.keyboard.press(`${basePage.modifier}+KeyV`)
      expect(await homePage.magnetTarea).toHaveValue(showProtocolReg)
      await homePage.cardCancelBtn.click()
    }
    await basePage.jumpPage('downloadingStatus')
    await homePage.downloadBtn.click()
    expect(await homePage.magnetTarea).toHaveValue(showProtocolReg)
    await homePage.cardDownloadBtn.click()
    await homePage.taskExistAlert.waitFor()
    await basePage.waitForAllHidden(await homePage.taskExistAlert)
  })
  test.describe('library', () => {
    test('quick create channel', async () => {
      await basePage.jumpPage('editLink')
      const isAddChannel = await libraryPage.getChannelCardEle(testBt.btName, 'card').isVisible()
      console.log('isAddChannel', isAddChannel)
      if (!isAddChannel) {
        await basePage.jumpPage('uploadingStatus')
        await homePage.getCardEle(testBt.btName, 'shareToLibrary').click()
        await libraryPage.quickStartCard.waitFor()
        await libraryPage.quickStartCardSubmitBtn.click()
        await homePage.searchBtn.click({ timeout: 30000 })
        await window.waitForTimeout(2000)
      }
      await basePage.jumpPage('followingLink')
      await window.waitForTimeout(3000)
      expect(await libraryPage.getChannelCardEle(testBt.btName, 'card')).toHaveCount(1, { timeout: 40000 })
    })
    test('find other library channel', async () => {
      const channelIdList = ['j9rj2vpqlnieva0vfjy0', 'pmxn6naxhkj36t2gaon7', 'mgtfqqunk4p5ndsrwgtp']
      await basePage.jumpPage('homeLink')
      await libraryPage.searchChannelBtn.click()
      for (const channelID of channelIdList) {
        await libraryPage.sciInput.fill(channelID)
        await libraryPage.sciSearchBtn.click()
        await window.locator('.q-card:has-text("cannot find channel")').waitFor()
        await window.locator('.q-card:has-text("cannot find channel") button:has-text("ok")').click()
      }
      await libraryPage.sciCloseBtn.click()
    })
    test('delete channel', async () => {
      await basePage.jumpPage('editLink')
      await window.waitForTimeout(5000)
      // 若频道没有删除 保存频道id，删除频道，查找频道
      await libraryPage.getChannelCardEle(testBt.btName, 'card').waitFor({ timeout: 5000 })
      await libraryPage.getChannelCardEle(testBt.btName, 'removeChannelBtn').click()
      await libraryPage.removeChannelBtn.click()
      // 编辑页 频道消失
      await window.waitForTimeout(3000)
      await expect(libraryPage.getChannelCardEle(testBt.btName, 'card')).toHaveCount(0)
      // 验证主页 推文卡片消失
      await basePage.jumpPage('homeLink')
      await window.waitForTimeout(5000)
      await expect(libraryPage.getPostCardEle(testBt.btName, 'postTitle')).toHaveCount(0)
    })
  })
  test.describe('wallet', () => {
    let firstKey
    test.beforeEach(async () => {
      await basePage.waitForAllHidden(await basePage.alert)
      await developmentPage.openTools()
      await developmentPage.openWalletPage()
      const headerTitle = await basePage.headerTitle.innerText()
      if (!/Wallet/.test(headerTitle)) await walletPage.jumpPage('walletLink')
      try {
        await walletPage.acAddressText.click({ timeout: 10000, force: true })
      } catch (e) {
        await walletPage.getStartedCard.click({ timeout: 10000, force: true })
      }
      await expect(walletPage.connectionStatus).toHaveText(/online/, { timeout: 60000 })
      await window.waitForTimeout(7000)
      await walletPage.ensureClearKey()

      if (typeof firstKey === 'undefined' && typeof secondKey === 'undefined') {
        firstKey = await walletPage.createKey()
        await window.waitForTimeout(3000)
        firstKey.coin = await walletPage.getCoin()
        await walletPage.ensureClearKey()
      }
    })
    test('wallet Protocal', async () => {
      await walletPage.recoveryKey(firstKey.privateKey)
      await walletPage.checkCollectionLink('homeLink', firstKey.address)
    })
  })
  test.describe('update', () => {
    let minVersions
    test.beforeAll(async () => {
      minVersions = await getminversions()
      console.log(minVersions)
    })
    test.beforeEach(async () => {
      modifyVersion({ version: currentVersion.replace('internal', 'nightly') })
      await basePage.newReload()
    })
    test('stable channel', async () => {
      await basicPage.setChannel('stable')
      modifyVersion({ version: currentVersion.replace(/-\w+-\d+/, '') })
      await basePage.newReload()
      await basePage.checkUpdate('stable')
      modifyVersion({ version: getUpdatableVersion('stable', minVersions, { isExpired: true }) })
      await basePage.newReload()
      await basePage.checkUpdate('stable', { force: true })
    })
    test('nightly channel', async () => {
      await basicPage.setChannel('nightly')
      modifyVersion({ version: currentVersion.replace('internal', 'nightly') })
      await basePage.newReload()
      await basePage.checkUpdate('nightly')
      modifyVersion({ version: getUpdatableVersion('nightly', minVersions, { isExpired: true }) })
      await basePage.newReload()
      await basePage.checkUpdate('nightly', { force: true })
    })
    test('internal channel', async () => {
      await basicPage.setChannel('internal')
      modifyVersion({ version: currentVersion.replace('nightly', 'internal') })
      await basePage.newReload()
      await basePage.closeInternalNotice()
      await basePage.checkUpdate('internal')
      modifyVersion({ version: getUpdatableVersion('internal', minVersions, { isExpired: true }) })
      await basePage.newReload()
      await basePage.closeInternalNotice()
      await basePage.checkUpdate('internal', { force: true })
    })
    test.afterAll(async () => {
      modifyVersion({ version: currentVersion.replace('internal', 'nightly') })
      await basePage.newReload()
    })
  })
  test('waitTime', async () => {
    await window.waitForTimeout(20000)
  })
})