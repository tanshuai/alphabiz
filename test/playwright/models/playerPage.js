class PlayerPage {
  constructor (page) {
    this.page = page
    this.bigPlayBtn = page.locator('.vjs-big-play-button')
    this.controlBar = page.locator('.vjs-progress-control')
    this.fileInput = page.locator('[data-cy="file-input"]')
    this.playing = page.locator('.vjs-playing video')
    this.paused = page.locator('.vjs-paused video')
  }
}

module.exports = { PlayerPage }
