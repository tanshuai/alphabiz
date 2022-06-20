// @ts-check
const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright')
const path = require('path')

let browser, page
test.beforeAll(async () => {
  browser = await chromium.launch({
    headless: false,
  })
  page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
  })
})

test.describe('download stable version alphabiz', () => {
  test('download', async () => {
    test.setTimeout(60000 * 20)
    const [response] = await Promise.all([
      // Waits for the next response matching some conditions
      page.waitForResponse(response => response.url() === 'https://api.github.com/repos/tanshuai/alphabiz/releases/latest'),
      // Triggers the response
      page.goto('https://api.github.com/repos/tanshuai/alphabiz/releases/latest')
    ])
    const resJson = await response.json()
    const tagName = resJson.tag_name
    console.log('latest stable version: ', tagName)

    await page.goto(`https://alpha.biz/`)
    console.log('web load end!')
    let eleClass
    process.platform === 'darwin' ? eleClass = 'fa-apple'
      : process.platform === 'win32' ? eleClass = 'fa-windows'
        : eleClass = 'fa-linux'
    const classRegex = new RegExp(`${eleClass}`)
    await expect(await page.locator('#btn_download_sys i')).toHaveClass(classRegex, { timeout: 30000 })
    await page.waitForTimeout(5000)
    console.log('start download!')
    const [download] = await Promise.all([
      // Start waiting for the download
      page.waitForEvent('download'),
      // Perform the action that initiates download
      page.locator('#btn_download_sys').click(),
    ]);
    // Wait for the download process to complete
    const fileSuggestedFilename = download.suggestedFilename()
    console.log('download file name: ', fileSuggestedFilename)
    let fileExt
    process.platform === 'darwin' ? fileExt = 'dmg'
      : process.platform === 'win32' ? fileExt = 'msi'
        : fileExt = 'deb'
    const regex = new RegExp(`^alphabiz-${tagName}\.${fileExt}$`)
    expect(regex.test(fileSuggestedFilename)).toBe(true)

    const targetPath = path.resolve(__dirname, `../../alphabiz.${fileExt}`)
    console.log(targetPath)
    await download.saveAs(targetPath)

    await page.waitForTimeout(1000)
  })
})