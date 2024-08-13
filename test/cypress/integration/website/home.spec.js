/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

// ** This file is an example of how to write Cypress tests, you can safely delete it **

// This test will pass when run against a clean Quasar project
describe('Landing', () => {
  beforeEach(() => {
    cy.setCookie('TestEnv', 'true')
    cy.visit('https://web.alpha.biz')
  })
  it('.should() - assert that <title> is correct', () => {
    cy.task('appconfig').then(app => {
      cy.title().should('include', app.displayName)
    })
  })
  it('.should() - has version number with x.x.x format', () => {
    cy.get('#version').contains(/^v\d+\.\d+\.\d+/)
  })
})

