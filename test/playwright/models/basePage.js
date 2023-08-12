const { expect } = require('@playwright/test')
const app = require('../../../developer/app.js')
class BasePage {
  constructor (page) {
    this.page = page
    this.isMac = process.platform === 'darwin'
    this.modifier = this.isMac ? 'Meta' : 'Control'
    // menu
    const leftDrawerClass = '.left-drawer-menu'
    this.menuIcon = page.locator('[aria-label="Menu"]')
    this.headerTitle = page.locator('.crumb-label')

    this.libraryLink = page.locator(`${leftDrawerClass} >> text=Library`)
    this.homeLink = page.locator(`${leftDrawerClass} >> .q-item__label:has-text("home")`)
    this.followingLink = page.locator(`${leftDrawerClass} >> text=following`)
    this.localFavoritesLink = page.locator(`${leftDrawerClass} >> text=local favorites`)
    this.exploreLink = page.locator(`${leftDrawerClass} >> text=travel_explore Explore`)
    this.editLink = page.locator(`${leftDrawerClass} >> text=edit_note Publish`)
    this.downUpLink = page.locator('text=HomeDownload/Upload and Media Files')
    this.downloadingStatus = page.locator(`${leftDrawerClass} #downloading`)
    this.uploadingStatus = page.locator(`${leftDrawerClass} #uploading`)
    this.downloadedStatus = page.locator(`${leftDrawerClass} #downloaded`)
    this.playerLink = page.locator(`${leftDrawerClass} >> text=Player`)
    this.creditsLink = page.locator(`${leftDrawerClass} >> text=credits`)
    this.walletLink = page.locator(`${leftDrawerClass} >> text=account_balance_wallet Wallet`)
    this.settingsLink = page.locator(`${leftDrawerClass} >> text=Settings for App`)
    this.accountSettingLink = page.locator(`${leftDrawerClass} >> text=account_circle Account`)

    this.basicLink = page.locator(`${leftDrawerClass} >> text=Basic`)
    this.basicLink_CN = page.locator(`${leftDrawerClass} >> text=基础设置`)
    this.basicLink_TW = page.locator(`${leftDrawerClass} >> text=基礎設置`)

    this.advancedLink = page.locator(`${leftDrawerClass} >> text=Advanced`)
    this.developmentLink = page.locator(`${leftDrawerClass} >> text=Development`)

    this.accountLink = page.locator('.corner')
    this.accountSignIn = page.locator('.corner-account >> button:has-text("Sign in")')
    this.accountLogo = page.locator('.corner-account-info >> .logo')
    this.accountLogoImage = page.locator('.corner-account-info >> .logo .q-img__image')
    this.accountRatingTabel = page.locator('.corner-account-info >> [role="alert"]:has-text("Lv.")')
    this.accountMore = page.locator('.corner-account-info >> button:has-text("more_horiz")')
    this.accountSettings = page.locator('[data-cy="account-settings-btn"]')
    // tool bar
    this.appBarIcon = page.locator('.application-bar-icon .q-img__image')
    this.appBarTitle = page.locator('.application-bar-title')
    // header bar
    this.versionBtn = page.locator('#version')
    this.updateVersionBtn = page.locator('header i:has-text("update")')
    this.walletPageHeader = page.locator('header >> text=Walletaccount_balance_wallet')
    // update card
    const updateCardCss = '.q-card:has-text("Current version")'
    this.updateCard = page.locator(updateCardCss)
    this.updateCardCurrentVersion = page.locator(`${updateCardCss} .current-version`)
    this.updateCardReleaseInfo = page.locator(`${updateCardCss} .release-infomation`)
    this.updateCardCheckBtn = page.locator(`${updateCardCss} button:has-text("Check for update")`)
    this.updateCardUpdateBtn = page.locator(`${updateCardCss} button:has-text("update now")`)
    this.updateCardCloseBtn = page.locator(`${updateCardCss} button:has-text("close")`)
    // Version out of date card
    const versionOutOfDateCardCss = '.q-card:has-text("Version out of date")'
    this.versionOutOfDateCard = page.locator(versionOutOfDateCardCss)
    this.versionOutOfDateCardUpdateBtn = page.locator(`${versionOutOfDateCardCss} button:has-text("update now")`)
    // about dialog
    const aboutDialogCss = '.q-card:has(.alphabiz-logo)'
    this.aboutDialog = page.locator(aboutDialogCss)
    this.alphabizLogo = page.locator('.alphabiz-logo')
    this.alphabizName = page.locator(`${aboutDialogCss} .text-h5`)
    this.releaseBtn = page.locator('text=release notes')
    this.licenseBtn = page.locator('text=the license and terms')
    this.submitFeedbackBtn = page.locator(`${aboutDialogCss} button:has-text("Submit feedback")`)
    this.networkDiagnoticBtn = page.locator(`${aboutDialogCss} button:has-text("Network Diagnotic")`)
    this.AboutDialogCloseBtn = page.locator(`${aboutDialogCss} button:has-text("close")`)
    // license and terms card
    const licenseCard = '.q-card:has(div[role="tab"]:has-text("License"))'
    this.licenseCard = page.locator(licenseCard)
    this.licenseTab = page.locator(`${licenseCard} [role="tab"]:has-text("License")`)
    this.termsTab = page.locator(`${licenseCard} [role="tab"]:has-text("Terms")`)
    this.licenseContent = page.locator(`${licenseCard} .markdown-content:has-text("GNU GENERAL PUBLIC LICENSE")`)
    this.termsContent = page.locator(`${licenseCard} .markdown-content:has-text("Terms of Service TESTING")`)
    this.licenseCardCloseBtn = page.locator(`${licenseCard} button:has-text("close")`)
    // feedback card
    const feedbackCardCss = '.q-card:has-text("select a type")'
    this.feedbackCard = page.locator(feedbackCardCss)
    this.feedbackCardType = page.locator(`${feedbackCardCss} >> text=select a type >> //following::Label[1]`)
    this.feedbackCardCategory = page.locator(`${feedbackCardCss} >> text=select a category >> //following::Label[1]`)
    this.feedbackCardTitle = page.locator(`${feedbackCardCss} >> text=title >> //following::input[1]`)
    this.feedbackCardDescInput = page.locator(`${feedbackCardCss} textarea`)
    this.feedbackCardDescCloseBtn = page.locator(`${feedbackCardCss} button:has-text("cancel")`)
    this.feedbackCardDescSubmitBtn = page.locator(`${feedbackCardCss} button:has-text("submit feedback")`)
    // Network Diagnotic card
    const networkDiagnoticCardCss = '.diagnotic-main:has-text("Network Diagnotic")'
    this.networkDiagnoticCard = page.locator(networkDiagnoticCardCss)
    this.networkDiagnoticCardCheckBtn = page.locator(`${networkDiagnoticCardCss} button:has-text("Diagnotic")`)
    this.networkDiagnoticCardCloseBtn = page.locator(`${networkDiagnoticCardCss} button:has-text("Close")`)
    // account card
    this.accountInput = page.locator('[aria-label="Phone number or email"]')
    this.passwordInput = page.locator('[aria-label="Password"]')
    this.signInBtn = page.locator('.q-card:has-text("Forgot your password?") >> button:has-text("Sign in") >> nth=0')
    this.signUpBtn = page.locator('button:has-text("Sign up")')
    this.signOutItem = page.locator('.corner-menu__list div:has-text("Sign out").q-item')
    this.signOutAnywayBtn = page.locator('button:has-text("Sign out anyway")')
    this.languageBtn = page.locator('.signed-out-actions button:has-text("language")')
    this.account = page.locator('text = Account >> nth=1')
    // alert
    this.alert = page.locator('.q-notifications__list--bottom.items-end >> .q-notification__message')
    this.centerAlert = page.locator('.q-notifications__list--bottom [role="alert"]')
    this.signInAlert = page.locator('div[role="alert"]:has-text("Signed in")')
    this.signOutAlert = page.locator('div[role="alert"]:has-text("check_circleSigned out")')
    this.defaultAppAlert = page.locator(`text=${app.name} is not your default app for`)
    this.noShowAgainBtn = page.locator('text=SHOW AGAIN')
    // recommend
    this.recommendTitle = page.locator('text=Recommend')
    // this.recommendCard = page.locator('[style="width: 100%; height: 280px;"] >> nth=0')
    this.getOne = page.locator('.library-view .library-recommend .recommends .channel-card')
    this.recommendCard = page.locator('.channel-card >> nth=0')
    this.recommendCardSelected = page.locator('.channel-card.selected')
    this.recommendFollowOenBtn = page.locator('button:has-text("starFollow 1 channels and continue")')

    // initialization
    // publish
    this.publishChannelLog = page.locator('.channel-card >> button:has-text("delete")')
    this.publishEitdCard = page.locator('.add-channel')
    this.channelDeleteBtn = page.locator('.channel-card >> button:has-text("delete") >> nth=0')
    this.removeBtn = page.locator('button:has-text("Remove")')
    // block
    this.blockBtn = page.locator('button:has-text("Block list manage")')
    this.blockList = page.locator('tbody :has-text("remove_circle_outline") >> button')
    this.unblockBtn = page.locator('tbody :has-text("remove_circle_outline") >> nth=0 >> button')
    // follow
    this.followList = page.locator('.channel-card:has-text("content_copy")')
    this.followBtn = page.locator('.relative-position .follow-btn >> nth=0')
    this.unfollowBtn = page.locator('button:has-text("Unfollow")')
    // favorites
    this.starBtn = page.locator('button:has-text("star")')
    this.empty = page.locator('text=No data available')
  }
  /**
   * 
   * @param {string} selector 
   * @param {object} options
   * @param {string} msg 
   * @returns 
   */
  async waitForSelectorOptional (selector, options, msg) {
    try {
      return await this.page.waitForSelector(selector, options);
    } catch (error) {
      if (error.message.includes('Timeout')) {
        if(msg)console.log(msg)
        return null;
      } else {
        throw error; // 如果错误不是由于超时导致的，我们应该将其抛出
      }
    }
  }

  /**
   *
   * @param {string} target - homeLink、playerLink、creditsLink、accountLink
   */
  async jumpPage (firstTarget, secondTarget) {
    const menuButton = await this[secondTarget] || await this[firstTarget]
    await this.page.waitForTimeout(500)
    const isHidden = await this[firstTarget].isHidden()
    if (isHidden) {
      await this.menuIcon.click({ timeout: 60000 })
    }
    if (secondTarget) {
      if (await menuButton.isHidden()) {
        await this[firstTarget].click()
      }
    }
    await menuButton.click()
    if (firstTarget === 'accountMore') return
    await this.page.waitForTimeout(1500)
    if(await menuButton.isVisible()){
      const buttonBoundingBox = await menuButton.boundingBox()
      const {x,y,width,height} = buttonBoundingBox;
      const clickX = x + width + 20 //假设相对于按钮的右侧有20px的空白区域
      const clickY = y + height/2 //点击位置垂直居中
      await this.page.mouse.click(clickX,clickY)
    }
  }

  async closeInternalNotice () {
    const internalNoticeCss = '.q-card:has-text("INTERNAL DEMO ONLY")'
    await this.page.locator(internalNoticeCss).waitFor()
    await Promise.all[
      this.page.locator(internalNoticeCss).waitFor({ state: 'hidden', timeout: 30000 }),
      this.page.locator(`${internalNoticeCss} button:has-text("close")`).click()
    ]
    await this.page.waitForTimeout(2000)
  }

  async newReload () {
    console.log('调用一次newReload')
    await this.page.reload()
    if (app.displayName === 'Alphabiz') {
      const version = await this.versionBtn.innerText()
      if (version.includes('internal') || version.includes('nightly')) {
        // await this.closeInternalNotice()
      }
    }
  }

  async checkForPopup () {
  while (true) {
    // 循环时间，监督弹窗的出现
    try {
      await this.page.waitForSelector('.q-card:has-text("INTERNAL DEMO ONLY")', { timeout: 45464646 });
      console.log('疑似弹窗，观察1s')
      await this.page.waitForTimeout(1000)
      const confirm = await this.page.waitForSelector('.q-card:has-text("INTERNAL DEMO ONLY")', { timeout: 1000 });
      if(confirm){
        console.log('checkForPopup发现了弹窗')
        await this.closeInternalNotice() 
        console.log('checkForPopup关闭了弹窗')
      }else{
        console.log('消失了')
      }
    } catch (error) {
      if (error.message.includes('Timeout')) {
        return null;
      } else {
        console.log(error.message)
        await this.page.waitForTimeout(5000)
      }
    }
  }
}


  async clearLocalstorage () {
    await this.page.evaluate(() => { localStorage.clear() })
    await this.page.waitForTimeout(1000)
    await this.newReload()
  }

  async setToken () {
    await this.page.evaluate(() => { localStorage.clear() })
    const libraryName = app.name === 'Alphabiz' ? 'ab' : app.name.toLowerCase()
    const libraryPair = `library-pair@${libraryName}-test-cate-v4-2`
    // console.log('that.libraryPair', libraryPair)
    await this.page.evaluate((libraryPair) => {
      localStorage.setItem(libraryPair, '{"epub":"8idxYmEadAwjoU7U1J056cyHzUeoXSslOBCAP73WZyc.mdvNkj-aK7AyEEJFo0vSm752BIgUPZHoDs7IbZuopTs","pub":"fBH0GXG8L38EBkqkBSyXbMFVHkEYUK7s4ynPupdvp8E.XD52mHLI7O-Ad1JzAkDn2brY5-GLfbkSgP-3pB6k4Qs","epriv":"rsdtLTMMiDthgCttGqsKJTYcMRgu6Z8GD8SP4GW3VYk","priv":"m6mRg3N8qLRq_wsr1wiazT6YYVUhqZJGEUKu_drxINQ"}')
      localStorage.setItem('set-film-rate', 'G')
    }, libraryPair)
    await this.page.waitForTimeout(1000)
    await this.newReload()
  }

  async quickSaveLanguage (targetLanguage) {
    let language
    if (targetLanguage === 'EN') {
      language = 'English'
      await this.languageBtn.click()
      await this.page.locator('label .q-item__section >> nth=0').click()
    } else if (targetLanguage === 'CN') language = '简体中文'
    else if (targetLanguage === 'TW') language = '繁體中文'
    await this.languageBtn.click()
    await this.page.locator(`.q-item__label:has-text("${language}") >> nth=0`).click()
  }

  async signIn (username, password, isWaitAlert, isSetToken = true) {
    if (isSetToken) {
      await this.setToken()
    }
    await this.page.waitForLoadState()
    if (process.platform === 'darwin') await this.page.waitForTimeout(2000)
    if (!await this.accountInput.isVisible()) {
      console.log('看不到accountInput')
      this.jumpPage('accountSignIn')
    } else{
      console.log('看见了accountInput')
      this.page.waitForTimeout(1000)
    }
    await this.accountInput.click()
    await this.page.keyboard.type(username, { delay: 100 })
    await this.passwordInput.click()
    await this.page.keyboard.type(password, { delay: 100 })
    await this.signInBtn.click()

    if (isWaitAlert) {
      await this.alert.waitFor({ timeout: 90000 })
      const alertText = await this.alert.innerText()
      console.log('alert: [ ', alertText, ' ]')
      if (alertText.includes('ReCAPTCHA validation failed')) {
        await this.waitForAllHidden(await this.alert)
        await this.signInBtn.click()
        await this.alert.waitFor({ timeout: 90000 })
        const alertText = await this.alert.innerText()
        console.log('alert: [ ', alertText, ' ]')
      } else if (alertText.includes('Incorrect username or password')) {
        return "incorrect"
      } else if (alertText.includes('Password attempts exceeded')) {
        return "trylater"
      }
      await this.signInAlert.waitFor()
      return "success"
      // if (isSetToken) await this.waitLoadingLibKey()
    }
    if (isSetToken) {
      await this.page.waitForTimeout(10000)
      await this.recommendHandle()
      await this.page.locator('.post-card').nth(0).waitFor({ timeout: 30000 })
    }
    await this.recommendHandle()
  }

  async signOut () {
      await this.jumpPage('accountMore')
      if(await this.signOutItem.isVisible()){
        console.log('捕获到退出选项')
        const box = await this.signOutItem.boundingBox()
        const {x,y,width,height} = box
        const clickX = x + width/2
        const clickY = y + height/2
        await this.page.mouse.click(clickX,clickY)
      }else{
        console.log('没有捕获到退出选项')
      }
      await this.page.waitForTimeout(1000)
      if (await this.signOutAnywayBtn.isVisible()) { await this.signOutAnywayBtn.click() }
      await this.signOutAlert.waitFor()
      await this.page.waitForTimeout(3000)
      await this.waitForAllHidden(await this.alert)
  }

  /**
   * 
   * @param {*} username 
   * @param {*} password 
   * @param {*} isWaitAlert 
   * @param {*} isSetToken 
   * @returns message {"incorrect", "trylater", "success", "alreadyIn"}
   */
  // Determine whether to log in and log in for download tests
  async ensureLoginStatus (username, password, isWaitAlert, isSetToken = true) {
    await this.page.waitForTimeout(500)
    // const count = await this.page.locator('.q-card:has-text("INTERNAL DEMO ONLY")').count()
    // if (count) await this.closeInternalNotice()
    // if not logged in
    let message = "alreadyIn";
    if (await this.accountInput.isVisible()) {
      message = await this.signIn(username, password, isWaitAlert, isSetToken)
    } else {
      await this.page.waitForTimeout(4000)
      const leftBar = await this.downloadingStatus.isVisible()
      if (!leftBar) {
        await this.menuIcon.click({noWaitAfter: true})
      }
      if (await this.accountSignIn.isVisible()) {
        message = await this.signIn(username, password, isWaitAlert, isSetToken)
      }
      try {
        await this.accountMore.waitFor({ timeout: 10000 })
        if (await this.page.locator('text=Loading lib key').isVisible()) {
          // await this.waitLoadingLibKey()
        }
      } catch {
        await this.page.evaluate(() => localStorage.clear())
        await this.newReload()
        message = await this.signIn(username, password, isWaitAlert, isSetToken)
      }
    }
    return message
  }

  async checkUpdate (channel, opt = { force: false }) {
    let versionReg
    if (channel === 'stable') {
      versionReg = /New\sversion\s\d+.\d+.\d+\sis\savailable/gm
    } else if (channel === 'nightly') {
      versionReg = /New\sversion\s\d+.\d+.\d+-nightly-\d{12}\sis\savailable/gm
    } else if (channel === 'internal') {
      versionReg = /New\sversion\s\d+.\d+.\d+-internal-\d{12}\sis\savailable/gm
    }
    if (!opt.force) {
      await this.updateVersionBtn.click()
      await this.updateCard.waitFor()
      if (await this.updateCardCheckBtn.isVisible()) {
        await this.updateCardCheckBtn.click()
        await this.updateCardUpdateBtn.waitFor({ timeout: 40000 })
      }
    } else {
      await this.versionOutOfDateCard.waitFor()
      await this.versionOutOfDateCardUpdateBtn.click()
    }
    const releaseInfo = await this.updateCardReleaseInfo.innerText()
    await expect(await this.updateCardReleaseInfo).toHaveText(versionReg)
    if (!opt.force) {
      await this.updateCardCloseBtn.click()
      await expect(await this.updateCard).toHaveCount(0)
    }
  }

  async waitLoadingLibKey () {
    try {
      await this.page.locator('text=Loading lib key').waitFor('visible', { timeout: 10000 })
      await this.waitForAllHidden(await this.page.locator('text=Loading lib key'), 90000)
    } catch {
      console.log('not wait loading lib key')
    }
    try {
      const headerTitle = await this.headerTitle.innerText()
      console.log('headerTitle', headerTitle)
      if (headerTitle.includes('Library')) {
        await this.page.locator('.post-card').nth(0).waitFor('visible', { timeout: 30000 })
      }
    } catch (e) {
      if (await this.page.locator('.q-card:has-text("No available post")').isVisible()) {
        await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")').click()
        expect(await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")')).toHaveCount(0)
      }
    }
    if (await this.page.locator('.q-card:has-text("No available post")').isVisible()) {
      await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")').click()
      expect(await this.page.locator('.q-card:has-text("No available post") button:has-text("Cancel")')).toHaveCount(0)
    }
  }

  async waitForAllHidden (locator, timeout = 30000, waitTime = 200) {
    const start = Date.now()
    const elementsVisible = async () => (await locator.evaluateAll(elements => elements.map(element => element.hidden))).includes(false)

    while (await elementsVisible()) {
      if (start + timeout < Date.now()) {
        console.log(`Timeout waiting for all elements to be hidden. Locator: ${locator}. Timeout: ${timeout}ms`)
        expect(1).toBe(0)
      }
      if (waitTime) await this.page.waitForTimeout(waitTime)
    }
    // console.log(`All elements hidden: ${locator}`)
  }

  async checkAlert (logTitle, regex, options = { timeout: 60000 }) {
    if (typeof options.timeout === 'undefined') options.timeout = 60000
    if (typeof options.isWaitAlertHidden === 'undefined') options.isWaitAlertHidden = false
    if (typeof options.position === 'undefined') options.position = 'end'
    if (typeof options.isLog === 'undefined') options.isLog = true
    let alert = 'alert'
    if (options.position === 'center') {
      alert = 'centerAlert'
    }
    // wait alert
    await this[alert].waitFor({ timeout: options.timeout })
    const alertText = await this[alert].innerText()
    if (options.isLog) {
      console.log(`${logTitle} alert message: [ ${alertText} ]`)
    }
    await expect(this[alert]).toHaveText(regex)
    if (options.isWaitAlertHidden) {
      await this.waitForAllHidden(await this[alert])
    }
    return alertText;
  }

  async recommendHandle () {
    if (await this.recommendTitle.nth(0).isVisible()) {
      // 如果已经选了第一个，就不用再点击了直接点击关注
      if (await this.recommendCardSelected.isVisible()) {
        await this.recommendFollowOenBtn.click()
        return true
      } else {
        await this.recommendCard.click()
        await this.recommendFollowOenBtn.click()
        return true
      }
    }
    if (await this.recommendTitle.nth(1).isVisible()) {
      await this.getOne.nth(0).click()
      await this.recommendFollowOenBtn.click()
      return true
    }
    return false
  }

  async deletePublish () {
    await this.jumpPage('editLink')
    await this.page.waitForTimeout(3000)
    if (await this.recommendTitle.isVisible()) await this.jumpPage('editLink')
    await this.publishEitdCard.waitFor()
    await this.page.waitForTimeout(10000)
    let logLen = await this.publishChannelLog.count()
    // console.log('logLen: [ ', logLen, ' ]')
    if (!logLen) return false
    while (logLen) {
      await logLen--
      await this.page.waitForTimeout(1000)
      await this.channelDeleteBtn.click()
      await this.page.waitForTimeout(1000)
      await this.removeBtn.click()
      await this.page.waitForTimeout(2000)
    }
    await this.page.waitForTimeout(60000)
    return true
  }

  async deleteBlock () {
    await this.jumpPage('accountSettingLink')
    await this.page.waitForTimeout(3000)
    if (await this.recommendTitle.isVisible()) await this.jumpPage('accountSettingLink')
    await this.blockBtn.click()
    await this.page.waitForTimeout(10000)
    let logLen = await this.blockList.count()
    // console.log('logLen: [ ', logLen, ' ]')
    if (!logLen) return false
    while (logLen) {
      await logLen--
      await this.page.waitForTimeout(1000)
      await this.unblockBtn.click()
      await this.page.waitForTimeout(2000)
    }
    return true
  }
}

module.exports = { BasePage }
