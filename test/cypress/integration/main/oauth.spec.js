/// <reference path="cypress" />
/// <reference path="../../support/index.d.ts" />
describe('oauth',{
  retries: {
    runMode: 2,
    openMode: 2
  }
}, function () {
  beforeEach(function onBeforeEach () {
  })
  describe('github', () => {
    before(() => {
      
    })
    it.skip('login', () => {
      const username = Cypress.env('githubUsername')
      const password = Cypress.env('githubPassword')
      const loginUrl = 'https://github.com/login'

      cy.newVisit()
      cy.contains('Sign in with Github').click()
      cy.get('[name="login"]').type(username)
      cy.get('[name="password"]').type(password)
      cy.get('[name="commit"]').click()
      // cy.get('@cookies').then((cookies) => {
      //   for (const [name, item] of Object.entries(cookies)) {
      //     const options = {
      //       domain: 'github.com',
      //       path: '/',
      //       secure: true,
      //       httpOnly: false,
      //     };
      //     // cy.log(name, item.value, options)
      //     cy.setCookie(name, item.value, options)
      //   }
      // })

      // cy.visit('https://github.com/login')
      // // 在第一个 URL 上执行一些测试操作
      // cy.get('[name="login"]').type(username);
      // cy.get('[name="password"]').type(password);
      // cy.get('[name="commit"]').click();
      // cy.url().should('include', 'https://github.com/');
      // cy.getCookies().then((cookies) => {
      //   cy.log(`Found ${cookies.length} cookies:`);
      //   const cookieObj = {};
      //   for (let i = 0; i < cookies.length; i++) {
      //     const name = cookies[i].name;
      //     const value = cookies[i].value;
      //     cy.log(`${name}: ${value} ${cookies[i].domain} ${cookies[i].path}`);
      //     cookieObj[name] = {
      //       value,
      //       domain: cookies[i].domain,
      //       path: cookies[i].path,
      //       secure: cookies[i].secure,
      //       httpOnly: cookies[i].httpOnly,
      //       expiry: cookies[i].expiry,
      //     }
      //   }
      //   // 将 cookie 存储在变量中
      //   cy.wrap(cookieObj).as('cookies');
      // })


      //  cy.task('GitHubSocialLogin', {
      //   username: username,
      //   password: password,
      //   loginUrl: loginUrl,
      //   headless: true,
      //   logs: true,
      //   isPopup: true,
      //   loginSelector: 'button[data-testid="login"]',
      //   postLoginSelector: 'button[data-testid="logout"]',
      // }).then(({ cookies }) => {
      //   cy.log(cookies)
      // })
    })
  })
})