/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('wallet', () => {
  beforeEach(() => {
    cy.setCookie('TestEnv', 'true')
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password')
    cy.wait(2000)
    cy.checkOpenWallet()
    cy.toWallet()
    cy.waitConnect()
  })
  it('transfer', () => {
    const amount = 100
    cy.createKey().as('firstKey').then(value => {
      // cy.task('log', value)
    })
    cy.wait(5000)
    cy.getCoin().then(text => {
      return cy.wrap(parseInt(text)).as('initCoin_firstKey')
    })
    cy.deleteKey()
    cy.createKey().as('secondKey').then(value => {
      // cy.task('log', value)
    })
    cy.getCoin().then(text => {
      return cy.wrap(parseInt(text)).as('initCoin_secondKey')
    })
    cy.get('@firstKey').then(value => {
      cy.walletTransfer(value.address, amount)
    })
    cy.wait(10000)
    cy.get('@initCoin_secondKey').then(initCoin => {
      cy.getCoin().then(coin => {
        cy.wrap(parseInt(coin)).should('be.lt', initCoin - amount)
      })
    })
    // 检查订单
    cy.get('@firstKey').then(firstKey => {
      cy.get('@secondKey').then(secondKey => {
        cy.walletCheckDetail({
          senderAddress: secondKey.address,
          recipientAddress: firstKey.address,
          amount: 100
        })
      })
    })
    
    // 更换key
    cy.deleteKey()
    cy.get('@firstKey').then(value => {
      cy.recoveryKey(value.privateKey)
    })
    cy.get('.blockchain-card:nth(3) tr:nth(1)', { timeout: 30000 })
    // 检查订单
    cy.get('@firstKey').then(firstKey => {
      cy.get('@secondKey').then(secondKey => {
        cy.walletCheckDetail({
          senderAddress: secondKey.address,
          recipientAddress: firstKey.address,
          amount: 100
        })
      })
    })
    cy.wait(5000)
    cy.get('@initCoin_firstKey').then(initCoin => {
      cy.getCoin().then(coin => {
        cy.wrap(parseInt(coin)).should('be.gte', initCoin + amount)
      })
    })
  })
})