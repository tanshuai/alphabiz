/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Player', () => {
  beforeEach(function onBeforeEach () {
  })
  it('.mkv', () => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password', { isWebsite: true })
    const mediaPath = 'samples/synthetic-subtitles.mkv'
    cy.playMedia(mediaPath, { isPlay: true, duration: 2.046 })
  })
  it('.avi', () => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password', { isWebsite: true })
    const mediaPath = 'samples/synthetic-container.avi'
    cy.playMedia(mediaPath, { isPlay: false })
  })
})
