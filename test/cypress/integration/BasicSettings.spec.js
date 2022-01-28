/// <reference path="cypress" />
/// <reference path="../support/index.d.ts" />

describe('LanguageSelection', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[aria-label="Menu"]').click()
    cy.contains('Settings').click()
    cy.contains('Basic').click()
  })
  it('.should() - 判断基础设置-语言切换简体中文是否有效', () => {
    cy.get('[data-cy="select-direct"]').click()
    cy.contains('简体中文').click()
    cy.get('header > .text-h5').contains('基础设置').click()
  })
  it('.should() - 判断基础设置-语言切换繁体中文是否有效', () => {
    cy.get('[data-cy="select-direct"]').click()
    cy.contains('繁體中文').click()
    cy.get('header > .text-h5').contains('基礎設置').click()
  })
  it('.should() - 判断基础设置-语言切换English是否有效', () => {
    cy.get('[data-cy="select-direct"]').click()
    cy.contains('English').click()
    cy.get('header > .text-h5').contains('Basic').click()
  })
})
