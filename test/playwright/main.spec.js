/* eslint-disable no-empty-pattern */
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const electronMainPath = require('../../test.config.js').electronMainPath
const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { PlayerPage } = require('./models/playerPage')
const { CreditsPage } = require('./models/creditsPage')

const { calculation } = require('../utils/calculation')
let window, windows, electronApp, basePage, homePage, playerPage, creditsPage
const ScreenshotsPath = 'test/output/playwright/main.spec/'
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
const btData = [
  {
    btName: 'uTorrent Web Tutorial Video',
    magnetLink: 'magnet:?xt=urn:btih:61b3b8856c4839edf51f5c2346599b6bec524145',
    isStreaming: 0,
    isDelete: 0,
    fileType: 'folder'
  },
  {
    btName: 'The WIRED CD - Rip. Sample. Mash. Share',
    magnetLink: 'alphabiz://The+WIRED+CD+-+Rip.+Sample.+Mash.+Share/AaiP2llU6JF4w3Jxamp4uBgO1NrT&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AQ2AZRdABhgxG8IY8MSV1K_VKsx55jv8ahwgTX5jKB2up6HR8eDRb6BvCkztx6mgEb++b2k0T1kLtZV_Z3BAncfL9IZEXrCc2i3lZ1gwntqOdl5Y6U4ITwioxtrEFVVqgnT7fNc84aa4e4nbkoHiGnrIyjqiDO6Th6ghL6fgab+SzF6QoLdOc_CzeSlbolwRBY6XVrJDoXv0R2cuLjOd2K0fNlkoov1603Ml_lh_5EboBPwH+OOmSVNhU2VlV8_JhxjvAyuSH2BztiDRz1bVFkIdjxPR234SGYsuJpslus1CEnVW+bjTYwN6URFizlYFNVAeUEyN6RuAJBa8Zr5R9rTZj8ZZt9oSUK2igP7XtUePDYebMj3TjlP1dIp+i_HBQOtJ+Yd4zFcLi1aeQteo2DP694kshUMvyLM1ZBS6FdnwVLNCGFZ_TEBIhR73Nm2DXdas086dQFXAEOmjwprTaPyWwRqVrEXn9uuWDFUe8TbJYK6hQbfFdTCM8Mq4dNnAQqcepFfmbE4PAd+m7zOGXFARinVN+L_ZK16ADAA4uMAAawDtwgAAANYnWQ+MA2LAgAAAAABWVo=',
    testName: 'alphabiz- ',
    isStreaming: 0,
    isDelete: 0,
    fileType: 'folder'
  },
  {
    btName: 'bbb_sunflower_1080p_30fps_normal.mp4',
    magnetLink: 'alphabiz://bbb_sunflower_1080p_30fps_normal.mp4/AYhZSqrL3kDvPiUQxHN07AqjlsCO&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AMtAW1dABhgxG8IY8MSV1K_VKsx55jv8ahwgTX5jKB2up6HR8eDRb6BvCkztx6mgEb++b2O2b3K3oD_twGGSig+KBe78TiXxGleWSnbRlWB69ZvfD70oiEhlTlty+AtgRrH+kzx7fD910Bx9Uf4_7Js+dNII8l3GxJ4B175xFepPURPh6AnWzB9cVwPtgxmF4hSxh7Z_thhoZBH4KP2yrr9bIPbiBIfR4rnRGgQhoMYOe1vRpDVUFDC_y_tNp17fwwfvvvAj5elliGbJODzL4qEq_HB_lUhXHCZDoPbg1kCa8TfDkYL+2wWqViHW5YjR6DIxnlf8AAswdMmYa5OLaHRfCaqLtreJ_iohdSxAp2rckxS001Zp7ra+N_aIUxh9H3a96O2YBfWo_2PdmbBhT1A8s20u6d9cVtOTDvkpvOb8aiGcUn+swScBUm1SBP2DgoZJ6zeNvQcBQ9WKwD51ImdTrOxf2ShB64iMvUV0iO_3x3WAAAAAJcI4UEAAYUDrgYAAOI5sWM+MA2LAgAAAAABWVo=',
    testName: 'Streaming alphabiz- ',
    isStreaming: 1,
    isDelete: 0,
    fileType: 'video_file'
  },
  {
    btName: 'bbb_sunflower_1080p_30fps_normal.mp4',
    magnetLink: 'alphabiz://bbb_sunflower_1080p_30fps_normal.mp4/AYhZSqrL3kDvPiUQxHN07AqjlsCO&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AMtAW1dABhgxG8IY8MSV1K_VKsx55jv8ahwgTX5jKB2up6HR8eDRb6BvCkztx6mgEb++b2O2b3K3oD_twGGSig+KBe78TiXxGleWSnbRlWB69ZvfD70oiEhlTlty+AtgRrH+kzx7fD910Bx9Uf4_7Js+dNII8l3GxJ4B175xFepPURPh6AnWzB9cVwPtgxmF4hSxh7Z_thhoZBH4KP2yrr9bIPbiBIfR4rnRGgQhoMYOe1vRpDVUFDC_y_tNp17fwwfvvvAj5elliGbJODzL4qEq_HB_lUhXHCZDoPbg1kCa8TfDkYL+2wWqViHW5YjR6DIxnlf8AAswdMmYa5OLaHRfCaqLtreJ_iohdSxAp2rckxS001Zp7ra+N_aIUxh9H3a96O2YBfWo_2PdmbBhT1A8s20u6d9cVtOTDvkpvOb8aiGcUn+swScBUm1SBP2DgoZJ6zeNvQcBQ9WKwD51ImdTrOxf2ShB64iMvUV0iO_3x3WAAAAAJcI4UEAAYUDrgYAAOI5sWM+MA2LAgAAAAABWVo=',
    isStreaming: 0,
    isDelete: 0,
    fileType: 'video_file'
  }
]
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
  playerPage = new PlayerPage(window)
  creditsPage = new CreditsPage(window)
})
test.beforeEach(async () => {
  await window.evaluate(() => localStorage.clear())
})
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    // await window.waitForTimeout(10000)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})
test.afterAll(async () => {
  // // Exit app.
  // await window.evaluate(() => localStorage.clear())
  // await electronApp.close()
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

test('reset torrent status', async () => {
  await window.waitForLoadState()
  await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
  await basePage.jumpPage('downloadingStatus')
  await homePage.searchBtn.click({ force: true })
  if (await homePage.downRemoveAllBtn.isEnabled()) {
    await homePage.downRemoveAllBtn.click()
    await homePage.deleteFileChk.click()
    await homePage.deleteBtn.click()
  }
  await basePage.jumpPage('uploadingStatus')
  if (await homePage.upRemoveAllBtn.isEnabled()) {
    await homePage.upRemoveAllBtn.click()
    await homePage.removeAutoUploadFilesChk.click()
    await homePage.deleteFileChk.click()
    await homePage.deleteBtn.click()
  }
  await basePage.jumpPage('downloadedStatus')
  if (await homePage.clearHistoryBtn.isEnabled()) {
    await homePage.clearHistoryBtn.click()
    await homePage.deleteBtn.click()
  }
})

test.describe('play video', () => {
  test('avi_type', async () => {
    await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
    const media = './test/cypress/fixtures/samples/GoneNutty.avi'

    await window.waitForLoadState()
    await basePage.jumpPage('playerLink')
    // Upload
    await playerPage.fileInput.setInputFiles(media)
    await window.waitForLoadState()
    // should video can play
    const progressControl = await playerPage.controlBar
    await expect(progressControl).toBeVisible()
  })
  test('BluRay_mkv_type', async () => {
    await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
    const media = './test/cypress/fixtures/samples/Test-Sample-Tenet.2020.IMAX.2160p.UHD.BluRay.x265.10bit.HDR.DTS-HD.MA.5.1202111171122322.mkv'

    if (!await playerPage.fileInput.isEnabled()) await basePage.jumpPage('playerLink')
    // Upload
    await playerPage.fileInput.setInputFiles(media)
    await window.waitForLoadState()
    // should video can play
    const progressControl = await playerPage.controlBar
    await expect(progressControl).toBeVisible()
  })
})

test.describe('download ', () => {
  for (const btDate of btData) {
    test((btDate.testName ? btDate.testName : '') + btDate.btName, async () => {
      await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
      if (btDate.btName === 'uTorrent Web Tutorial Video') {
        test.setTimeout(60000 * 5)
      } else if (btDate.btName === 'The WIRED CD - Rip. Sample. Mash. Share') {
        test.setTimeout(60000 * 10)
      } else if (btDate.btName === 'bbb_sunflower_1080p_30fps_normal.mp4') {
        test.setTimeout(60000 * 15)
      }
      await window.waitForLoadState()

      // 跳转到 home
      await basePage.jumpPage('downloadingStatus')
      await homePage.searchBtn.click({ force: true })
      await window.waitForTimeout(2000)
      // 等待任务卡片加载
      if (!await homePage.getCard(btDate.btName).isVisible()) {
        await window.waitForTimeout(2000)
      }
      // download bbb_sunflower_1080p_30fps_normal.mp4 下载中状态多等一会
      if (btDate.btName === 'bbb_sunflower_1080p_30fps_normal.mp4' && btDate.isStreaming === 0) {
        let waitTime = 0
        // await window.reload()
        while (1) {
          if (!await homePage.getCard(btDate.btName).isVisible()) {
            waitTime += 3
          } else break
          if (waitTime >= 15) break
          await window.waitForTimeout(3000)
        }
      }
      // 判断 任务 在downloading状态
      if (await homePage.getCard(btDate.btName).isVisible()) {
        // 等待下载完成
        const DownloadStatus = await (await homePage.getCardEle(btDate.btName, 'statusText')).innerText()
        //  判断 文件存在，下载完成
        if (DownloadStatus === 'Status: Paused') await homePage.getCardEle(btDate.btName, 'resumeBtn').click()
        try {
          await homePage.getCardEle(btDate.btName, 'statusText', 'Downloading').click({ timeout: 60000 })
        } catch (error) {
          await basePage.jumpPage('uploadingStatus')
          await homePage.searchBtn.click({ force: true })
          await homePage.getCardEle(btDate.btName, 'statusText', 'Seeding').click({ timeout: 30000 })
        }
      } else {
        // 判断 任务 在seeding状态
        await basePage.jumpPage('uploadingStatus')
        await homePage.searchBtn.click({ force: true })
        await window.waitForTimeout(1000)
        if (!await homePage.getCard(btDate.btName).isVisible()) {
          // 任务不存在  bt未开始下载
          await basePage.jumpPage('downloadingStatus')
          await homePage.searchBtn.click({ force: true })
          await homePage.downloadTorrent(btDate.magnetLink)
          try {
            await window.click('text=' + btDate.btName, { timeout: 20000 })
            // 等待 任务 加载 验证， 判断任务是 下载中
            let time
            btDate.btName.includes('uTorrent') ? time = 15000 : time = 60000
            await homePage.getCardEle(btDate.btName, 'statusText', 'Downloading').click({ timeout: time })
          } catch (error) {
            console.log('The seed download is complete')
          }
        }
      }

      // 等待下载完成
      if (await homePage.getCardEle(btDate.btName, 'statusText').isVisible()) {
        const btStatus = await (await homePage.getCardEle(btDate.btName, 'statusText')).innerText()
        if (btStatus === 'Status: Downloading') {
          const progressBar = await homePage.getCardEle(btDate.btName, 'processText')
          let oldProgress = parseFloat(/\d{1,3}.\d{0,2}/.exec(await progressBar.innerText()))
          let timestamp = 0
          // wait download
          while (1) {
            if (!await homePage.getCard(btDate.btName).isVisible()) break
            const DownloadStatus = await (await homePage.getCardEle(btDate.btName, 'statusText')).innerText()
            // console.log('DownloadStatus:' + DownloadStatus)
            if (DownloadStatus !== 'Status: Downloading') {
              break
            }
            const progressBar = await homePage.getCardEle(btDate.btName, 'processText')
            const progressPercentage = parseFloat(/\d{1,3}.\d{0,2}/.exec(await progressBar.innerText()))
            // console.log('progressPercentage:' + progressPercentage)
            if (oldProgress === progressPercentage) {
              if (timestamp >= 40) break
              timestamp += 5
            } else if (oldProgress < progressPercentage) timestamp = 0

            oldProgress = progressPercentage
            if (btDate.isStreaming) {
              if (progressPercentage > 20) break
            }
            if (progressPercentage === 100) break

            await window.waitForTimeout(5000)
            continue
          }
        }
      }
      if (btDate.isStreaming !== 1) {
        await basePage.jumpPage('uploadingStatus')
        await homePage.searchBtn.click({ force: true })
      }
      // 点击 Play 按钮
      await homePage.getCardEle(btDate.btName, 'playBtn').click()
      // 点击播放列表的第一个文件，跳转到player页面
      await homePage.firstFileBtn.click()

      // should video can play
      await playerPage.controlBar.waitFor({ timeout: 40000 })
      // await window.reload()
      // 是否删除种子
      if (btDate.isDelete) {
        await basePage.jumpPage('uploadingStatus')
        await homePage.getCardEle(btDate.btName, 'deleteBtn').click()
        await homePage.deleteFileChk.click()
        await homePage.deleteBtn.click()
      }
    })
  }
})
test.describe('task', () => {
  test.beforeEach(async () => {
    await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
    await window.waitForLoadState()
    await basePage.jumpPage('uploadingStatus')
    await homePage.searchBtn.click({ force: true })
    // 确保切换到卡片模式
    const cardMode = await homePage.toggleCardModeBtn
    if (await cardMode.isVisible()) {
      await cardMode.click()
    }
    try {
      for (const bt of btData) {
        await homePage.getCard(bt.btName).waitFor({ timeout: 20000 })
      }
    } catch {
      await basePage.jumpPage('downloadedStatus')
      await homePage.uploadAllBtn.click()
      await basePage.jumpPage('uploadingStatus')
      for (const bt of btData) {
        await homePage.getCard(bt.btName).waitFor('visible')
      }
    }
    await window.waitForLoadState()
    await window.waitForTimeout(2000)
    console.log('task beforeEach end!')
  })
  test('card mode task list', async () => {
    await window.screenshot({ path: `${ScreenshotsPath}card-mode-taskStatus.png` })
    const cardMode = await homePage.toggleCardModeBtn
    if (await cardMode.isVisible()) {
      await cardMode.click()
    }
    // stop 功能
    await homePage.getCardEle(btData[1].btName, 'stopBtn').click()
    await homePage.getCard(btData[1].btName).waitFor('hidden')
    await basePage.jumpPage('downloadedStatus')
    await window.waitForTimeout(3000)
    await homePage.getCard(btData[1].btName).waitFor('visible')
    await homePage.getCardEle(btData[1].btName, 'seedBtn').click()
    await homePage.getCard(btData[1].btName).waitFor('hidden')
    await basePage.jumpPage('uploadingStatus')
    await homePage.getCard(btData[1].btName).waitFor('visible')
    // play 功能
    await homePage.getCardEle(btData[1].btName, 'playBtn').click()
    await homePage.firstFileBtn.waitFor()
    // delete 功能
    await homePage.getCardEle(btData[1].btName, 'deleteBtn').click()
    await homePage.deleteCard.waitFor()
    await homePage.deleteFileChk.waitFor()
    await homePage.notNowBtn.click()
    // more.. 功能
    await homePage.getCardEle(btData[1].btName, 'moreBtn').click()
    await homePage.moreCard.waitFor()
    await window.waitForTimeout(1000)
    // 检查文件路径
    const filePathElement = await homePage.fileTreeBtn
    // 检查文件夹树状结构
    await filePathElement.click()
    await filePathElement.locator('text=01 - Beastie Boys - Now Get Busy.mp3').waitFor()
    await filePathElement.locator('text=insert_drive_file').waitFor()
    await filePathElement.locator('text=image').waitFor()
    await window.waitForTimeout(1000)
    // 退出卡片
    await basePage.headerTitle.click({ force: true })
    try {
      await homePage.moreCard.waitFor('hidden')
    } catch {
      await basePage.headerTitle.click({ force: true })
    }
  })
  test('table mode task list', async () => {
    await window.screenshot({ path: `${ScreenshotsPath}table-mode-taskStatus.png` })
    // 切换列表模式
    const listMode = await homePage.toggleListModeBtn
    if (await listMode.isVisible()) {
      await listMode.click()
    }
    // 验证文件类型图标
    const bbbFileIcon = await homePage.getListEle(btData[2].btName, 'fileIcon').innerText()
    expect(bbbFileIcon).toBe('video_file')
    const uTorrentFileIcon = await homePage.getListEle('uTorrent Web', 'fileIcon').innerText()
    expect(uTorrentFileIcon).toBe('folder')
    // 双击文件名播放文件
    await window.locator(`text=${btData[1].btName}`).click({ clickCount: 2 })
    // should video can play
    await playerPage.controlBar.waitFor({ timeout: 10000 })
    await basePage.jumpPage('uploadingStatus')
    await window.waitForTimeout(1000)
    // 文件大小
    const fileSize = await homePage.getListEle(btData[1].btName, 'fileSize').innerText()
    // expect(fileSize).toBe('56.07 MB')
    expect(/\d+\.\d+\s(MB|GB)/.test(fileSize)).toBe(true)
    // 完成时间格式 hh:mm:ss格式 非当日任务显示yesterday或yy-mm-dd格式
    const time = await homePage.getListEle(btData[1].btName, 'completedTime').innerText()
    expect(/(\d{1,2}:\d{1,2}:\d{1,2}|Yesterday|\d{1,2}-\d{1,2}-\d{1,2})/.test(time)).toBe(true)
    // 上传速度: (上传中) 单位KB/s或MB/s
    const uploadSpeed = await homePage.getListEle(btData[1].btName, 'uploadSpeed').innerText()
    // console.log('uploadSpeed:' + uploadSpeed)
    expect(/(\d+(\.\d+)?\s?(KB|MB)?|-)/.test(uploadSpeed)).toBe(true)
    // 检查任务图标
    // stop 图标
    const stopIcon = await homePage.getListEle(btData[1].btName, 'stopBtn')
    await stopIcon.waitFor()
    // file_open 图标
    const fileOpenIcon = await homePage.getListEle(btData[1].btName, 'fileOpenBtn')
    await fileOpenIcon.waitFor()
    // folder 图标
    const fileIcon = await homePage.getListEle(btData[1].btName, 'folderBtn')
    await fileIcon.waitFor()
    // more... 图标
    const moreIcon = await homePage.getListEle(btData[1].btName, 'moreBtn')
    await moreIcon.waitFor()
    // close 图标
    const closeIcon = await homePage.getListEle(btData[1].btName, 'closeBtn')
    await closeIcon.waitFor()
    await closeIcon.click()
    await homePage.deleteCard.waitFor({ timeout: 10000 })
    await homePage.notNowBtn.click()
    // "更多"功能检查Download url
    await moreIcon.click()
    await homePage.moreCard.waitFor()
    await window.waitForTimeout(1000)
    await homePage.copyUrlBtn.click()
    await homePage.copySuccessAlert.waitFor('visible')
    // "更多"功能检查文件路径
    const filePathElement = await homePage.fileTreeBtn
    // 检查文件夹树状结构
    await filePathElement.click()
    await filePathElement.locator('text=01 - Beastie Boys - Now Get Busy.mp3').waitFor()
    await filePathElement.locator('text=insert_drive_file').waitFor()
    await filePathElement.locator('text=image').waitFor()
    await window.waitForTimeout(1000)
    // 退出卡片
    await basePage.headerTitle.click({ force: true })
    // downloaded状态栏
    await stopIcon.click()
    await stopIcon.waitFor('hidden')
    await basePage.jumpPage('downloadedStatus')
    const theWoredCD = await window.locator(`text=${btData[1].btName}`)
    await theWoredCD.waitFor('visible')
    // // 检查任务图标
    const uploadIcon = await homePage.getListEle(btData[1].btName, 'seedBtn')
    await uploadIcon.waitFor()
    await window.waitForTimeout(2000)
    await uploadIcon.click()
    await theWoredCD.waitFor('hidden')
    await basePage.jumpPage('uploadingStatus')
    await theWoredCD.waitFor('visible')
    // // // 验证magnet被复制到剪贴板
    // await basePage.jumpPage('downloadingStatus')
    // await homePage.downloadBtn.click()
    // await window.waitForTimeout(1000)
    // const magnetText = await window.locator('//*[@aria-label="Download directory position"]/preceding::*[1]').inputValue()
    // // console.log('magnetText:' + magnetText)
    // expect(/alphabiz:\/\//.test(magnetText)).toBe(true)
    // await window.click('button:has-text("Cancel")')
    // await window.waitForTimeout(5000)
    // await window.reload()
  })
  test('pause all', async () => {
    for (const bt of btData) {
      await homePage.getCard(bt.btName).waitFor('visible')
    }
    await window.waitForTimeout(2000)
    await homePage.upPauseAllBtn.click()
    await homePage.waitForAllHidden(await homePage.allCard, 60000)
    await basePage.jumpPage('downloadedStatus')
    for (const bt of btData) {
      await homePage.getCard(bt.btName).waitFor('visible')
    }
    await window.waitForTimeout(2000)
    await homePage.uploadAllBtn.click()
    await homePage.waitForAllHidden(await homePage.allCard, 60000)
    await basePage.jumpPage('uploadingStatus')
    for (const bt of btData) {
      await homePage.getCard(bt.btName).waitFor('visible')
    }
  })
})

test.describe('upload', () => {
  test.skip('test1', async () => {
    test.setTimeout(60000 * 15)
    const btName = 'ChinaCup.1080p.H264.AAC.mp4'
    const btAddress = path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4')
    // const oneFile = new File([''], btAddress, { path: btAddress })
    // const btCard = 'text=' + btName + ' >> xpath=..//..//..//..//.. >> '

    await basePage.jumpPage('homeLink')
    // Click button:has-text("Upload torrent")
    await window.click('button:has-text("Upload torrent")')

    console.log(path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4'))
    // await window.dispatchEvent('input[type="file"]', 'input', path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4'))
    // 1
    // const [fileChooser] = await Promise.all([
    //   window.waitForEvent('filechooser'),
    //   window.click('input[type="file"]')
    // ])
    // await fileChooser.setFiles(path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4'))
    // 2
    fs.readFile(btAddress, async function read (err, data) {
      if (err) {
        throw err
      }
      console.log(data)
      await window.locator('input[type="file"]').setInputFiles({
        name: 'ChinaCup.1080p.H264.AAC.mp4',
        mimeType: 'video/mp4',
        buffer: data,
        path: btAddress,
        pathExt: 'btAddress'
      })
    })
    // 3
    // await window.locator('input[type="file"]').setInputFiles(btAddress)
    await window.waitForTimeout(1000)

    // const elementHandle = await window.$('input[type="file"]')
    // const props = await elementHandle.getProperties()
    // console.log('props:' + props)
    // console.log('1:' + props.has('files'))
    // await elementHandle.evaluate(node => node.setAttribute('files'))
    // await window.waitForTimeout(1000)

    await window.click(':nth-match(button:has-text("Upload"), 2)')
    await window.waitForTimeout(1000)
    await window.click('text=' + btName, { timeout: 5000 })
  })
})

test.describe('account', () => {
  // const userInfo = [
  //   {
  //     nikename: 'test1',
  //     username: process.env.TEST1_EMAIL
  //   },
  //   {
  //     nikename: 'test2',
  //     username: process.env.EMAIL_USERNAME
  //   },
  //   {
  //     nikename: 'test3',
  //     username: '+86' + process.env.TEST3_PHONE_NUMBER
  //   }
  // ]
  test('transfer - check bill details', async () => {
    test.setTimeout(60000 * 5)
    // 转账人账号、密码
    // const transferee = userInfo[from].username
    const transferee = from
    const transfereePassword = process.env.TEST_PASSWORD
    // 收款人账号、密码
    // const payee = userInfo[to].username
    const payee = to
    const payeePassword = process.env.TEST_PASSWORD
    const transferAmount = 1
    await window.evaluate(() => localStorage.clear())
    await window.reload()
    // 如果应用已经登陆则退出登录状态
    const isHasAlert = await basePage.signOutAlert.isVisible()
    if (isHasAlert) {
      await window.reload()
    }
    await window.waitForLoadState()
    // 登录收款人账号
    await basePage.signIn(payee, payeePassword, 1)
    await basePage.jumpPage('creditsLink')
    // await window.waitForTimeout(10000)
    // 获取收款人id
    const payeeID = await creditsPage.getID()
    // console.log('payeeID:' + payeeID)
    await window.waitForTimeout(2000)
    const payeePoint = await creditsPage.creditsText.innerText()
    const payeeAfterPoint = Number(payeePoint) + transferAmount
    // 退出收款人账号
    await basePage.signOut()
    await window.waitForTimeout(1000)
    // 登录付款人账号
    await basePage.signIn(transferee, transfereePassword, 1)
    await basePage.jumpPage('creditsLink')
    // await window.waitForTimeout(10000)
    // 获取转账人id
    const transfereeID = await creditsPage.getID()
    let transfereePoint = await creditsPage.creditsText.innerText()
    if (Number(transfereePoint) <= 0) {
      console.log('金额不足')
    }
    await window.waitForTimeout(2000)
    transfereePoint = await creditsPage.creditsText.innerText()
    const transfereeAfterPoint = Number(transfereePoint) - transferAmount
    // 转账
    await creditsPage.transfer(payeeID, transferAmount.toString())
    // 查看账单明细
    await creditsPage.checkBillDetail([payeeID, 'Transfer', '-' + transferAmount, 'finish'], 'expense')
    // 断言积分变化是否正确
    await window.waitForTimeout(2000)
    await window.waitForLoadState()
    expect(await creditsPage.creditsText.innerText()).toBe(calculation('reduce', transfereePoint, transferAmount).toString())
    // 退出付款人账号
    await basePage.signOut()
    // await window.waitForTimeout(1000)
    // // 登录收款人账号
    // await basePage.signIn(payee, payeePassword, 1)
    // await basePage.jumpPage('creditsLink')
    // await window.waitForTimeout(2000)
    // // 查看账单
    // await creditsPage.checkBillDetail(transfereeID, 'Transfer', '+' + transferAmount, 'finish')
    // // 断言积分变化是否正确
    // expect(await creditsPage.creditsText.innerText()).toBe(payeeAfterPoint.toString())
    // await basePage.signOut()
    // await window.waitForTimeout(1000)
  })
})
