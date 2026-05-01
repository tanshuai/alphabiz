const { sleep } = require('../../../utils/getCode')
const fs = require('fs')
const appconfig = require('../../../../developer/app')

class HomePage {
  constructor (page) {
    this.page = page
  }
  get appConfig () { return appconfig }
  // 标题栏
  get AppTitle () { return this.page.$('/Pane/Document/Group[1]/Text[1]') }
  get AppVersion () { return this.page.$('//*[@AutomationId="version"]/Text') }
  // 菜单
  get menuBtn () { return this.page.$('//Button[@Name="Menu"]') }
  get pageTitle () { return this.page.$('//Button[@Name="Menu"]/following::Text[1]') }
  get libraryLink () { return this.page.$('//*[@Name="Library"]') }
  get homeLink () { return this.page.$('//*[@Name="Home"]') }
  get playerLink () { return this.page.$('//*[@Name="Player"]') }
  get creditsLink () { return this.page.$('//*[@Name="Credits"]') }
  get settingsLink () { return this.page.$('//*[@Name="Settings"]') }
  get basicLink () { return this.page.$('//*[@Name="Basic"]') }
  get accountLink () { return this.page.$('//*[@Name="Advanced"]') }
  get developmentLink () { return this.page.$('//*[@Name="Development"]') }
  // 种子状态tab
  get downloadingStatusTab () { return this.page.$('//*[@AutomationId="downloading"]') }
  get uploadingStatusTab () { return this.page.$('//*[@AutomationId="uploading"]') }
  get downloadedStatusTab () { return this.page.$('//*[@AutomationId="downloaded"]') }
  // 下载bt功能
  get downloadTorrentBtn () { return this.page.$('[name="DOWNLOAD"]') }
  get downloadMagnetEdit () { return this.page.$(`/Pane[@Name="${appconfig.displayName}"]//Edit[@Name="Download directory position"]/preceding::*[1]`) }
  get downloadDirectoryEdit () { return this.page.$(`/Pane[@Name="${appconfig.displayName}"]//Edit[@Name="Download directory position"]`) }
  // get confirmDownloadBtn () { return this.page.$('//Button[@Name="CANCEL"]/following-sibling::Button[@Name="DOWNLOAD"]') }
  get confirmDownloadBtn () { return this.page.$(`/Pane[@Name="${appconfig.displayName}"]//Button[@Name="CANCEL"]/following-sibling::Button[@Name="DOWNLOAD"]`) }
  // get cancelDownloadBtn () { return this.page.$('//Button[@Name="CANCEL"]') }
  get cancelDownloadBtn () { return this.page.$(`/Pane[@Name="${appconfig.displayName}"]//Button[@Name="CANCEL"]`) }

  // 任务卡片信息

  // 上传bt功能
  get uploadTorrentBtn () { return this.page.$('[name="UPLOAD"]') }
  get torrentFileBtn () { return this.page.$('//*[@Name="Select file..."]') }
  get fileNameEdit () { return this.page.$('//Edit[@ClassName="Edit"][@Name="File name:"]') }
  get confirmUploadBtn () { return this.page.$('//Button[@Name="CANCEL"]/following-sibling::Button[@Name="UPLOAD"]') }

  // 跳转菜单页面-支持跳转二级目录
  async jumpPage (firstTarget, secondTarget) {
    await sleep(2000)
    const menuLink = await this[secondTarget] || await this[firstTarget]
    console.log('检查一级目录是否可见')
    if (!(await this[firstTarget].isDisplayed())) {
      console.log('不可见，当前是小窗口')
      await this.menuBtn.click()
      console.log('点击菜单按钮展开侧边栏')
      await sleep(1000)
      if (secondTarget) {
        if (!(await menuLink.isDisplayed())) {
          await this[firstTarget].click()
        }
      }
      await menuLink.click()
      console.log('点击目标菜单项')
    }else{
      console.log('可见，当前是大窗口')
      if (secondTarget) {
        if (!(await menuLink.isDisplayed())) {
          await this[firstTarget].click()
        }
      }
      await menuLink.click()
      console.log('点击目标菜单项')
    }
  }

  async getAppTitle () {
    return await this.AppTitle.getText()
  }

  async getAppVersion () {
    console.log('version :' + await this.AppVersion.getText())
    return await this.AppVersion.getText()
  }

  async getPageTitle () {
    console.log('pageTitle :' + await this.pageTitle.getText())
    return await this.pageTitle.getText()
  }

  async setCardMode () {
    await this.page.$('//*[@Name="REMOVE ALL"]/following-sibling::Button[2]').click()
  }

  async downloadTorrent (magnetLink, directory) {
    await this.downloadTorrentBtn.click()
    await this.downloadMagnetEdit.setValue(magnetLink)
    console.log('fill the magnet')
    if (directory) {
      // setValue功能的自动清除内容不稳定，手动清除输入框内容
      console.log('clear the content')
      const text = await this.page.$('//Edit[@Name="Download directory position"]').getText()
      const backSpaces = new Array(text.length).fill('\uE003')
      await sleep(2000)
      await this.downloadDirectoryEdit.setValue(backSpaces)
      await sleep(2000)
      await this.downloadDirectoryEdit.setValue(directory)
      console.log('fill the directory')
    }
    await this.confirmDownloadBtn.click()
    console.log('confirm download')
  }

  async uploadTorrent (directory) {
    console.log('准备上传磁力')
    await this.uploadTorrentBtn.click()
    console.log('点击上传磁力的按钮')
    await this.torrentFileBtn.click()
    var dir = '../../output/release'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    await sleep(2000)
    await this.page.saveScreenshot('test/output/release/upload-file-selector.png')
    await this.fileNameEdit.setValue([directory, '\uE007'])
    console.log('选择文件')
    await this.confirmUploadBtn.click()
    console.log('确定传输')
  }

  async waitSeedFound (torrentName, time) {
    const taskTitle = await this.page.$('//Text[@Name="' + torrentName + '"]')
    await taskTitle.waitUntil(async function () {
      return (await this.isDisplayed()) === true
    }, {
      timeout: time,
      timeoutMsg: 'no seeds found'
    })
  }

  async waitSeedUpload (torrentName) {
    while (1) {
      try {
        await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[1]').click()
        const taskPeer = await this.page.$('//*[@Name="Peers"]')
        await taskPeer.waitUntil(async function () {
          return (await this.isDisplayed()) === true
        }, {
          timeout: 20000,
          timeoutMsg: 'no seeds found'
        })
      } catch (err) {
        await this.page.$('//Text[@Name="Uploading"]').click()
        await this.seedsStopAndSeed(torrentName)
        continue
      }
      break
    }
  }

  async seedsStopAndSeed (torrentName) {
    // stop种子
    if (!await this.page.$('//Text[@Name="Uploading"]').isDisplayed()) {
      await this.jumpPage('uploadingStatusTab')
    }
    if (await this.getTask(torrentName) !== null) {
      await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="STOP"]').click()
    }
    // seed种子
    await this.jumpPage('downloadedStatusTab')
    await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="SEED"]').click()
    console.log('await this.jumpPage("uploadingStatusTab")')
    await sleep(2000)
    await this.jumpPage('uploadingStatusTab')
  }

  async getTask (torrentName) {
    // console.log(await this.page.$('//Text[@Name="' + torrentName + '"]').isDisplayed())
    if (await this.page.$('//Text[@Name="' + torrentName + '"]').isDisplayed()) {
      return await this.page.$('//Text[@Name="' + torrentName + '"]')
    } else {
      return null
    }
  }

  async getTaskPeers (torrentName, timeout) {
    await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="DELETE"]/following-sibling::Button[1]').waitForDisplayed({ timeout: timeout })
    return await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="DELETE"]/following-sibling::Button[1]')
  }

  // status = 1  ->  wait display
  // status = 0  ->  wait hidden
  async waitTaskPeers (torrentName, timeout, status) {
    const taskPeers = await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="DELETE"]/following-sibling::Button[1]')
    console.log('waitTaskPeers')
    await this.page.$('//Text[@Name="' + torrentName + '"]').click()
    await taskPeers.waitUntil(async function () {
      return (status ? (await this.isDisplayed()) === true : (await this.isEnabled()) === false)
    }, {
      timeout: timeout,
      timeoutMsg: 'timeout'
    })
  }

  async getTaskStatus (torrentName, opt = { isLog: true }) {
    await this.page.$('//Text[@Name="' + torrentName + '"]')
    const taskStatus = await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Text[starts-with(@Name,"Status:")]')
    if (!taskStatus.isDisplayed()) {
      await this.setCardMode()
    }
    if (opt.isLog) console.log(await taskStatus.getText())
    return await taskStatus.getText()
  }

  async getTaskDownloadSpeed (torrentName) {
    await this.page.$('//Text[@Name="' + torrentName + '"]').click()
    const taskDownloadSpeed = await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Text[starts-with(@Name,"Status:")]/following-sibling::*[1]')
    console.log(await taskDownloadSpeed.getText())
    return await taskDownloadSpeed.getText()
  }

  async downloadPaymentDev (taskPeers, isAutoRenew) {
    await taskPeers.click()
    await this.page.$('//Button[@Name="PAY"]').click()
    if (isAutoRenew) await this.page.$('//CheckBox[@Name="Enable auto renew"]').click()
    await this.page.$('//Button[@Name="Pay 2 point for 20MB data"]').click()
    await sleep(2000)
    await this.page.$('//Text[@Name="Alphabiz"]').click()
  }

  async downloadPaymentProd (taskPeers, isAutoRenew) {
    await taskPeers.click()
    await this.page.$('//Button[@Name="OK"]').click()
  }

  async deleteTask (torrentName) {
    await this.page.$('//Text[@Name="' + torrentName + '"]/following-sibling::Button[@Name="DELETE"]').click()
    await this.page.$('//*[@Name="Also delete files"]').click()
    await this.page.$('//Button[@Name="NOT NOW"]/following-sibling::Button[@Name="DELETE"]').click()
  }
}

module.exports = { HomePage }
