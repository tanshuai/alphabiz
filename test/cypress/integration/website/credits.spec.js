/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Credits', () => {
  beforeEach(function onBeforeEach () {
  })
  it('test1 to test2 transfer - check bill details', () => {
    let from
    let to
    if (Cypress.platform === 'win32') {
      from = 'test2'
      to = 'test1'
    } else if (Cypress.platform === 'linux') {
      from = 'test4'
      to = 'test3'
    } else {
      from = 'test6'
      to = 'test5'
    }
    // 转账人账号 转账人密码
    const transferee = {
      account: from + Cypress.env('testEmailDomain'),
      password: 'password'
    }
    // 收款人账号 收款人密码
    const payee = {
      account: to + Cypress.env('testEmailDomain'),
      password: 'password'
    }
    // 转账金额
    const transferAmount = 1

    cy.signIn(payee.account, payee.password, { isWebsite: true })
    cy.toCredits()
    cy.getPoint().as('payeePoint')
    cy.getReceiptCode().as('payeeReceiptCode')

    cy.signIn(transferee.account, transferee.password, { isWebsite: true })
    cy.toCredits()
    cy.getPoint().as('transfereePoint')
    cy.getReceiptCode().as('transfereeReceiptCode')
    
    cy.get('@payeeReceiptCode').then(payeeReceiptCode => {
      // 转账 start
      cy.transfer(payeeReceiptCode, transferAmount)
      // 检查 转账人 订单
      cy.checkBillDetail({
        user: 'transferee',
        id: payeeReceiptCode,
        type: 'Transfer',
        amount: '-' + transferAmount
      })
    })
    cy.get('@transfereePoint').then(transfereePoint => {
      // 断言 转账人 积分变化
      cy.task('calculation', { type: 'reduce', from: transfereePoint, to: transferAmount }).then((number) => {
        cy.getPoint().should('eq', number.toString())
      })
    })

    cy.signIn(payee.account, payee.password, { isWebsite: true })
    cy.toCredits()
    cy.get('@payeePoint').then(payeePoint => {
      // 断言 收款人 积分变化
      cy.task('calculation', { type: 'add', from: payeePoint, to: transferAmount }).then((number) => {
        cy.getPoint().should('eq', number.toString())
      })
    })
    cy.get('@transfereeReceiptCode').then(transfereeReceiptCode => {
      // 检查 收款人 订单
      cy.checkBillDetail({
        user: 'payee',
        id: transfereeReceiptCode,
        type: 'Transfer',
        amount: transferAmount
      })
    })
  })
})
