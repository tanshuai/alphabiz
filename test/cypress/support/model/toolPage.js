const TOOL_TITLE = 'Development'
const WALLET_TITLE = 'Wallet'

Cypress.Commands.add('toTool', () => {
  cy.clickMenu()
  cy.get('.q-drawer__content').contains(TOOL_TITLE).click()
})

Cypress.Commands.add('openTool', () => {
  cy.get('#version').click()
  for (let n = 0; n < 8; n++) {
    cy.get('.alphabiz-logo').click()
  }
  cy.contains('is enabled', { timeout: 30000 }).should('be.visible')
  cy.get('Button').contains('Close').click()
})

Cypress.Commands.add('openWallet', () => {
  cy.toTool()
  cy.get('.q-tab').contains('Payment Mode').click()
  cy.contains('Blockchain Account Page').click()
})

Cypress.Commands.add('checkOpenWallet', () => {
  cy.get('.q-drawer__content').then(($element) => {
    if (!$element.text().includes(TOOL_TITLE)) {
      cy.openTool()
    }
    if (!$element.text().includes(WALLET_TITLE)) {
      cy.openWallet()
    }
  })
})