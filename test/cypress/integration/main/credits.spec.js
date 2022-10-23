/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />
///
let isSkip = false
describe('Credits', () => {
  beforeEach(function onBeforeEach () {
    if (!(/delete/.test(this.currentTest.title))) {
      if (isSkip) {
        this.skip()
      }
    }
  })
  afterEach(function onAfterEach () {
    // 如果注册未成功，跳过所有登录测试
    if (/sign\sup/.test(this.currentTest.title)) {
      if (this.currentTest._currentRetry === 2 && this.currentTest.state === 'failed') {
        isSkip = true
        // Cypress.runner.stop()
        // this will skip tests only for current spec
      }
    }
  })
  it('test1 to test2 transfer - check bill details', () => {
    let from
    let to
    if (process.platform === 'win32') {
      from = 'test2'
      to = 'test1'
    } else if (process.platform === 'linux') {
      from = 'test4'
      to = 'test3'
    } else {
      from = 'test6'
      to = 'test5'
    }
    // 转账人账号 转账人密码
    const transferee = from + Cypress.env('testEmailDomain')
    const transfereePassword = 'password'
    // 收款人账号 收款人密码
    const payee = to + Cypress.env('testEmailDomain')
    const payeePassword = 'password'
    // 转账金额
    const transferAmount = 1
    cy.signIn(payee, payeePassword)
    cy.toCredits()
    cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(2)').click()
    cy.get('body').then($el => {
      // 获取 收款人 初始积分
      const payeePoint = $el.find('.text-right > div').text()
      cy.log('payeePoint:' + payeePoint)
      // 获取 收款人 ID
      // old way : find(element).text() new: find(input).val()
      let payeeID = $el.find('input[type=text]').val()
      // 去除文本两边的空格
      payeeID = payeeID.replace(/(^\s*)|(\s*$)/g, '')
      cy.log('payeeID:' + payeeID)
      cy.signIn(transferee, transfereePassword)
      cy.toCredits()
      cy.sleep(3000)
      cy.get('.text-right > div').then($element => {
        const point = parseInt($element.text())
        cy.log('point:' + point)
        // cy.contains('Bonus >> 99').click()
        // cy.get('.text-right > div').contains((point + 99).toString(), { timeout: 15000 })
      })
      // cy.get('.q-table__grid-content > :nth-child(1) > .q-item', { timeout: 15000 }).should('be.visible').contains('BONUS', { timeout: 15000 })
      // cy.get('.q-table__grid-content > :nth-child(1) > .q-item').contains('FINISH', { timeout: 15000 })

      cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(2)').click()
      cy.get('body').then($el => {
        // 获取 收款人 初始积分
        const transfereePoint = $el.find('.text-right > div').text()
        cy.log('payeePoint:' + transfereePoint)
        // 获取 收款人 ID
        let transfereeID = $el.find('input[type=text]').val()
        // 去除文本两边的空格
        transfereeID = transfereeID.replace(/(^\s*)|(\s*$)/g, '')
        cy.log('transfereeID:' + transfereeID)
        cy.get('.q-card').contains('Cancel').click()
        // 转账 start
        cy.transfer(payeeID, transferAmount)
        // 转账 end
        // 断言 付款人 转单明细
        cy.get('.q-table__grid-content > :nth-child(1)').eq(1).click()
        cy.get('.q-dialog__inner > .q-card', { timeout: 5000 }).should('be.visible').then($card => {
          cy.get('.rounded-borders > :nth-child(2)').contains(payeeID)
          cy.get('.rounded-borders > :nth-child(3)').contains('Transfer')
          cy.get('.rounded-borders > :nth-child(4)').contains('-' + transferAmount)
          cy.get('.rounded-borders > :nth-child(5)').contains('finish')
        })
        // 断言 付款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', (parseInt(transfereePoint) - transferAmount).toString())

        cy.signIn(payee, payeePassword)
        cy.toCredits()
        // 断言 收款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', (parseInt(payeePoint) + transferAmount).toString())
        // 断言 收款人 转单明细
        cy.get('.q-table__grid-content > :nth-child(1)').eq(0).click()
        cy.get('.q-dialog__inner > .q-card', { timeout: 5000 }).should('be.visible').then($card => {
          cy.get('.rounded-borders > :nth-child(2)').contains(transfereeID)
          cy.get('.rounded-borders > :nth-child(3)').contains('Transfer')
          cy.get('.rounded-borders > :nth-child(4)').contains('+' + transferAmount)
          cy.get('.rounded-borders > :nth-child(5)').contains('finish')
        })
      })
    })
  })
})
