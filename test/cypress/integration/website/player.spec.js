/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Player', () => {
  beforeEach(function onBeforeEach () {
    cy.setCookie('TestEnv', 'true')
  })
  it('.mkv', () => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password', { isWebsite: true })
    const mediaPath = 'samples/Embedded.Subtitles.Sample.Princess.Mononoke.1080p.H264.AAC.DualAudio.5.1.BDrip.mkv'
    cy.playMedia(mediaPath, { isPlay: true, duration: 39.795 })
  })
  it('.avi', () => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password', { isWebsite: true })
    const mediaPath = 'samples/GoneNutty.avi'
    cy.playMedia(mediaPath, { isPlay: false })
  })
})
