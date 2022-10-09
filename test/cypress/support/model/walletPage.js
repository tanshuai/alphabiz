Cypress.Commands.add('toWallet', () => {
  cy.clickMenu()
  cy.get('.q-drawer__content').contains('Wallet').click()
  cy.location('pathname', { timeout: 20000 }).should('eq', '/blockchain')
})

Cypress.Commands.add('waitConnect', () => {
  cy.get('.blockchain-card:nth(0) [role="alert"]:nth(1)').contains('online', { timeout: 60000 })
})

Cypress.Commands.add('createKey', () => {
  cy.get('.q-card button').contains('Create').click()
  cy.contains('checkConfirm', { timeout: 15000 })
  cy.get('.q-card [role="alert"]').eq(3).invoke('text').then((addressText) => {
    // cy.task('log', addressText)
    cy.get('.q-card [role="alert"]').eq(4).invoke('text').then((publicKeyText) => {
      // cy.task('log', publicKeyText)
      cy.get('.q-card [role="alert"]').eq(5).invoke('text').then((privateKeyText) => {
        // cy.task('log', privateKeyText)
        cy.contains('Confirm').click()
        cy.get('.blockchain-card:nth(3)', { timeout: 90000 })
        return cy.wrap({
          address: addressText.replace('content_copy', '').replace(/\n/g, ''),
          publicKey: publicKeyText.replace('content_copy', '').replace(/\n/g, ''),
          privateKey: privateKeyText.replace('content_copy', '').replace(/\n/g, '')
        })
      })
    })
  })
})

Cypress.Commands.add('recoveryKey', (key) => {
  cy.get('.blockchain-card:nth(1) input').type(key)
  cy.get('.blockchain-card:nth(1) button').contains('Recovery').click()
  cy.get('.blockchain-card:nth(3)', { timeout: 60000 })
})

Cypress.Commands.add('deleteKey', () => {
  cy.get('.blockchain-card:nth(1) button:nth(0)').click()
  cy.contains('Delete Account').click()
  cy.contains('Get Started', { timeout: 30000 })
  cy.wait(2000)
})

Cypress.Commands.add('getCoin', () => {
  cy.get('.blockchain-card:nth(2) .text-h4', { timeout: 30000 }).invoke('text').then((coinText) => {
    return cy.wrap(coinText)
  })
})

Cypress.Commands.add('walletTransfer', (address, amount, options = {}) => {
  cy.get('.blockchain-card:nth(2) input:nth(0)').type(address)
  cy.get('.blockchain-card:nth(2) input:nth(1)').type(amount.toString())
  cy.get('.blockchain-card:nth(2) button').contains('Transfer').click()
})

Cypress.Commands.add('walletCheckDetail', (info) => {
  cy.get('.blockchain-card:nth(3) tr').its('length').then(lastEle => {
    cy.log(`lastEle ${lastEle}`)
    lastEle = lastEle === 1 ? 1 : lastEle - 1
    const senderAddressRegexp = new RegExp(`0x(0*|)${info.senderAddress.replace(/^0x(0*|)/, '')}`)
    const recipientAddressRegexp = new RegExp(`0x(0*|)${info.recipientAddress.replace(/^0x(0*|)/, '')}`)
    const tdCss = `.blockchain-card:nth(3) tr:nth(${lastEle})`
    cy.get(`${tdCss} td:nth(0)`).should('have.text', '0x1::TestCoin::TestCoin')
    cy.get(`${tdCss} td:nth(1)`).invoke('text').should('match', senderAddressRegexp)
    cy.get(`${tdCss} td:nth(2)`).invoke('text').should('match', recipientAddressRegexp)
    cy.get(`${tdCss} td:nth(3)`).should('have.text', info.amount)
  })
})