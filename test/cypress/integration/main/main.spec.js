/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />
describe('main', {
  retries: {
    runMode: 2,
    openMode: 2
  }
}, function () {
  beforeEach(function onBeforeEach () {
    // if (Cypress.platform === 'win32') this.skip()
  })
  describe('LanguageSelection', () => {
    it('language', () => {
      cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password')
      cy.task('appconfig').then(app => {
        cy.title().should('include', app.displayName)
      })
      cy.get('#version').contains(/^v\d+\.\d+\.\d+/)

      cy.changeLanguage('EN', 'CN')
      cy.changeLanguage('CN', 'TW')
      cy.changeLanguage('TW', 'EN')
    })
  })
  describe('Player', () => {
    it('.mkv', () => {
      cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password')
      const mediaPath = 'samples/synthetic-subtitles.mkv'
      cy.playMedia(mediaPath, { isPlay: true, duration: 2.046 })
    })
    it('.avi', () => {
      cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password')
      const mediaPath = 'samples/synthetic-container.avi'
      cy.playMedia(mediaPath, { isPlay: false })
    })
  })
})
