const { expect } = require('@playwright/test')
const { BasePage } = require('./basePage')
const app = require('../../../developer/app.js')

class LibraryPage extends BasePage {
  constructor (page) {
    super(page)
    this.page = page
    this.navBar = page.locator('.breadcrumbs')

    // library header
    const libraryHeaderClass = '.library-header'
    this.searchCbo = page.locator(`${libraryHeaderClass} label >> nth=1`)
    this.searchInput = page.locator(`${libraryHeaderClass} label input[type="text"]`)
    this.fromNetworkHint = page.locator(`${libraryHeaderClass} .from-network-hint`)
    this.connectionStatus = page.locator(`${libraryHeaderClass} .connection-status`)

    // connection status card(cs)
    const connectionStatusText = 'Connection Status'
    this.csCard = page.locator(`.q-card:has-text("${connectionStatusText}")`)
    this.csGunServerList = page.locator('.q-card tbody >> nth=0 >> tr')
    this.csPeerList = page.locator('.q-card tbody >> nth=0 >> tr')
    this.csCloseBtn = page.locator(`.q-card:has-text("${connectionStatusText}") button:has-text("Close")`)
    this.searchChannelBtn = page.locator('.search-channel button:has-text("library_addSEARCH")')
    this.backToTopBtn = page.locator('button:has-text("Back to top")')

    // search channel id card(sci)
    this.sci = '.q-card:has-text("search for channel ID")'
    this.sciCard = page.locator(this.sci)
    this.sciInput = page.locator(`${this.sci} input[aria-label="Channel ID"]`)
    this.sciSearchBtn = page.locator(`${this.sci} label i:has-text("search")`)
    this.sciCloseBtn = page.locator(`${this.sci} i:has-text("close")`)

    // post card
    this.postCardEleObj = {
      card: '',
      channelTitleEle: '.post-channel-info .channel-title',
      channel: '.post-channel-info',
      followBtn: '.follow-btn',
      postTitle: '.post-info .post-title',
      starBtn: 'button:has-text("star") i',
      moreBtn: 'button:has-text("more_vert")',
      createTime: '.desc-time span',
      filmRate: '.desc-time [role="alert"]',
      desc: '.desc-para',
      poster: '.image-container img',
      downloadBtn: '.post-buttons button >> nth=0',
      playBtn: '.post-buttons button >> nth=1'
    }
    // post card more menu
    const menuClass = '.q-menu'
    this.mmFollowBtn = page.locator(`${menuClass} .q-item:has-text("follow")`)
    this.mmShareBtn = page.locator(`${menuClass} .q-item:has-text("share")`)
    this.mmBlockChannelBtn = page.locator(`${menuClass} .q-item >> nth=2`)
    this.mmBlockCreatorBtn = page.locator(`${menuClass} .q-item:has-text("block the creator")`)
    this.unBlockBtn = page.locator('text=Unblock first chan...')

    // copy card
    const copyCardCss = '.q-card:has-text("Go to library")'
    this.copyCard = page.locator(copyCardCss)
    this.ccOKBtn = page.locator(`${copyCardCss} button:has-text("OK")`)
    this.ccCancelBtn = page.locator(`${copyCardCss} button:has-text("cancel")`)
    // block card(bc)
    this.bcBlockBtn = page.locator('.q-card:has-text("Block") button:has-text("block")')
    this.bcCancelBtn = page.locator('.q-card:has-text("Block") button:has-text("cancel")')

    // channel card obj
    this.channelCardEleObj = {
      card: '',
      radioBtn: '>> text=radio_button',
      recommendTitle: '.channel-title span',
      titleEle: '.channel-image .q-img__content',
      posterELe: '.channel-image .q-img__image',
      channelIDEle: '[data-cy="channel-ID"]',
      copyChannelIDBtn: 'button:has-text("content_copy")',
      descEle: '.channel-desc',
      blockedTag: '[role="alert"]:has-text("Blocked")',
      privateChannelTag: '[role="alert"]:has-text("private channel")',
      followBtn: '.follow-btn',
      removeChannelBtn: 'button:has-text("delete")',
      editChannelBtn: 'button:has-text("edit")',
      previewBtn: 'button:has-text("find_in_page")',
      channelSettingBtn: 'button:has-text("settings")'
    }
    // channel detail page(cd)
    const channelHeader = '.channel-header'
    this.cdTitle = page.locator(`${channelHeader} .channel-title`)
    this.cdChannelID = page.locator(`${channelHeader} [title="Channel ID"]`)
    this.cdChannelPoster = page.locator(`${channelHeader} .q-avatar img`)
    this.cdCreatorTitle = page.locator(`${channelHeader} .creator-title span`)
    this.cdBlockedTag = page.locator(`${channelHeader} [role="alert"]:has-text("Blocked")`)
    this.cdPrivateChannelTag = page.locator(`${channelHeader} [role="alert"]:has-text("private channel")`)
    this.cdChannelDesc = page.locator(`${channelHeader} .header-description`)
    this.cdChannelFollows = page.locator(`${channelHeader} [role="alert"]:has-text("followers")`)
    this.cdshareBtn = page.locator(`${channelHeader} button:has-text("share")`)
    this.cdFollowBtn = page.locator(`${channelHeader} .follow-btn`)
    // user detail page(ud)
    const creatorInfo = '.creator-info'
    this.udCard = page.locator(creatorInfo)
    this.udCreatorTitle = page.locator(`${creatorInfo} .channel-title`)
    this.udCreatorID = page.locator(`${creatorInfo} .creator-id`)
    this.udCreatorDesc = page.locator(`${creatorInfo} .creator-description`)

    // unfollow card unfollowBtn
    this.ucUnfollowBtn = page.locator('.q-card:has-text("unfollow this channel") button:has-text("unfollow")')
    // remove channel card removeBtn
    this.removeChannelBtn = page.locator('.q-card:has-text("remove channel") button:has-text("remove")')

    // recommend page start
    this.welcomeMessage = page.locator('.q-mt-md:has-text("welcome")')
    this.showMoreBtn = page.locator('button:has-text("Show more for me")')
    this.channelSelected = page.locator(".q-card.channel-card.selected")
    this.chanel1Global = page.locator(".channel-card>>nth=0"); //全局推荐页的第一个频道定位
    this.chanel1Local = page.locator(".channel-card.q-card>>nth=5"); //局部推荐页的第一个频道定位
    this.channelFollowsBtn = page.locator('button:has-text("channels and continue")')
    this.cancel = page.locator('button:has-text("Cancel")')
    this.locading = page.locator('text=Loading...')

    this.getOne = page.locator('[style="width: 100%; height: 280px;"] >> nth=0')
    this.beforeRecommendList = page.locator('[style="width: 100%; height: 280px;"]')
    this.afterRecommendList = page.locator('[style="width: 100%; height: 280px;"]')
    this.recommendFollowOenBtn = page.locator('button:has-text("starFollow 1 channels and continue")')
    this.recommendTitle = page.locator('text=Recommend')
    // recommend page end

    // home page
    this.tweetsFrist = page.locator('.post-channel-info >> nth=0')
    // local favorites page start
    this.backUpBtn = page.locator('button:has-text("BACKUP")')
    this.favoriteCard = page.locator('.q-card:has-text("Import/Export Favorites") ')
    this.exportBtn = page.locator('button:has-text("saveExport")')
    this.importBtn = page.locator('button:has-text("import favorites")')
    // local favorites page end

    // edit page start
    this.addChannelEle = page.locator('.add-channel')
    this.addChannelBtn = page.locator('.add-channel .add-channel-btn')
    this.quickAddChannelBtn = page.locator('.add-channel .quick-start')
    this.descInput = page.locator('input[aria-label="Description"]')
    this.posterInput = page.locator('input[aria-label="Poster"]')
    this.initPosterIcon = page.locator('label i:has-text("image")')
    this.InvalidPoseterIcon = page.locator('label i:has-text("close")')
    // add channel card(ac)
    const addChannel = 'Add channel'
    this.addChannelCard = page.locator(`.q-card:has-text("${addChannel}")`)
    this.acTitleInput = page.locator('input[aria-label="Channel title"]')
    this.acPrivateChk = page.locator('div[role="checkbox"]:has-text("Set as private")')
    this.acSubmitBtn = page.locator(`.q-card:has-text("${addChannel}") button:has-text("Submit")`)
    this.acCloseBtn = page.locator(`.q-card:has-text("${addChannel}") button:has-text("Cancel")`)
    // quick start card
    const quickStartCardCss = '.q-card:has-text("Quick start")'
    this.quickStartCard = page.locator(quickStartCardCss)
    this.quickStartCardSubmitBtn = page.locator(`${quickStartCardCss} button:has-text("submit")`)
    // channel setting card
    this.channelSettingSubmitBtn = page.locator('.q-card:has-text("channel setting") button:has-text("Submit")')
    // remove channel card(rc)
    this.rcRemoveBtn = page.locator('.q-card:has-text("remove channel") button:has-text("Remove")')
    // preview channel
    this.previewHead = page.locator('.q-card:has-text("preview mode")')
    // edit channel card(ec)
    const editChannelCardCss = '.post-list-card'
    this.ecTitle = page.locator(editChannelCardCss)
    this.ecAddPostBtn = page.locator(`${editChannelCardCss} button:has-text("add")`)
    this.ecImportExcelBtn = page.locator(`${editChannelCardCss} button:has-text("table_rows")`)
    this.ecCloseBtn = page.locator(`${editChannelCardCss} button:has-text("close") >> nth=0`)
    this.ecDesc = page.locator(`${editChannelCardCss} .description`)
    this.ecPostListEleObj = {
      titleEle: '.post-title',
      posterEle: '.post-title >> //preceding::*[1]',
      descEle: '.post-title >> //following::*[1]',
      createTimeEle: '.post-title >> //following::*[2]',
      editPostBtn: 'button:has-text("edit")',
      deletePostBtn: 'button:has-text("close")'
    }
    // remove post card
    this.removePostBtn = page.locator('.q-card:has-text("remove post") button:has-text("remove")')
    // add post card(ap)
    const addPost = '.q-card:has-text("Add post")'
    this.apCard = page.locator(addPost)
    this.apTitleInput = page.locator('input[aria-label="Post title"]')
    this.apABUrlInput = page.locator(`input[aria-label="${app.name} URL"]`)
    this.apSelectUrlCbo = page.locator('label:has-text("Select from tasks")')
    this.apMagnetBtn = page.locator('text=Import from magnet')
    this.apMagnetInput = page.locator('.q-card:has-text("magnet:? url") input')
    this.apMagnetSubmitBtn = page.locator('.q-card:has-text("magnet:? url") button:has-text("done")')
    this.apFilmRateCbo = page.locator('label:has-text("Film rate")')
    this.apAddSubtitleBtn = page.locator('th:has-text("Subtitle list") button:has-text("add")')
    this.apSubtitleListItem = page.locator('tabel:has-text("Subtitle list") tbody tr')
    this.apSubmitBtn = page.locator(`${addPost} button:has-text("Submit")`)
    this.apCloseBtn = page.locator(`${addPost} button:has-text("Cancel")`)

    // add subtitle card
    const addSubtitleCardCSS = '.q-card:has-text("Add subtitle download link")'
    this.addSubtitleCard = page.locator(addSubtitleCardCSS)
    this.asLangCbo = page.locator(`${addSubtitleCardCSS} label:has-text("language")`)
    this.asUrlInput = page.locator(`${addSubtitleCardCSS} label:has-text("download link")`)
    this.asSubmitBtn = page.locator(`${addSubtitleCardCSS} button:has-text("done")`)
    // edit page end

    // creator detail page
    // Alert
    this.shareChannelAlert = page.locator('[role="alert"]:has-text("Share URL is copied to your clipboard")')
    this.copiedAlert = page.locator('[role="alert"] >> text=/Copied/ >> nth=0')
    this.removedFavoriteAlert = page.locator('[role="alert"]:has-text("Removed favorite") >> nth=0')

    // library following
  }

  async scrollToLoadPage (x = 0, y = 10000, target = '.library-index') {
    await this.page.locator(target).hover()
    await this.page.mouse.wheel(x, y)
  }

  async checkNavBar (title, options = { timeout: 1000 }) {
    await this.page.waitForTimeout(options.timeout)
    // const headerTitle = await this.navBar.innerText()
    const titleHeader = title.length > 8 ? title.slice(0, 8) : title
    // expect(headerTitle.includes(titleHeader)).toBe(true)
    const regex = new RegExp(titleHeader)
    await expect(await this.navBar).toHaveText(regex)
  }

  getPostCardEle (title, target) {
    const postCard = `.post-card:has(.post-title:has-text("${title}"))`
    return this.page.locator(postCard + ' ' + this.postCardEleObj[target] + ' >> nth = 0' )
  }

  async postArrFaitFor (title, target, len) {
    while (len) {
      len--
      const postCard = `.post-card:has(.post-title:has-text("${title}"))`
      await this.page.locator(postCard + ' ' + this.postCardEleObj[target] + `>> nth=${len}`).waitFor()
    }
  }

  getChannelCardEle (title, target, position) {
    let channelCard = `.channel-card:has-text("${title}")`
    if (position) channelCard = this[position] + ' ' + channelCard
    return this.page.locator(channelCard + ' ' + this.channelCardEleObj[target])
  }

  toChannelCardEle (i) {
    const target = `[style="background: rgb(40, 40, 40);"] >> nth=${i}`
    this.page.locator(target).click()
  }

  publishChannelCard (title, target, position) {
    let channelCard = `.channel-image .q-img__content:has-text("${title}")`
    if (position) channelCard = this[position] + ' ' + channelCard
    return this.page.locator(channelCard + ' ' + this.channelCardEleObj[target])
  }

  editChannelCard (title, target) {
    let channelCard = `.channel-card:has-text("${title}")`
    if (target) channelCard = channelCard + ' ' + this.channelCardEleObj[target]
    return this.page.locator(channelCard)
  }

  /**
   * @function ensurePostCard
   * @description ensure Post Card Element
   */
  async ensurePostCard (postObj, options = { page: 'homeLink', favorite: false }) {
    const title = await this.getPostCardEle(postObj.title, 'postTitle').innerText()
    expect(title).toBe(postObj.title)

    const desc = await this.getPostCardEle(postObj.title, 'desc').innerText()
    expect(desc).toBe(postObj.desc)

    if (postObj.poster) {
      const poster = await this.getPostCardEle(postObj.title, 'poster').getAttribute('src')
      console.log('poster', poster)
      expect(poster).toBe(postObj.poster)
    }

    const rate = await this.getPostCardEle(postObj.title, 'filmRate').innerText()
    expect(rate).toBe(postObj.rate ? postObj.rate : 'G')

    if (options.favorite) {
      const starBtn = await this.getPostCardEle(postObj.title, 'starBtn')
      if (await starBtn.innerText() === 'star_border') {
        await expect(await starBtn.innerText()).toBe('star_border')
        await starBtn.click()
        expect(await starBtn.innerText()).toBe('star')
      } else if (await starBtn.innerText() === 'star') {
        await expect(await starBtn.innerText()).toBe('star')
        await starBtn.click()
        expect(await starBtn.innerText()).toBe('star_border')
        await starBtn.click()
      }

      // 本地收藏页面验证
      await this.jumpPage('localFavoritesLink')
      await this.page.waitForTimeout(1000)
      expect(await starBtn.innerText()).toBe('star')
      await this.getPostCardEle(postObj.title, 'starBtn').waitFor()

      await this.jumpPage(options.page)
      await starBtn.click()
      await this.removedFavoriteAlert.waitFor('visible')

      await this.jumpPage('localFavoritesLink')
      await this.page.waitForTimeout(1000)
      const isVisible = await starBtn.isVisible()
      expect(isVisible).toBe(false)
      await this.jumpPage(options.page)
    }

    const moreBtn = await this.getPostCardEle(postObj.title, 'moreBtn')
    await moreBtn.click()
    await this.mmShareBtn.click()
    await this.copiedAlert.waitFor('visible')

    await moreBtn.click()
    await this.mmBlockChannelBtn.click()
    await this.bcBlockBtn.waitFor()
    await this.bcCancelBtn.click()
    // await this.mmFollowBtn.click()
  }

  async checkShareLink (targetPage, targetChannel, options = {}) {
    if (typeof options.isCloseDialog === 'undefined') options.isCloseDialog = true

    await this.jumpPage(targetPage)
    await this.page.waitForTimeout(1000)
    await this.page.keyboard.press(`${this.modifier}+KeyV`)
    await this.copyCard.waitFor()
    const channelReg = new RegExp(targetChannel)
    expect(await this.copyCard).toHaveText(channelReg)
    if (options.isCloseDialog === true) {
      await this.ccCancelBtn.click()
      expect(await this.copyCard).toHaveCount(0)
    } else {
      await this.ccOKBtn.click()
      await this.checkNavBar(targetChannel)
      expect(await this.cdTitle).toHaveText(channelReg)
    }
  }

  async ensureChannelHeader (channelObj, options = { followStatus: 'FOLLOWING' }) {
    const channelTitle = await this.cdTitle.innerText()
    expect(channelTitle).toBe(channelObj.title)

    // const channelID = await this.cdChannelID.innerText()
    // expect(channelID.includes(channelObj.channelID)).toBe(true)

    const channelDesc = await this.cdChannelDesc.innerText()
    expect(channelDesc).toBe(channelObj.desc)

    if (channelObj.poster) {
      const poster = await this.cdChannelPoster.getAttribute('src')
      expect(poster).toBe(channelObj.poster)
    }

    const follows = await this.cdChannelFollows.innerText()
    expect(/\d+\sFollowers/.test(follows)).toBe(true)

    await this.cdshareBtn.click()
    // await this.shareChannelAlert.waitFor('visible')

    const previewFollowBtn = await this.cdFollowBtn.innerText()
    expect(previewFollowBtn).toBe(options.followStatus)
  }

  /**
   * @function searchChannelID
   * @description addchannel按钮频道id搜索功能
   * @param { object } channelObj 频道对象
   * @param { string } isCompleteId 是否完整id才能查询到频道
   */
  async searchChannelID (channelObj, isCompleteId) {
    await this.searchChannelBtn.click()
    const channelID = channelObj.channelID
    // 验证不完整的频道id
    console.log('输入缺少最后一个字符的ID')
    await this.sciInput.fill(channelID.slice(0, channelID.length - 1))
    await this.sciSearchBtn.click()
    console.log('搜索')
    await this.page.waitForTimeout(3000)
    if (isCompleteId) {
      console.log('私有频道需要完整ID, 提示找不到')
      await this.page.locator('.q-card:has-text("cannot find channel")').waitFor()
      console.log('关闭提示')
      await this.page.locator('.q-card:has-text("cannot find channel") button:has-text("ok")').click()
    } else {
      console.log('公共频道不需要完整ID也能搜到')
      await this.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
    }
    // expect(await this.getChannelCardEle(channelObj.title, 'card', 'sci')).toHaveCount(isCompleteId ? 0 : 1)
    // 验证完整频道id
    console.log('重新输入一个完整的ID')
    await this.sciInput.fill(channelObj.channelID)
    console.log('搜索')
    await this.sciSearchBtn.click()
    await this.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
  }

  /**
   * @function searchCreatorChannel
   * @description 创建者页面检查是否能搜索到频道
   * @param { object } channelObj 频道对象
   * @param { string } isCompleteId 是否完整id才能查询到频道
   */
  async searchCreatorChannel (channelObj, isCompleteId) {
    await expect(this.getChannelCardEle(channelObj.title, 'card')).toHaveCount(isCompleteId ? 0 : 1)
    await this.searchInput.fill(channelObj.title)
    await expect(this.getChannelCardEle(channelObj.title, 'card')).toHaveCount(isCompleteId ? 0 : 1)
    await this.searchCbo.click()
    await this.page.locator('text=Channel ID').click()
    await this.searchInput.fill(channelObj.channelID.slice(0, channelObj.channelID.length - 1))
    await this.page.waitForTimeout(2000)
    await expect(this.getChannelCardEle(channelObj.title, 'card')).toHaveCount(isCompleteId ? 0 : 1)
    await this.searchInput.fill(channelObj.channelID)
    await this.getChannelCardEle(channelObj.title, 'card').waitFor({ timeout: 15000 })
    if (isCompleteId) {
      await this.getChannelCardEle(channelObj.title, 'privateChannelTag').waitFor({ timeout: 10000 })
    }
  }

  /**
   * @function checkChannelFollowStatus
   * @description 检查自己创建的频道是否关注,若没有, 则关注
   * @param { string } target titleEle, posterEle, descEle, createTimeEle, editPostBtn, deletePostBtn
   */
  async checkChannelFollowStatus (title) {
    await this.jumpPage('editLink')
    await this.getChannelCardEle(title, 'previewBtn').click()
    await this.previewHead.waitFor()
    const followStatus = await this.cdFollowBtn.innerText()
    if (followStatus === 'FOLLOW') await this.cdFollowBtn.click()
    await this.page.waitForTimeout(3000)
  }

  async unfollowChannel (page, title, element, card) {
    let cardMethod = 'getPostCardEle'
    if (card === 'ChannelCard') cardMethod = 'getChannelCardEle'
    await this.jumpPage(page)
    await this.page.waitForTimeout(3000)
    if (page === 'homeLink') await this.scrollFindTarget(title, 'card', cardMethod)
    const followBtn = await this[cardMethod](title, element)
    const followBtnText = await followBtn.innerText()
    expect(followBtnText).toBe('FOLLOWING')
    await followBtn.click()
    await this.ucUnfollowBtn.click()
  }

  async checkUnfollowChannel (channelObj, postObj, isHidden = true) {
    // 验证主页 推文卡片消失
    await this.jumpPage('homeLink')
    await this.page.waitForTimeout(3000)
    if (isHidden) {
      await expect(this.getPostCardEle(postObj.title, 'postTitle')).toHaveCount(0)
    } else {
      expect(await this.getPostCardEle(postObj.title, 'followBtn').innerText()).toBe('FOLLOW')
    }
    // 验证主页 查询结果 未关注
    await this.searchChannelBtn.click()
    await this.sciInput.fill(channelObj.channelID)
    await this.sciSearchBtn.click()
    await this.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
    await this.getChannelCardEle(channelObj.title, 'followBtn', 'sci').waitFor()
    await this.sciCloseBtn.click()
    // 验证关注页 频道消失
    await this.jumpPage('followingLink')
    await this.page.waitForTimeout(3000)
    await expect(this.getChannelCardEle(channelObj.title, 'card')).toHaveCount(0)
    // 验证关注页 查询结果 未关注
    await this.searchChannelBtn.click()
    await this.sciInput.fill(channelObj.channelID)
    await this.sciSearchBtn.click()
    await this.getChannelCardEle(channelObj.title, 'card', 'sci').waitFor()
    await this.getChannelCardEle(channelObj.title, 'followBtn', 'sci').waitFor()
    // 进入频道详细页面
    await this.getChannelCardEle(channelObj.title, 'card', 'sci').click()
    await this.checkNavBar(channelObj.title)
    await this.ensureChannelHeader(channelObj, { followStatus: 'FOLLOW' })
    await this.ensurePostCard(postObj)
    // 本地收藏页面 未关注
    await this.jumpPage('localFavoritesLink')
    await this.page.waitForTimeout(1000)
    expect(await this.getPostCardEle(postObj.title, 'followBtn').innerText()).toBe('FOLLOW')
  }
  // home page

  // following page

  // local favorites page

  // explore page

  // edit page
  /**
   * @function getPostListEle
   * @description get Post List Element
   * @param { string } target titleEle, posterEle, descEle, createTimeEle, editPostBtn, deletePostBtn
   */
  getPostListEle (title, target) {
    const post = `tr:has(.post-title:has-text("${title}"))`
    return this.page.locator(post + ' >> ' + this.ecPostListEleObj[target])
  }

  async addChannel (channelObj) {
    await this.addChannelBtn.click({ focus: true })
    await this.cancel.click()
    await this.addChannelBtn.click()
    await this.addChannelCard.waitFor('visible')
    await this.acTitleInput.fill(channelObj.title)
    await this.descInput.fill(channelObj.desc)
    if (channelObj.poster) await this.posterInput.fill(channelObj.poster)
    if (channelObj.isPrivate) await this.acPrivateChk.click()
    await this.page.waitForTimeout(5000)
    await this.acSubmitBtn.click()
    await expect(this.addChannelCard).toBeHidden()
  }

  async removeChannel (title) {
    const removeBtn = await this.getChannelCardEle(title, 'removeChannelBtn')
    await removeBtn.click()
    await this.rcRemoveBtn.click()
  }

  async checkPrivateStatus (title) {

  }

  async ensureChannelCard (title, status) {
    await this.publishChannelCard(title, 'card').waitFor(status)
  }

  async addPost (postObj, options = {}) {
    if (typeof options.isTestCopy === 'undefined') options.isTestCopy = true
    await this.ecAddPostBtn.click()
    await this.apCard.waitFor('visible')
    await this.apTitleInput.fill(postObj.title)
    let desc = postObj.desc.replace(':', '')
    if (desc.length > 295) desc = desc.slice(0, 295) + '...'
    await this.descInput.fill(desc)
    if (postObj.poster) {
      await this.posterInput.fill(postObj.poster)

      // const isInvalid = await this.InvalidPoseterIcon.isVisible()
      // if (isInvalid) {
      //   await this.posterInput.fill.fill('')
      //   await this.posterInput.fill(postObj.poster2)
      //   await this.initPosterIcon.waitFor('hidden')
      // }
    }
    if (/magnet/.test(postObj.url)) {
      await this.apMagnetBtn.click()
      await this.apMagnetInput.fill(postObj.url)
      // 复制粘贴magnet
      if (options.isTestCopy) {
        await this.page.focus('.q-card:has-text("magnet:? url") input')
        await this.page.keyboard.press(`${this.modifier}+KeyA`)
        await this.page.keyboard.press(`${this.modifier}+KeyC`)
        await this.apMagnetInput.fill('')
        await this.page.focus('.q-card:has-text("magnet:? url") input')
        await this.page.keyboard.press(`${this.modifier}+KeyV`)
      }
      await this.apMagnetSubmitBtn.click()
    } else {
      await this.apABUrlInput.fill(postObj.url)
    }
    await this.apFilmRateCbo.click()
    let filmRate
    if (postObj.rate === 'G' || !postObj.rate) filmRate = 'General Audiences'
    await this.page.locator(`.q-menu >> text=${filmRate}`).click()
    if (postObj.subtitleList && typeof postObj.subtitleList === 'object') {
      if (postObj.subtitleList.CN) await this.addSubtitle('ZH', postObj.subtitleList.CN)
      if (postObj.subtitleList.EN) await this.addSubtitle('EN', postObj.subtitleList.EN)
    }
    // await this.page.waitForTimeout(5000)
    // poster无效,等待处理
    const isInvalid = await this.InvalidPoseterIcon.isVisible()
    if (isInvalid) {
      await this.apCard.waitFor('hidden')
    } else {
      await this.apSubmitBtn.click()
    }
  }

  async addSubtitle (lang, url) {
    await this.apAddSubtitleBtn.click()
    await this.addSubtitleCard.waitFor()
    await this.asLangCbo.click()
    if (lang === 'ZH') await this.page.locator('[role="listbox"] >> text=中文(zh)').click()
    if (lang === 'EN') await this.page.locator('[role="listbox"] >> text=English(en)').click()
    await this.asUrlInput.fill(url)
    await this.asSubmitBtn.click()
    await this.addSubtitleCard.waitFor('hidden', { timeout: 20000 })
    // expect(await this.addSubtitleCard).toHaveCount(0, { timeout: 20000 })
  }

  async ensurePostList (postObj) {
    const postTitleText = await this.getPostListEle('', 'titleEle').nth(0).innerText()
    // console.log('postTitleText', postTitleText)
    expect(postTitleText).toBe(postObj.title)
    const postDescText = await this.getPostListEle('', 'descEle').nth(0).innerText()
    // console.log('postDescText', postDescText)
    const desc = postObj.desc
    expect(postDescText.slice(0, 10)).toBe(desc.slice(0, 10))
    const postTimeText = await this.getPostListEle('', 'createTimeEle').nth(0).innerText()
    // console.log('postTimeText', postTimeText)
    expect(postTimeText).not.toBe('NaN-aN-aN aN:aN:aN')
  }

  async recommendPageTest () {
    await this.showMoreBtn.waitFor({ timeout: 60000 })
    const beforeLen = await this.beforeRecommendList.count()
    this.showMoreBtn.click()
    await this.page.waitForTimeout(2000)
    const afterLen = await this.afterRecommendList.count()
    if (beforeLen === afterLen) throw new Error('显示更多推荐失败')
    this.getOne.click()
    this.recommendFollowOenBtn.click()
  }

  async scrollFindTarget (target, type, cardMethod) {
    let i = 1
    while (i) {
      i++
      await this.scrollToLoadPage()
      await this.page.waitForTimeout(5000)
      if (await this[cardMethod](target, type).isVisible()) break
      if (i % 3 === 0) {
        await this.jumpPage('followingLink')
        await this.page.waitForTimeout(2000)
        await this.jumpPage('homeLink')
        await this.page.waitForTimeout(2000)
      }
    }
  }

  async checkFollowCard (checkName) {
    console.log(checkName)
    await this.page.locator(`text=${checkName} >> nth=0`).waitFor({ timeout: 120000 })
  }
}

module.exports = { LibraryPage }
