/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Player', () => {
  beforeEach(() => {
  })
  it('.should() - 判断可播放的文件 是否 正常播放', () => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password')
    cy.get('[aria-label="Menu"]').click()
    cy.contains('Player').click()
    const media = 'samples/Embedded.Subtitles.Sample.Princess.Mononoke.1080p.H264.AAC.DualAudio.5.1.BDrip.mkv'
    cy.fixture(media, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then(fileContent => {
        cy.get('[data-cy="file-input"]').attachFile({
          fileContent,
          filePath: media,
          encoding: 'utf-8',
          lastModified: new Date().getTime()
        })
      })
    cy.get("[data-cy='file-input']").then(function (el) {
      el[0].dispatchEvent(new Event('input', { bubbles: true }))
    })
    cy.get('#my-video_html5_api')
      // should not be paused
      .should('have.prop', 'paused', false)
      .should('have.prop', 'duration', 39.795)
  })
  it('.should() - 判断不可播放的文件 是否 不能播放', () => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password')
    cy.get('[aria-label="Menu"]').click()
    cy.contains('Player').click()
    const media = 'samples/GoneNutty.avi'
    cy.fixture(media, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then(fileContent => {
        cy.get('[data-cy="file-input"]').attachFile({
          fileContent,
          filePath: media,
          encoding: 'utf-8',
          lastModified: new Date().getTime()
        })
      })
    cy.get("[data-cy='file-input']").then(function (el) {
      el[0].dispatchEvent(new Event('input', { bubbles: true }))
    })
    cy.contains('The media could not be loaded', { timeout: 30000 })
    cy.get('#my-video_html5_api')
      // should be paused
      .should('have.prop', 'paused', true)
  })
})
