const { expect } = require('@playwright/test')
const { BasePage } = require('./basePage')
class HomePage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page
    this.searchBtn = page.locator('.q-toolbar button:has-text("search")')
    this.searchInput = page.locator('label input[type="text"]')
    this.searchCloseBtn = page.locator('label i:has-text("close")')
    this.toggleListModeBtn = page.locator('button:has-text("view_agenda")')
    this.toggleCardModeBtn = page.locator('button:has-text("view_list")')
    this.sortBtn = page.locator('button:has-text("sort")')
    this.allCard = page.locator('.torrent-item')
    // cardmode
    this.cardElementObj = {
      moreBtn: 'button:has-text("more_horiz")',
      stopBtn: 'button:has-text("STOP")',
      resumeBtn: 'button:has-text("play_arrowResume")',
      seedBtn: 'button:has-text("Seed")',
      playBtn: 'button:has-text("Play")',
      openDirBtn: 'button:has-text("folderOpen directory")',
      libraryBtn: 'button:has-text("video_libraryLibrary")',
      shareToLibrary: 'button:has-text("present_to_allShare to library")',
      deleteBtn: 'button:has-text("Delete")',
      processText: '.progress-text',
      statusText: 'text=Status: '
    }
    this.firstFileBtn = page.locator('.q-list .q-item:nth-child(1) >> text=play_arrow')
    // listmode
    this.listElementObj = {
      fileIcon: '.name-icon',
      fileSize: '.text-grey',
      completedTime: '//td[3]',
      uploadSpeed: '//td[5]',
      stopBtn: 'button:has-text("stop")',
      seedBtn: 'button:has-text("cloud_upload")',
      fileOpenBtn: 'button:has-text("smart_display")',
      shareToLibrartBtn: 'button:has-text("present_to_allShare to library")',
      folderBtn: 'button:has-text("folder")',
      moreBtn: 'button:has-text("more_horiz")',
      closeBtn: 'button:has-text("close")'
    }
    // download card
    const downloadCardCss = '.q-card:has-text("Download directory")'
    this.downloadCard = page.locator(downloadCardCss)
    this.magnetTarea = page.locator(`${downloadCardCss} >> textarea`)
    this.dirInput = page.locator(`${downloadCardCss} [aria-label="Download directory position"]`)
    this.cardDownloadBtn = page.locator(`${downloadCardCss} >> button:has-text("Download")`)
    this.cardCancelBtn = page.locator(`${downloadCardCss} >> button:has-text("Cancel")`)
    // upload card
    const uploadCardCss = '.q-card:has(label:has-text("file")):has-text("upload")'
    this.uploadCard = page.locator(uploadCardCss)
    this.ucfileInput = page.locator(`${uploadCardCss} input[type="file"]`)
    this.ucfolderBtn = page.locator(`${uploadCardCss} button:has-text("folder")`)
    this.ucUploadBtn = page.locator(`${uploadCardCss} button:has-text("upload")`)
    this.ucCancelBtn = page.locator(`${uploadCardCss} button:has-text("Cancel")`)
    // more card
    this.moreCard = page.locator('.q-card:has-text("Download U")')
    this.copyUrlBtn = page.locator('[role="presentation"]:has-text("content_copy")')
    this.copyShareUrlBtn = page.locator('[role="presentation"]:has-text("share")')
    this.fileTreeBtn = page.locator('.file-tree')
    // delete card
    this.deleteCard = page.locator('.q-card >> text=Delete this task')
    this.deleteFileChk = page.locator('[aria-label="Also delete files"]')
    this.removeAutoUploadFilesChk = page.locator('[aria-label="Remove auto-upload files"]')
    this.notNowBtn = page.locator('button:has-text("Not now")')
    this.deleteBtn = page.locator('button:has-text("Not now") >> //following::Button[1]')
    this.deleteConfirmd = page.locator('button:has-text("Confirm")')
    // downloading
    this.startAllBtn = page.locator('button:has-text("Start all")')
    this.downPauseAllBtn = page.locator('button:has-text("Pause all") >> nth=0')
    this.downRemoveAllBtn = page.locator('button:has-text("Remove all") >> nth=0')
    this.downloadBtn = page.locator('button:has-text("addDownload")')
    // uploading
    this.upPauseAllBtn = page.locator('button:has-text("Pause all") >> nth=1')
    this.upRemoveAllBtn = page.locator('button:has-text("Remove all") >> nth=1')
    this.uploadBtn = page.locator('button:has-text("cloud_uploadUpload") >> visible=true')
    // downloaded
    this.clearHistoryBtn = page.locator('button:has-text("Clear history")')
    this.uploadAllBtn = page.locator('button:has-text("Upload all")')
    // alert
    this.copySuccessAlert = page.locator('[role="alert"]:has-text("URI is successfully copied to your clipboard")')
    this.taskExistAlert = page.locator('[role="alert"]:has-text("Task already exists")')
  }

  getCard (btName) {
    return this.page.locator(`.torrent-item:has-text("${btName}")`).first()
  }

  getCardEle (btName, target, status) {
    const btCard = 'text=' + btName + ' >> xpath=..//..//..//..//..'
    return this.page.locator(btCard + ' >> ' + this.cardElementObj[target] + (status || '')).first()
  }

  getListEle (btName, target) {
    return this.page.locator(`.list-item-tr:has-text("${btName}")` + ' >> ' + this.listElementObj[target])
  }

  // home
  async downloadTorrent (magnet, isWaitAlert = 0) {
    await this.downloadBtn.click()
    if (process.platform === 'darwin') await this.page.waitForTimeout(2000)
    await this.magnetTarea.fill(magnet)
    if (process.platform === 'darwin') await this.page.waitForTimeout(2000)
    await this.dirInput.fill('./test/download')
    if (process.platform === 'darwin') await this.page.waitForTimeout(5000)
    await this.cardDownloadBtn.click()
    if (isWaitAlert) await this.taskExistAlert.waitFor()
    await this.page.waitForTimeout(2000)
    if (await this.cardCancelBtn.isVisible()) {
      await this.cardCancelBtn.click()
    }
    await this.page.waitForTimeout(1000)
    await this.page.waitForLoadState()
  }

  async clearTask () {
    await this.jumpPage('downloadingStatus')
    await this.page.waitForTimeout(7000)
    try {
      await this.downRemoveAllBtn.waitFor({ timeout: 5000 })
    } catch (e) {
      await this.jumpPage('downloadingStatus')
    }
    await this.searchBtn.click({ force: true })
    await this.page.waitForTimeout(1000)
    if (await this.downRemoveAllBtn.isEnabled()) {
      await this.downRemoveAllBtn.click()
      const isDeleteFile = await this.deleteFileChk.getAttribute('aria-checked')
      if (isDeleteFile !== 'true') {
        await this.deleteFileChk.click()
      }
      await this.deleteBtn.click()
      await this.waitForAllHidden(await this.allCard, 15000)
    }
    await this.jumpPage('uploadingStatus')
    await this.page.waitForTimeout(1000)
    if (await this.upRemoveAllBtn.isEnabled()) {
      await this.upRemoveAllBtn.click()
      await this.removeAutoUploadFilesChk.click()
      const isDeleteFile = await this.deleteFileChk.getAttribute('aria-checked')
      if (isDeleteFile !== 'true') {
        await this.deleteFileChk.click()
      }
      await this.deleteBtn.click()
      await this.waitForAllHidden(await this.allCard, 15000)
    }
    await this.jumpPage('downloadedStatus')
    await this.page.waitForTimeout(1000)
    if (await this.clearHistoryBtn.isEnabled()) {
      await this.clearHistoryBtn.click()
      await this.deleteBtn.click()
      await this.waitForAllHidden(await this.allCard, 15000)
    }
  }
}
module.exports = { HomePage }
