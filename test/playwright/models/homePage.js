// const { expect } = require('@playwright/test')

class HomePage {
  constructor (page) {
    this.page = page
    this.searchBtn = page.locator('button:has-text("search")')
    this.toggleListModeBtn = page.locator('button:has-text("view_agenda")')
    this.toggleCardModeBtn = page.locator('button:has-text("view_list")')
    this.sortBtn = page.locator('button:has-text("sort")')
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
    // listmode
    this.listElementObj = {
      fileIcon: '//preceding::*[1]',
      fileSize: '//following::*[2]',
      completedTime: '//following::*[3]',
      uploadSpeed: '//following::*[4]',
      oneBtn: '//following::Button[1]',
      twoBtn: '//following::Button[2]',
      threeBtn: '//following::Button[3]',
      fourBtn: '//following::Button[4]',
      fiveBtn: '//following::Button[5]'
    }
    // more card
    this.copyUrlBtn = page.locator('[role="presentation"]:has-text("content_copy")')
    this.copyShareUrlBtn = page.locator('[role="presentation"]:has-text("share")')
    this.fileTreeBtn = page.locator('text=play_arrowfolder')
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
  }

  getCard (btName) {
    const btCard = 'text=' + btName + ' >> xpath=..//..//..//..//..'
    return this.page.locator(btCard).first()
  }

  getCardEle (btName, target, status) {
    const btCard = 'text=' + btName + ' >> xpath=..//..//..//..//..'
    return this.page.locator(btCard + ' >> ' + this.cardElementObj[target] + (status || '')).first()
  }

  getListEle (btName, target) {
    return this.page.locator('text=' + btName + ' >> ' + this.listElementObj[target])
  }

  // home
  async downloadTorrent (magnet) {
    await this.downloadBtn.click()
    await this.page.fill('[aria-label="Download directory position"]  >> //preceding::*[1]', magnet)
    await this.page.fill('[aria-label="Download directory position"]', './test/download')
    await this.page.click('.q-card >> button:has-text("Download")')
    await this.page.waitForTimeout(300)
    if (!(await this.page.locator('.q-card >> button:has-text("Cancel")').isHidden())) {
      await this.page.click('.q-card >> button:has-text("Cancel")')
    }
    await this.page.waitForTimeout(300)
  }
}
module.exports = { HomePage }
