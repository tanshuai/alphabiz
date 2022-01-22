/// <reference path="cypress" />
/// <reference path="../support/index.d.ts" />
///
let isSkip = false
describe.skip('Credits', () => {
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
  it('sign up', () => {
    cy.visit('/')
    const newTime1 = new Date()
    cy.task('getMail', { type: 0, time: newTime1 }).then((code) => {
      cy.log('Invitation code:' + code)
      // cy.contains('Invitation code').type(code.toString())
    })
    cy.contains('123124fsdcvfs23412', { timeout: 3000 })
  })
  it('sign in', () => {
    cy.visit('/')
    cy.toSignIn()
    cy.contains('Phone number or email').type('{selectall}{backspace}').type(Cypress.env('test1Email'))
  })
  it('delete', () => {
    cy.visit('/')
    cy.toSignIn()
    cy.contains('Phone number or email').type('{selectall}{backspace}').type(Cypress.env('test1Email'))
  })
})
