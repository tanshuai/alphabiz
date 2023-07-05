class PlayerPage {
  constructor (page) {
    this.page = page
    this.playArrow = page.locator('.absolute-center i:has-text("play_arrow")')
    this.playPage = page.locator('.video-js-player__controller')
    this.fileInput = page.locator('[data-cy="file-input"]')
    this.stopPlay = page.locator('button:has-text("stop")')
    this.playSpeed = page.locator('button:has-text("speed")')
    this.keyboardSpace = page.keyboard.press('Space')
  }
}

module.exports = { PlayerPage }
