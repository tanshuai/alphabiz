/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Player', () => {
  beforeEach(() => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password', { isWebsite: true })
  })
  it('.mkv', () => {
    const mediaPath = 'samples/Embedded.Subtitles.Sample.Princess.Mononoke.1080p.H264.AAC.DualAudio.5.1.BDrip.mkv'
    cy.playMedia(mediaPath, { isPlay: true, duration: 39.795 })
  })
  it('.avi', () => {
    const mediaPath = 'samples/GoneNutty.avi'
    cy.playMedia(mediaPath, { isPlay: false })
  })
})
