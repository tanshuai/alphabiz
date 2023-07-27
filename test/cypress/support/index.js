// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import './model/playerPage'
import './model/creditsPage'
import './model/walletPage'
import './model/basicPage'
import './model/toolPage'

Cypress.on('uncaught:exception', (err, runnable) => {
  const resizeObserverLoopError = 'ResizeObserver loop'
  if (err.message.includes(resizeObserverLoopError) ||
    err.message.includes('User-Initiated Abort') ||
    err.message.includes('RTCError') ||
    err.message.includes('Failed to execute \'setRemoteDescription\'') ||
    err.message.includes('Avoided redundant navigation') ||
    err.message.includes('Connection failed') ||
    err.message.includes('NavigationDuplicated') ||
    err.message.includes('Exceeded maximum endpoint') ||
    err.message.includes('Cannot read properties of undefined (reading \'byteLength\')')
  ) {
    return false
  }
  cy.task('log', 'uncaught:exception error:' + err.message)
})
Cypress.on('before:browser:launch', (browser = {}, launchOptions) => {
  if (browser.name === 'chrome' || browser.name === 'edge') {
    launchOptions.args.push('--disable-gpu')
    launchOptions.args.push('--disable-dev-shm-usage')
    launchOptions.args.push('--disable-web-security')
    return launchOptions
  }
})
