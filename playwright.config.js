// playwright.config.js
// @ts-check
require('dotenv').config()
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  // Look for test files in the "tests" directory, relative to this configuration file
  testDir: './',
  testMatch: [
    '**/playwright/**/*'
  ],
  reporter: 'list',
  // Each test is given 30 seconds
  timeout: 60000,

  // Forbid test.only on CI
  // forbidOnly: !!process.env.CI,
  outputDir: './test/output/playwright',
  // Two retries for each test
  retries: 2,

  // Limit the number of workers on CI, use default locally
  workers: 1,

  use: {
    // Configure browser and context here
    video: 'on-first-retry',
    screenshot: 'on'
  }
}


// module.exports = { config, electronMainPath }
module.exports = config