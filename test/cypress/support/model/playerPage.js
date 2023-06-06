Cypress.Commands.add('toPlayer', () => {
  cy.clickMenu()
  cy.contains('Player').click()
})

Cypress.Commands.add('playMedia', (filePath, mediaInfo = {}) => {
  cy.toPlayer()
  cy.fixture(filePath, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(fileContent => {
      cy.get('[data-cy="file-input"]').attachFile({
        fileContent,
        filePath: filePath,
        encoding: 'utf-8',
        lastModified: new Date().getTime()
      })
    })
  cy.get("[data-cy='file-input']").then(function (el) {
    el[0].dispatchEvent(new Event('input', { bubbles: true }))
  })
  // 验证播放器正常播放
  if (mediaInfo.isPlay) {
    cy.wait(5000)
    cy.get('.video-js-player__controller').click()
    cy.get('.absolute-center > .q-btn > .q-btn__wrapper > .q-btn__content', { timeout: 50000 }).should('be.visible')
  } else {
    cy.contains('The media could not be loaded', { timeout: 30000 })
    cy.get('#my-video_html5_api')
      // should be paused
      .should('have.prop', 'paused', true)
  }
})
