/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('LanguageSelection', () => {
  beforeEach(() => {
    cy.signIn('test1' + Cypress.env('testEmailDomain'), 'password')
  })
  it('CN', () => {
    cy.changeLanguage('EN', 'CN')
  })
  it('TW', () => {
    cy.changeLanguage('EN', 'TW')
  })
  it('EN', () => {
    cy.changeLanguage('EN', 'CN')
    cy.changeLanguage('CN', 'EN')
  })
})
