/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />

// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

// ** This file is an example of how to write Cypress tests, you can safely delete it **

// This test will pass when run against a clean Quasar project
describe('Landing', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('.should() - assert that <title> is correct', () => {
    cy.title().should('include', 'Alphabiz')
  })
  it('.should() - has version number with x.x.x format', () => {
    cy.get('#version').contains(/^v\d+\.\d+\.\d+/)
  })
  it.skip('.should() - has correct version number', () => {
    cy.readFile('package.json').then((text) => {
      const regex = new RegExp(`^v${text.version}`)
      cy.get('#version').contains(regex)
    })
  })
  it.skip('.should() - has correct git commit id', () => {
    cy.readFile('commit.json').then((text) => {
      cy.get('#commit').should('have.text', '(' + text.commit + ')')
    })
  })
})
