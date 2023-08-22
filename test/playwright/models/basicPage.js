const { test, expect } = require('@playwright/test')
const { BasePage } = require('./basePage')
class BasicPage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page

    this.saveBtn = page.locator('button:has-text("Save & Apply")')
    this.discardBtn = page.locator('button:has-text("Discard")')
    this.showExploreChk = page.locator('[aria-label="Show\ \[Explore\]\ page"]')
    this.i18n = {
      EN: {
        languageText: page.locator('.setting-block:has-text("language") .setting-label span'),
        languageSelect: page.locator('.setting-block:has-text("language") label'),
        languageListBtn: page.locator('[role="listbox"] >> text=english >> nth=0'),
        saveBtn: page.locator('button:has-text("Save & Apply")'),
        saveAlert: page.locator('[role="alert"]:has-text("Save preferences successfully!")')
      },
      CN: {
        languageText: page.locator('.setting-block:has-text("语言") .setting-label span'),
        languageSelect: page.locator('.setting-block:has-text("语言") label'),
        languageListBtn: page.locator('[role="listbox"] >> text=简体中文'),
        saveBtn: page.locator('button:has-text("保存并应用")'),
        saveAlert: page.locator('[role="alert"]:has-text("偏好设置成功")')
      },
      TW: {
        languageText: page.locator('.setting-block:has-text("語言") .setting-label span'),
        languageSelect: page.locator('.setting-block:has-text("語言") label'),
        languageListBtn: page.locator('[role="listbox"] >> text=繁體中文'),
        saveBtn: page.locator('button:has-text("保存並應用")'),
        saveAlert: page.locator('[role="alert"]:has-text("偏好設置成功")')
      }
    }
    // basic settings
    this.appearanceLabel = page.locator('text=appearance >> //following::Label[1]')
    // advanced settings
    this.updateChannelLabel = page.locator('text=update channel >> //following::Label[1]')
    this.saveAlert = page.locator('[role="alert"]:has-text("Save preferences successfully!")')
  }

  async saveLanguage (startLanguage, targetLanguage) {
    let basicPage
    if (startLanguage === 'EN') {
      console.log('原语言是EN')
      basicPage = 'basicLink'
    }else{
      console.log('原语言不是EN')
      basicPage = 'basicLink_' + startLanguage
    }
    console.log('跳转到基础设置页')
    // await this.jumpPage(basicPage) //因为语言不是EN，所以不能使用jumpPage
    const basicIcon = this.page.locator('.q-item:has-text("assignment")')
    // console.log('判断是否是小屏')
    // const isHidden = await basicIcon.isHidden()
    // if (isHidden) {
    //   console.log('是小屏幕')
    //   await basePage.menuIcon.click({ timeout: 60000 })
    //   console.log('点击三条杠')
    // } else {
    //   console.log('是大屏幕')
    // }
    await basicIcon.click()
    console.log('点击基础设置')
    console.log('跳转成功')
    await this.i18n[startLanguage].languageText.click({ force: true })
    console.log('点击语言框')
    await this.i18n[startLanguage].languageSelect.click()
    console.log('点击下拉框')
    await this.i18n[targetLanguage].languageListBtn.click()
    console.log('点击目标语言')
    await this.i18n[targetLanguage].saveBtn.click()
    console.log('点击保存，等待提示出现')
    await this.i18n[targetLanguage].saveAlert.waitFor()
    console.log('提示出现，等待提示消失')
    await this.page.waitForTimeout(5000)
    // try{
    //   await this.i18n[targetLanguage].saveAlert.waitFor({state:'detached'})
    //   console.log('提示消失')
    // }catch(error){
    //   console.log('没有探测到提示消失，直接下一步')
    // }
  }

  async setChannel (targetChannel) {
    await this.jumpPage('advancedLink')
    const currentChannel = await this.updateChannelLabel.innerText()
    if (!currentChannel.includes(targetChannel)) {
      await this.updateChannelLabel.click()
      await this.page.locator(`[role="listbox"] >> text=${targetChannel}`).click()
      await this.saveSetting()
    }
  }

  async setAppearance (targetAppearance) {
    await this.jumpPage('basicLink')
    const currentAppearance = await this.appearanceLabel.innerText()
    if (!currentAppearance.includes(targetAppearance)) {
      await this.appearanceLabel.click()
      await this.page.locator(`[role="listbox"] >> text=${targetAppearance}`).click()
      await this.saveSetting()
    }
  }

  async saveSetting () {
    await this.saveBtn.click()
    await this.saveAlert.waitFor()
    await this.page.waitForTimeout(1000)
  }
}

module.exports = { BasicPage }