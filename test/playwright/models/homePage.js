const { expect } = require('@playwright/test')

class HomePage {
  constructor (page) {
    this.page = page
    this.searchBtn = page.locator('button:has-text("search")')
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
      seedBtn: 'button:has-text("play_arrowSeed")',
      playBtn: 'button:has-text("play_circlePlay")',
      openDirBtn: 'button:has-text("folderOpen directory")',
      deleteBtn: 'button:has-text("Delete")',
      processText: '.progress-text',
      statusText: 'text=Status: '
    }
    this.firstFileBtn = page.locator('.q-list > .q-item:nth-child(1)')
    // listmode
    this.listElementObj = {
      fileIcon: '.name-icon',
      fileSize: '.text-grey',
      completedTime: '//td[2]',
      uploadSpeed: '//td[3]',
      stopBtn: 'button:has-text("stop")',
      seedBtn: 'button:has-text("cloud_upload")',
      fileOpenBtn: 'button:has-text("file_open")',
      folderBtn: 'button:has-text("folder")',
      moreBtn: 'button:has-text("more_horiz")',
      closeBtn: 'button:has-text("close")'
    }
    // download card
    this.downloadCard = page.locator('.q-card:has-text("Download directory")')
    this.magnetTarea = page.locator('.q-card >> textarea')
    this.dirInput = page.locator('[aria-label="Download directory position"]')
    this.cardDownloadBtn = page.locator('.q-card >> button:has-text("Download")')
    this.cardCancelBtn = page.locator('.q-card >> button:has-text("Cancel")')
    // more card
    this.moreCard = page.locator('.q-card:has-text("Download U")')
    this.copyUrlBtn = page.locator('[role="presentation"]:has-text("content_copy")')
    this.copyShareUrlBtn = page.locator('[role="presentation"]:has-text("share")')
    this.fileTreeBtn = page.locator('.file-tree')
    // delete card
    this.deleteCard = page.locator('.q-card >> text=Delete task')
    this.deleteFileChk = page.locator('[aria-label="Also delete files"]')
    this.removeAutoUploadFilesChk = page.locator('[aria-label="Remove auto-upload files"]')
    this.notNowBtn = page.locator('button:has-text("Not now")')
    this.deleteBtn = page.locator('button:has-text("Not now") >> //following::Button[1]')
    // downloading
    this.startAllBtn = page.locator('button:has-text("Start all")')
    this.downPauseAllBtn = page.locator('button:has-text("Pause all") >> nth=0')
    this.downRemoveAllBtn = page.locator('button:has-text("Remove all") >> nth=0')
    this.downloadBtn = page.locator('button:has-text("Download")')
    // uploading
    this.upPauseAllBtn = page.locator('button:has-text("Pause all") >> nth=1')
    this.upRemoveAllBtn = page.locator('button:has-text("Remove all") >> nth=1')
    this.uploadBtn = page.locator('button:has-text("Upload")')
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

  async waitForAllHidden (locator, timeout = 10000, waitTime) {
    const start = Date.now()
    const elementsVisible = async () => (await locator.evaluateAll(elements => elements.map(element => element.hidden))).includes(false)

    while (await elementsVisible()) {
      if (start + timeout < Date.now()) {
        console.log(`Timeout waiting for all elements to be hidden. Locator: ${locator}. Timeout: ${timeout}ms`)
        expect(1).toBe(0)
      }
      if (waitTime) await this.page.waitForTimeout(waitTime)
    }
    console.log(`All elements hidden: ${locator}`)
  }
}
module.exports = { HomePage }
