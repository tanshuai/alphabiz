
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
Cypress.Commands.add('clickMenu', () => {
  cy.get('[aria-label="Menu"]').then($element => {
    const text = $element.text()
    if (text === 'menu') {
      cy.get('[aria-label="Menu"]').click({ timeout: 40000 })
    }
  })
})
Cypress.Commands.add('toSignIn', () => {
  cy.clickMenu()
  cy.get('.left-drawer-header').contains('Sign in').click()
  // cy.location('pathname', { timeout: 10000 }).should('eq', '/account')
  cy.get('.q-card', { timeout: 3000 }).should('be.visible')
})
Cypress.Commands.add('toCredits', () => {
  cy.clickMenu()
  cy.get('.q-drawer__content').contains('Credits').click()
  cy.get('.q-linear-progress__model', { timeout: 10000 }).should('be.visible')
  cy.get('.q-linear-progress__model', { timeout: 10000 }).should('not.exist')
})
Cypress.Commands.add('toMoreHoriz', () => {
  cy.clickMenu()
  cy.get('.left-drawer-header').contains('more_horiz', { timeout: 40000 }).click({ timeout: 30000 })
  cy.get('[data-cy=account-settings-btn]').click()
})

Cypress.Commands.add('newVisit', (isWebsite = false) => {
  const setCookieToContentWindow = (
    contentWindow,
    name,
    value,
    { expireMinutes = 1 } = {},
  ) => {
    const date = new Date();
    const expireTime = expireMinutes * 60 * 1000;
    date.setTime(date.getTime() + expireTime);
    const assignment = `${name}=${encodeURIComponent(value)}`;
    const expires = `expires=${date.toGMTString()}`;
    const path = 'path=/';
    contentWindow.document.cookie = [assignment, expires, path].join(';');
  }

  cy.visit(isWebsite ? 'https://web.alpha.biz' : '/', {
    onBeforeLoad: (contentWindow) => {
      setCookieToContentWindow(contentWindow, 'TestEnv', 'true')
    }
  })

  cy.task('appconfig').then(app => {
    const libraryName = app.name === 'Alphabiz' ? 'ab' : app.name.toLowerCase()
    window.localStorage.setItem(`library-pair@${libraryName}-test-cate-v4-2`, '{"epub":"8idxYmEadAwjoU7U1J056cyHzUeoXSslOBCAP73WZyc.mdvNkj-aK7AyEEJFo0vSm752BIgUPZHoDs7IbZuopTs","pub":"fBH0GXG8L38EBkqkBSyXbMFVHkEYUK7s4ynPupdvp8E.XD52mHLI7O-Ad1JzAkDn2brY5-GLfbkSgP-3pB6k4Qs","epriv":"rsdtLTMMiDthgCttGqsKJTYcMRgu6Z8GD8SP4GW3VYk","priv":"m6mRg3N8qLRq_wsr1wiazT6YYVUhqZJGEUKu_drxINQ"}')
  })
  window.localStorage.setItem('set-film-rate', 'G')
  cy.task('appconfig').then(app => {
    if (app.displayName === 'Alphabiz') {
      cy.get('#version').then(($el) => {
        const text = $el.text()
        if (text.includes('internal') || text.includes('nightly')) {
          cy.contains('INTERNAL DEMO ONLY', { timeout: 20000 })
          cy.get('.q-card button').contains('close').click()
        }
      })
    }
  })
})

// cacheSession = true => call session()
Cypress.Commands.add('signIn', (username, password, { cacheSession = true, isWebsite = false } = {}) => {
  const ALERT = '.q-notifications__list--bottom.items-end > .q-notification > .q-notification__wrapper > .q-notification__content > .q-notification__message'
  const login = () => {

    cy.newVisit(isWebsite)
    cy.get('.q-card', { timeout: 5000 }).then(($element) => {
      if (!$element.is(':visible')) {
        // toggle sign in page
        cy.toSignIn()
        // sign in start
      }
    })
    let user
    if (/@/.test(username)) {
      user = username
    } else {
      user = '+1' + Cypress.env(username)
    }
    cy.contains('Phone number or email', { timeout: 30000 }).type('{selectall}{backspace}').type(user, { log: false })
    cy.contains('Password').type('{selectall}{backspace}').type(Cypress.env(password), { log: false })
    cy.get('.q-card__actions').contains('Sign in').click()
    // wait page jump
    cy.get(ALERT, { timeout: 60000 * 2 })
    cy.get('body').then($body => {
      if ($body.find(ALERT).length > 0) {
        // evaluates as true if button exists at all
        cy.get(ALERT).then($header => {
          // you get here only if button EXISTS and is VISIBLE
          const text = $header.text()
          cy.log(text)
          cy.task('log', 'alert:' + text)
          if (/There is a problem with the network, please try again later/.test(text) ||
            /Pending sign-in attempt already in progress/.test(text) ||
            /reCAPTCHA verification error/.test(text) ||
            /ReCAPTCHA validation failed/.test(text)) {
            cy.log('text is There is a problem with the network')
            cy.get(ALERT, { timeout: 60000 * 2 }).should('not.be.exist')
            cy.get('.q-card__actions').contains('Sign in').click()
          } else {
            cy.log('text is not network')
          }
        })
      }
    })
    cy.get(ALERT, { timeout: 60000 * 2 }).should('have.text', 'Signed in')
    cy.toMoreHoriz()
  }
  if (cacheSession) {
    cy.session([username, password], login, {
      validate () {
        cy.newVisit(isWebsite)
        let user
        if (/@/.test(username)) {
          user = username
        } else {
          user = '+1' + Cypress.env(username)
        }
        cy.toMoreHoriz()
        cy.get('.account-setting__verification').contains(user)
      }
    })
    cy.newVisit(isWebsite)
    cy.get('.post-card', { timeout: 60000 }).should('be.visible')
    cy.toMoreHoriz()
  } else {
    login()
  }
})
Cypress.Commands.add('signOut', () => {
  cy.clickMenu()
  cy.sleep(3000)
  cy.contains('more_horiz').click()
  cy.get("[data-cy='sign-out-btn']").click()
  cy.contains('Sign out anyway').click()
  cy.contains('Signed out', { timeout: 30000 }).should('be.visible')
})

Cypress.Commands.add('getAccountStatus', () => {
  cy.sleep(1000)
  cy.clickMenu()
  // cy.get('.left-drawer-header').then(($el) => {
  //   const isVisible = Cypress.dom.isVisible($el)
  //   cy.log('isVisible' + isVisible)
  //   if (!isVisible) {
  //     cy.get('[aria-label="Menu"]').click({ timeout: 30000 })
  //   } // true
  // })
  cy.get('.left-drawer-header').then(($div) => {
    const text = $div.text()
    cy.log(text)
    // cy.log(/Lv/.test(text))
    expect(text).to.match(/Lv/)
  })
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
