const { expect } = require('@playwright/test')
const { BasePage } = require('./basePage')
const { getMailCode } = require('../../utils/getCode')

class AccountPage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page

    this.abkInput = page.locator('[data-cy="abk-input"]')
    // create keys card(ck)
    const createKeyCardCss = '.q-card:has-text("Create or import library key")'
    this.ckCard = page.locator(createKeyCardCss)
    this.ckCreateChk = page.locator(`${createKeyCardCss} [role="radio"]:has-text("Create a new library key")`)
    this.ckImportChk = page.locator(`${createKeyCardCss} [role="radio"]:has-text("Import a library key Locally")`)
    this.ckFromcloudChk = page.locator(`${createKeyCardCss} [role="radio"]:has-text("Import the library key from the cloud")`)
    this.ckOkBtn = page.locator(`${createKeyCardCss} button:has-text("ok")`)
    // store your library key(sk)
    this.skCard = page.locator('.q-card:has-text("Store your")')
    this.skSaveLocalChk = page.locator('[aria-label="Save as local encrypted file"]')
    this.skSaveCloudChk = page.locator('[role="radio"] >> text=backup')
    this.skUpdateCloudChk = page.locator('[role="radio"] >> text=backup')
    this.skOKBtn = page.locator('.q-card:has-text("store") button:has-text("OK")')
    this.skCancelBtn = page.locator('.q-card:has-text("store") button:has-text("cancel")')
    this.skOKBtnTwo = page.locator('button:has-text("OK") >> nth=2')
    this.loadCard = page.locator('text = Loading library key...')
    this.backCard = page.locator('text = Backing up...')
    // Confirm to update the cloud key(up)
    this.ukOKBtn = page.locator('.q-card:has-text("You already have a key in the cloud") button:has-text("OK")')
    // enter independent password(eip)
    const eipCardCss = '.q-card:has-text("enter independent password")'
    this.eipCard = page.locator(eipCardCss)
    this.eipInput = page.locator(`${eipCardCss} input`)
    this.eipOKBtn = page.locator(`${eipCardCss} button:has-text("ok")`)
    // this.eipABPasswordBtn = page.locator(`${eipCardCss} button:has-text("alphabiz account password")`)
    this.eipOKBtn = page.locator(`${eipCardCss} button:has-text("ok")`)
    this.eipCancelBtn = page.locator(`${eipCardCss} button:has-text("cancel")`)

    // security
    const securityFragment = '.setting-fragment:has-text("security")'
    this.changePasswordBtn = page.locator(`${securityFragment} button:has-text("Change password")`)

    const changePassword = '.q-card:has-text("change password")'
    this.changePasswordCard = page.locator(changePassword)
    this.cpCurrentPasswordInput = page.locator(`${changePassword} [aria-label="Current password"]`)
    this.cpNewPasswordInput = page.locator(`${changePassword} [aria-label="New password"]`)
    this.cpReEnterInput = page.locator(`${changePassword} [aria-label="Re-enter new password"]`)
    this.cpSubmitBtn = page.locator(`${changePassword} button:has-text("ok")`)
    this.cpCancelBtn = page.locator(`${changePassword} button:has-text("Cancel")`)

    // library setting
    this.editUserBtn = page.locator('button:has-text("Edit user profile")')
    this.BlockListBtn = page.locator('button:has-text("Block list manage")')
    this.NoBlockChannel = page.locator('text=No blocked channel')
    this.BlockListCancelBtn = page.locator('.q-card:has-text("block list") button:has-text("closeCancel")')
    // edit user profile card(eup)
    const editUserProfile = '.q-card:has-text("Edit user profile")'
    this.eupCard = page.locator(editUserProfile)
    this.eupNicknameInput = page.locator(`${editUserProfile} input[aria-label="Nickname"]`)
    this.eupDescInput = page.locator(`${editUserProfile} input[aria-label="Description"]`)
    this.eupAvatarInput = page.locator(`${editUserProfile} input[aria-label="Avatar(url)"]`)
    this.eupSubmitBtn = page.locator(`${editUserProfile} button:has-text("Submit")`)
    this.eupOKBtn = page.locator(`${editUserProfile} button:has-text("OK")`)
    // keychain(kc)
    const keyChainBanner = '.q-banner:has-text("Keychain Sync Status")'
    this.kcCard = page.locator('.q-banner:has-text("Keychain Sync Status")')
    this.kcRefreshBtn = page.locator(`${keyChainBanner} button:has-text("refresh")`)
    this.kcCloudBtn = page.locator(`${keyChainBanner} button:has-text("cloud storage")`)
    this.kcEnCloudBtn = page.locator(`${keyChainBanner} button:has-text("Enable cloud storage")`)
    this.kcDisCloudBtn = page.locator(`${keyChainBanner} button:has-text("Disable cloud storage")`)
    this.kcChangePasswordBtn = page.locator(`${keyChainBanner} button:has-text("Change Password")`)
    // enable cloud storage card(ecs)
    const enableCloudCardCss = '.q-card:has-text("set a password")'
    this.enableCloudCard = page.locator(enableCloudCardCss)
    this.ecsUseAbPasswordBtn = page.locator(`${enableCloudCardCss} button:has-text("alphabiz account password")`)
    this.ecsUseInPasswordBtn = page.locator(`${enableCloudCardCss} button:has-text("independent password")`)
    this.ecsCanelBtn = page.locator(`${enableCloudCardCss} button:has-text("cancel")`)
    // config password card(cfgp)
    const configPasswordCard = '.q-card:has-text("change password")'
    this.cfgpCard = page.locator(configPasswordCard)
    this.cfgpCurrentPasswordInput = page.locator(`${configPasswordCard} input[aria-label="Current password"]`)
    this.cfgpNewPasswordInput = page.locator(`${configPasswordCard} input[aria-label="New password"]`)
    this.cfgpReEnterPasswordInput = page.locator(`${configPasswordCard} input[aria-label="Re-enter password"]`)
    this.cfgpOKBtn = page.locator(`${configPasswordCard} button:has-text("OK")`)
    this.cfgpCancelBtn = page.locator(`${configPasswordCard} button:has-text("Cancel")`)
    // disable cloud storage(dc)
    const disableCloudCard = '.q-card:has-text("disable cloud storage")'
    this.dcDisCloudBtn = page.locator(`${disableCloudCard} button:has-text("Disable cloud storage")`)
    this.dcCancelBtn = page.locator(`${disableCloudCard} button:has-text("Cancel")`)
    // library key
    this.libraryKeyMoreBtn = page.locator('.q-item:has-text("library key") button:has-text("more_vert")')
    this.importKeyBtn = page.locator('.q-item:has-text("Import key locally")')
    this.exportKeyBtn = page.locator('.q-item:has-text("Export Key from Cloud")')
    this.backupKeyBtn = page.locator('.q-item:has-text("Backup current key")')

    // export key file card(ekf)
    const exportKeyFile = '.q-card:has-text("export key file")'
    this.ekfCloudPasswordInput = page.locator('[aria-label="Cloud independent password"]')
    this.ekfKeyFilePasswordInput = page.locator('[aria-label="Key file unlock password"]')
    this.ekfOKBtn = page.locator(`${exportKeyFile} button:has-text("OK")`)
    // alert
    this.successAlert = page.locator('[role="alert"]:has-text("Success")')

    // recommend page
    this.recommendTitle = page.locator('text=Recommend >> nth=0')
    // this.getOne = page.locator('[style="width: 100%; height: 280px;"] >> nth=0')
    this.recommendCard = page.locator('.channel-card >> nth=0')
    this.recommendCardSelected = page.locator('.channel-card.selected')
    this.recommendFollowOenBtn = page.locator('button:has-text("starFollow 1 channels and continue")')

    // account
    this.account = page.locator('text = Account >> nth=1')
  }

  async changePassword (oldPassword, newPassword) {
    await this.changePasswordBtn.click()
    await this.changePasswordCard.waitFor()
    await this.cpCurrentPasswordInput.fill(oldPassword)
    await this.cpNewPasswordInput.fill(newPassword)
    await this.cpReEnterInput.fill(newPassword)
    await this.cpSubmitBtn.click()
    let alertText = await this.checkAlert('changePassword', /(Password has been reset)|(Attempt limit exceeded, please try after some time)/)
    if (alertText.includes("Password has been reset")){
      return true;
    } else if (alertText.includes("Attempt limit exceeded, please try after some time")){
      return false;
    } else{
      return false;
    }
  }

  async resetPassword (account, newPassword) {
    await this.page.click('text=Reset password')
    await this.page.click('text=Find your account')
    await this.page.fill('[aria-label="Phone number or email"]', account)
    await this.page.click('.q-card >> button:has-text("Search")')
    // 验证信息
    const newTime = new Date()
    newTime.setMinutes(newTime.getMinutes() - 1); // 将时间往前挪一分钟
    const verificationCode = await getMailCode({ type: 1, time: newTime, to: account })
    if(verificationCode === 0) {
      console.log('cannot fetch the code')
      throw error
    }
    await this.page.fill('[aria-label="Verification code"]', verificationCode.toString())
    await this.page.fill('[aria-label="Password"]', newPassword)
    await this.page.fill('[aria-label="Re-enter password"]', newPassword)
    await this.page.click('button:has-text("Submit")')
    // 断言提示框成功弹出
    await this.checkAlert('changePassword', /Password has been reset/)
    await this.page.waitForTimeout(2000)
  }

  getBlockListCloseBtn (channelTitle) {
    return this.page.locator(`tr:has-text("${channelTitle}") button:has-text("remove_circle_outline")`)
  }

  async isUseABPassword (password, isABPassword) {
    if (!isABPassword) {
      await this.page.waitForTimeout(1000)
      await this.ecsUseInPasswordBtn.click()
      await this.eipCard.waitFor()
      await this.eipInput.nth(0).fill(password)
      await this.eipInput.nth(1).fill(password)
      await this.eipOKBtn.click()
    } else {
      await this.ecsUseAbPasswordBtn.click()
    }
  }

  /**
   * @function checkChannelFollowStatus
   * @description 创建密钥
   * @param { string } password 密钥独立密码
   * @param { boolean } isUpdate 是否是更新密钥
   * @param { boolean } isABPassword 是否使用aws账号密码
   */
  async createCloudKey (password, isUpdate, isABPassword) {
    if (typeof isABPassword === 'undefined') isABPassword = true
    // 创建新的密钥
    await this.ckCreateChk.waitFor({ timeout: 60000 })
    await this.ckOkBtn.click({ trial: true })
    await this.ckCreateChk.click()
    await this.ckOkBtn.click()
    // 储存密钥
    await this.skCard.waitFor({ timeout: 60000 })
    await this.skSaveCloudChk.click({ timeout: 10000 })
    await this.skOKBtn.click()
    await this.skOKBtnTwo.click()
    // await this.waitForSelector(this.backCard, { visible: true })
    // await this.waitForSelector(this.loadCard, { visible: true })
    await this.page.waitForTimeout(20000)
    if (await this.recommendTitle.isVisible()) await this.recommendSelected()
  }

  // 登录后同步云端密钥
  async syncCloudKey (password, options = { isABPassword: false }) {
    if (typeof options.isABPassword === 'undefined') options.isABPassword = false
    if (typeof options.isCorrectPassword === 'undefined') options.isCorrectPassword = true
    // 导入云端密钥
    await this.ckFromcloudChk.waitFor()
    await this.page.waitForTimeout(1000)
    await this.ckFromcloudChk.click()
    await this.ckOkBtn.click()
    if (!options.isABPassword) {
      // 输入独立密钥
      await this.eipInput.fill(password)
      await this.page.waitForTimeout(1000)
      await this.eipOKBtn.click()
      if (!options.isCorrectPassword) {
        // 不是正确的密码
        await this.checkAlert('password error', /Password error/, { isWaitAlertHidden: true })
      }
    }
  }

  // account page keychain
  async enableCloudKey (password, isABPassword) {
    await this.jumpPage('accountSettingLink')
    await this.kcEnCloudBtn.waitFor()
    await expect(this.kcCard).toHaveText(/cloud_off/)
    await this.kcEnCloudBtn.click()
    await this.page.waitForTimeout(1000)
    await this.isUseABPassword(password, isABPassword)
    // wait alert
    await this.checkAlert('enableCloudKey', /Success/)
    // check keychain banner
    await this.kcDisCloudBtn.waitFor()
    await expect(this.kcCard).toHaveText(/Sync Keychain with Amazon Web Services/)
    if (isABPassword) {
      await expect(this.kcCard).toHaveText(/Alphabiz account password/)
    }
  }

  async cfgKeyPassword (oldPassword, newPassword) {
    await this.jumpPage('accountSettingLink')
    await this.kcChangePasswordBtn.waitFor({ timeout: 30000 })
    await this.kcChangePasswordBtn.click()
    await this.cfgpCard.waitFor()
    await this.cfgpCurrentPasswordInput.fill(oldPassword)
    await this.cfgpNewPasswordInput.fill(newPassword)
    await this.cfgpReEnterPasswordInput.fill(newPassword)
    await this.cfgpOKBtn.click()

    // wait alert
    await this.checkAlert('cfgKeyPassword', /Success/)
  }

  async disableCloudKey () {
    await this.jumpPage('accountSettingLink')
    await this.kcCloudBtn.waitFor()
    await this.page.waitForTimeout(3000)
    const kcCardText = await this.kcCard.innerText()
    if (kcCardText.includes('Sync Keychain with Amazon Web Services')) {
      // await expect(this.kcCard).toHaveText(/Sync Keychain with Amazon Web Services/)
      await this.kcDisCloudBtn.click()
      await this.dcDisCloudBtn.waitFor()
      await this.dcDisCloudBtn.click({ timeout: 9000 })
      // await this.checkAlert('disableCloudKey', /Success/)
    }
    await this.account.click()
    await this.kcEnCloudBtn.waitFor()
    // await expect(this.kcCard).toHaveText(/Cloud storage disabled/)
  }

  // 选择一个推荐
  async recommendSelected () {
    // if (await this.recommendTitle.isVisible()) {
    //   await this.recommendCard.click()
    //   await this.recommendFollowOenBtn.click()
    // }
    if (await this.recommendTitle.isVisible()) {
      // 如果已经选了第一个，就不用再点击了直接点击关注
      if (await this.recommendCardSelected.isVisible()) {
        await this.recommendFollowOenBtn.click()
      } else {
        await this.recommendCard.click()
        await this.recommendFollowOenBtn.click()
      }
    }
  }

  async allBlockCloseBtn () {
    const target = 'tbody :has-text("remove_circle_outline")'
    this.clickAllBtn(target)
  }

  async clickAllBtn (target) {
    let len = await this.page.locator(target).count()
    while (len) {
      len--
      await this.page.waitForTimeout(2000)
      await this.page.locator(target + ' >> nth=0 >> button').click()
      await this.page.waitForTimeout(2000)
    }
  }

  async clickViewport (x, y) {
    await this.page.waitForTimeout(5000)
    await this.page.mouse.click(x, y, { force: true })
  }
}

module.exports = { AccountPage }
