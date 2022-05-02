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
  it('.should() - has correct version number', () => {
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

// Trigger E2E CI for fix #8

// ** The following code is an example to show you how to write some tests for your home page **
//
// describe('Home page tests', () => {
//   beforeEach(() => {
//     cy.visit('/');
//   });
//   it('has pretty background', () => {
//     cy.dataCy('landing-wrapper')
//       .should('have.css', 'background').and('match', /(".+(\/img\/background).+\.png)/);
//   });
//   it('has pretty logo', () => {
//     cy.dataCy('landing-wrapper img')
//       .should('have.class', 'logo-main')
//       .and('have.attr', 'src')
//       .and('match', /^(data:image\/svg\+xml).+/);
//   });
//   it('has very important information', () => {
//     cy.dataCy('instruction-wrapper')
//       .should('contain', 'SETUP INSTRUCTIONS')
//       .and('contain', 'Configure Authentication')
//       .and('contain', 'Database Configuration and CRUD operations')
//       .and('contain', 'Continuous Integration & Continuous Deployment CI/CD');
//   });
// });
