/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('LanguageSelection', () => {
  beforeEach(function onBeforeEach () {
  })
  it('lang', () => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password', { isWebsite: true })
    cy.changeLanguage('EN', 'CN')
    cy.changeLanguage('CN', 'TW')
    cy.changeLanguage('TW', 'EN')
  })
})
