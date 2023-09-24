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
    cy.get('#my-video_html5_api')
      // should not be paused
      .should('have.prop', 'paused', false)
      .should('have.prop', 'duration', mediaInfo.duration)
  } else {
    cy.contains('The media could not be loaded', { timeout: 30000 })
    cy.get('#my-video_html5_api')
      // should be paused
      .should('have.prop', 'paused', true)
  }


})