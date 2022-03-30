// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload'
Cypress.Commands.add(
  'dataCy',
  {
    prevSubject: 'optional'
  },
  (subject, value) => {
    return cy.get(`[data-cy=${value}]`, {
      withinSubject: subject
    })
  }
)

Cypress.Commands.add('testRoute', (route) => {
  cy.location().should((loc) => {
    if (loc.hash.length > 0) {
      // Vue-Router in hash mode
      expect(loc.hash).to.contain(route)
    } else {
      // Vue-Router in history mode
      expect(loc.pathname).to.contain(route)
    }
  })
})

// these two commands let you persist local storage between tests
const LOCAL_STORAGE_MEMORY = {}

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
})

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})

// jump page command
Cypress.Commands.add('toSignIn', () => {
  cy.get('[aria-label="Menu"]').click()
  cy.get('.left-drawer-header').contains('Sign in').click()
  // cy.location('pathname', { timeout: 10000 }).should('eq', '/account')
  cy.get('.q-card', { timeout: 3000 }).should('be.visible')
})
Cypress.Commands.add('toCredits', () => {
  cy.get('[aria-label="Menu"]').click()
  cy.get('.q-drawer__content').contains('Credits').click()
  cy.get('.q-linear-progress__model', { timeout: 10000 }).should('be.visible')
  cy.get('.q-linear-progress__model', { timeout: 10000 }).should('not.exist')
})

// cacheSession = true => call session()
// cacheSession = true => call session()
Cypress.Commands.add('signIn', (username, password, { cacheSession = true } = {}) => {
  const login = () => {
    cy.visit('/')
    // toggle sign in page
    cy.toSignIn()
    // sign in start
    let user
    if (/@/.test(username)) {
      user = username
    } else {
      user = '+1' + Cypress.env(username)
    }
    cy.contains('Phone number or email').type('{selectall}{backspace}').type(user)
    cy.contains('Password').type('{selectall}{backspace}').type(Cypress.env(password))
    cy.get('.q-card__actions').contains('Sign in').click()
    // wait page jump
    cy.get('.q-notification__message', { timeout: 40000 }).should('be.visible').then($header => {
      const text = $header.text()
      cy.log(text)
      if (/There is a problem with the network, please try again later/.test(text) ||
        /Pending sign-in attempt already in progress/.test(text)) {
        cy.log('text is There is a problem with the network')
        cy.get('.q-notification__message', { timeout: 30000 }).should('not.be.visible')
        cy.get('.q-card__actions').contains('Sign in').click()
      } else {
        cy.log('text is not network')
      }
    })
    cy.get('.q-notification__message', { timeout: 30000 }).should('have.text', 'Signed in')
    cy.contains('more_horiz', { timeout: 20000 }).click()
    cy.get('[data-cy=account-settings-btn]').click()
    // cy.location('pathname', { timeout: 30000 }).should('eq', '/account/settings')
    // sign in end
  }
  if (cacheSession) {
    cy.session([username, password], login, {
      validate () {
        cy.visit('/')
        let user
        if (/@/.test(username)) {
          user = username
        } else {
          user = '+1' + Cypress.env(username)
        }
        cy.get('[aria-label="Menu"]').click()
        cy.contains('more_horiz', { timeout: 20000 }).click()
        cy.get('[data-cy=account-settings-btn]').click()
        // cy.location('pathname', { timeout: 12000 }).should('eq', '/account/settings')
        cy.get('.account-setting__verification').contains(user)
      }
    })
    cy.visit('/')
    cy.get('[aria-label="Menu"]').click()
    cy.contains('more_horiz', { timeout: 20000 }).click()
    cy.get('[data-cy=account-settings-btn]').click()
    // cy.location('pathname', { timeout: 12000 }).should('eq', '/account/settings')
  } else {
    login()
  }
})
Cypress.Commands.add('signOut', () => {
  // sign out start
  cy.get('[aria-label="Menu"]').click()
  cy.get('.corner > .q-item').click()
  cy.get("[data-cy='sign-out-btn']").click()
  // cy.intercept('https://cognito-idp.ca-central-1.amazonaws.com/').as('completed')
  // cy.wait('@completed', { timeout: 10000 })
  cy.contains('Signed out', { timeout: 30000 }).should('be.visible')
  // sign out end
})

Cypress.Commands.add('getAccountStatus', () => {
  cy.sleep(1000)
  cy.get('.left-drawer-header').then(($el) => {
    const isVisible = Cypress.dom.isVisible($el)
    cy.log('isVisible' + isVisible)
    if (!isVisible) {
      cy.get('[aria-label="Menu"]').click()
    } // true
  })
  cy.get('.left-drawer-header').then(($div) => {
    const text = $div.text()
    cy.log(text)
    // cy.log(/Lv/.test(text))
    expect(text).to.match(/Lv/)
  })
})

// credits command
Cypress.Commands.add('transfer', (ID, amount) => {
  // 转账 start
  cy.get('button').contains('Transfer').click()
  // cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(1)').click()
  cy.get('.q-dialog__inner > .q-card', { timeout: 5000 }).should('be.visible').then($card => {
    cy.get('[aria-label="Receipt Code"]').then($input => {
      cy.log('111:' + $input.val())
      if ($input.val() === '') cy.get('[aria-label="Receipt Code"]').type(ID)
    })
    cy.get('[aria-label="Transfer Amount"]').type(amount)
    cy.get('.bg-primary > .q-btn__wrapper').click()
  })
  // 等待 q-card 退出
  cy.get('.q-dialog__inner > .q-card', { timeout: 20000 }).should('not.exist')
  // 转账 end
  cy.sleep(500)
})

// util command
Cypress.Commands.add('sleep', (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
})
Cypress.Commands.add('times', (times, callback) => {
  for (let n = 0; n < times; n++) {
    cy.log('The' + n + 'cycle')
    callback && callback()
  }
})
