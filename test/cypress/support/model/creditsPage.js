const CURRENT_CREDIT = '[data-cy="currentCredit"]'

Cypress.Commands.add('getPoint', () => {
  cy.get(CURRENT_CREDIT).invoke('text').then((pointText) => {
    return cy.wrap(pointText)
  })
})

Cypress.Commands.add('getReceiptCode', () => {
  cy.get('.q-btn').contains('Receive').click()
  cy.get('.q-banner[role="alert"]').invoke('text').then((receiptCodeText) => {
    const receiptCode = receiptCodeText.replace(/(^\s*)|(\s*$)/g, '')
    cy.get('button').contains('Cancel').click()
    return cy.wrap(receiptCode)
  })
})

Cypress.Commands.add('transfer', (ID, amount) => {
  // 转账 start
  cy.get('button').contains('Transfer').click()
  // cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(1)').click()
  cy.get('.q-dialog__inner > .q-card', { timeout: 5000 }).should('be.visible').then($card => {
    cy.get('[aria-label="Receipt Code"]').then($input => {
      cy.log('111:' + $input.val())
      if ($input.val() === '') cy.get('[aria-label="Receipt Code"]').type(ID)
    })
    cy.get('[aria-label="Transfer Amount"]').type(amount)
    cy.get('.q-card__actions button').contains('Transfer').click()
  })
  // 等待 q-card 退出
  cy.get('.q-dialog__inner > .q-card', { timeout: 20000 }).should('not.exist')
  // 转账 end
  cy.sleep(500)
})

Cypress.Commands.add('checkBillDetail', (info) => {
  if (info.user === 'transferee') {
    cy.get('.q-card:nth(4) .q-table__grid-content > :nth-child(1)').click()
  } else {
    cy.get('.q-card:nth(3) .q-table__grid-content > :nth-child(1)').click()
  }
  cy.get('.q-dialog__inner > .q-card', { timeout: 5000 }).should('be.visible').then($card => {
    cy.get('.rounded-borders > :nth-child(2)').contains(info.id)
    cy.get('.rounded-borders > :nth-child(3)').contains(info.type)
    cy.get('.rounded-borders > :nth-child(4)').contains(info.amount)
    cy.get('.rounded-borders').contains('finish')
  })
})
