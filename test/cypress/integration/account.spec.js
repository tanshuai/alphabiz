/// <reference path="cypress" />
/// <reference path="../support/index.d.ts" />
import userData from '../fixtures/userData.json'
let isSkip = false
describe('Account', () => {
  before(() => {
    // Cypress.session.clearAllSavedSessions()
  })
  beforeEach(function onBeforeEach () {
    if (!(/delete\suser/.test(this.currentTest.title)) && isSkip) {
      this.skip()
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
  for (const user of userData) {
    it(user.modifyName + ' use ' + (user.isEmail ? 'email' : 'phone') + ' sign up', function () {
      cy.visit('/')
      // toggle sign in page
      cy.toSignIn()
      // sign in start
      cy.contains('Phone number or email').type('{selectall}{backspace}').type((user.isEmail ? Cypress.env(user.email) : '+1' + Cypress.env(user.phone)))
      cy.contains('Password').type('{selectall}{backspace}').type(Cypress.env(user.password))
      const newTime = new Date()
      cy.get('.q-btn__content').contains('Sign in').click()
      // wait page jump
      cy.get('.q-notification__message', { timeout: 40000 }).should('be.visible')
      // sign in end
      cy.get('body').then($body => {
        if ($body.find('.q-notification__message').length > 0) {
        // evaluates as true if button exists at all
          cy.get('.q-notification__message').then($header => {
            if ($header.is(':visible')) {
            // you get here only if button EXISTS and is VISIBLE
              const text = $header.text()
              cy.log(text)
              if (/Incorrect username or password/.test(text)) {
              // 用户未注册
                cy.log('用户未注册')
                // toggle sign up page
                cy.get('.q-card').contains('Sign up').click()
                // 选择用邮箱或手机号注册账号
                if (user.isEmail) {
                  cy.contains('Sign up by email').click()
                  cy.contains('Email').type(Cypress.env(user.email))
                } else {
                  cy.get('.amplify-select > .q-field__inner > .q-field__control').click()
                  cy.get('.q-menu', { timeout: 10000 }).should('be.visible').scrollTo(0, 600).then(a => {
                    cy.contains('Canada (+1)').click()
                    cy.get(':nth-child(1) > .amplify-input > .q-field__inner > .q-field__control', { timeout: 10000 }).type(Cypress.env(user.phone))
                  })
                }
                cy.contains('Password').type(Cypress.env(user.password))
                // should() receive Invitation code
                if (user.isTestInvitationCode) {
                  cy.contains('Invitation code').type('5EPD12NW3F')
                } else {
                // receive Invitation code
                  const newTime1 = new Date()
                  cy.task((user.isEmail ? 'getMail' : 'getSMS'), { type: 0, time: newTime1 }).then((code) => {
                    cy.log('Invitation code:' + code)
                    cy.contains('Invitation code').type(code.toString())
                  })
                }
                cy.get('.q-checkbox__inner').click()
                const newTime2 = new Date()
                cy.get('.q-btn__wrapper > .q-btn__content').contains('Next').click()
                // sign up part_one end
                // wait sent Verification code
                cy.intercept('https://cym314aopg.execute-api.ca-central-1.amazonaws.com/dev/account/source-ip/on-signed-up').as('OnSignedUp')
                cy.wait('@OnSignedUp', { timeout: 30000 })
                // hard wait
                // receive Verification code
                cy.task((user.isEmail ? 'getMail' : 'getSMS'), { type: 1, time: newTime2 }).then((code) => {
                  cy.log('Verification code:' + code)
                  cy.contains('Verification code').type(code.toString())
                })
                // finish sign up
                cy.get('.q-btn__wrapper > .q-btn__content').contains('Finish').click()
                cy.intercept('https://cym314aopg.execute-api.ca-central-1.amazonaws.com/dev/account/invitation/authorized/getCodeFromThis').as('signIn')
                cy.wait('@signIn', { timeout: 30000 })
                cy.contains('Signed up', { timeout: 10000 }).should('be.visible')
              } else if (/Signed in/.test(text)) {
              // 用户登录成功
                cy.log('用户登录成功')
              } else if (/Test/.test(text)) {
              // 用户注册未验证邮箱
                cy.log('用户注册未验证邮箱')
                cy.contains('Verify your identity', { timeout: 10000 }).should('be.visible')
                cy.log(newTime.toString())
                cy.task((user.isEmail ? 'getMail' : 'getSMS'), { type: 1, time: newTime }).then((code) => {
                  cy.log('Verification code:' + code)
                  cy.focused().type(code.toString())
                })
                cy.get('.q-btn__wrapper > .q-btn__content').contains('Submit').click()
                cy.contains('Signed in', { timeout: 30000 }).should('be.visible')
              }
            }
          })
        } else {
        // you get here if the button DOESN'T EXIST
          assert.isOk('everything', 'everything is OK')
        }
      })
      // cy.location('pathname', { timeout: 10000 }).should('eq', '/account/settings')
      cy.getAccountStatus()
    })
    it(user.modifyName + ' sign in', function () {
      // sign in
      cy.signIn((user.isEmail ? user.email : user.phone), user.password)
      // cy.location('pathname', { timeout: 10000 }).should('eq', '/account/settings')
      cy.getAccountStatus()
    })
    // 使用邮箱注册     =>  绑定手机号  =>  获取手机号短信验证码   =>  修改邮箱号  =>  获取邮箱验证码
    // 使用手机号注册   =>  绑定邮箱    =>  获取邮箱验证码        =>  修改手机号  =>  获取手机号短信验证码
    if ((user.isEmail ? user.phone : user.email)) {
      it(user.modifyName + ' verify ' + (user.isEmail ? 'phone' : 'email'), function () {
      // sign in
        cy.signIn((user.isEmail ? user.email : user.phone), user.password)
        // 如果还未verify
        cy.get('.account-setting__verification > :nth-child(' + (user.isEmail ? '2' : '1') + ')').click()
        if (user.isEmail) {
          cy.get('.option-flags').last().click()
          cy.get('.q-menu', { timeout: 10000 }).should('be.visible').scrollTo(0, 600).then(a => {
            cy.contains('Canada (+1)').click()
            cy.get('.q-card').contains('+1', { timeout: 10000 })
            cy.get('input[type="tel"]').type('{selectall}{backspace}').type(Cypress.env(user.phone))
          })
        } else {
          cy.focused().type('{selectall}{backspace}').type(Cypress.env(user.email))
        }
        // 获取验证码步骤相同
        const newTime = Date()
        cy.get("[data-cy='submit-btn']").click()
        cy.contains('Verification code', { timeout: 20000 }).should('be.visible')
        // cy.sleep(5000)
        // 判断获取 短信\邮箱验证码
        cy.task((user.isEmail ? 'getSMS' : 'getMail'), { type: 1, time: newTime }).then((code) => {
          cy.log('verification code:' + code)
          cy.contains('Verification code').type(code.toString())
        })
        cy.get("[data-cy='submit-btn']").click()
        // 断言 Changed 提示框弹出
        cy.contains('Changed', { timeout: 15000 }).should('be.visible')
        // 断言 绑定号码 已认证
        cy.get('.account-setting__verification').contains(Cypress.env(user.isEmail ? user.phone : user.email))
        cy.get('.account-setting__verification > :nth-child(' + (user.isEmail ? '2' : '1') + ')').contains('verified')
      })
    }

    if (user.changeEmail) {
      it(user.modifyName + ' change email', function () {
        // sign in
        cy.signIn((user.isEmail ? user.email : user.phone), user.password, { cacheSession: false })
        // 如果email还沒有修改
        cy.get('.account-setting__verification').then($header => {
          const text = $header.text()
          const text2 = $header.find(':nth-child(1)').text()
          const reg = new RegExp(Cypress.env(user.email))
          const reg2 = new RegExp('unverified')
          // 邮箱还是旧的 或 新邮箱未验证
          if (reg.test(text) || reg2.test(text2)) {
            cy.get('.account-setting__verification > :nth-child(1)').click()
            cy.focused().type('{selectall}{backspace}').type(Cypress.env(user.changeEmail))
            // 获取验证码步骤相同
            const newTime = Date()
            cy.get("[data-cy='submit-btn']").click()
            cy.contains('Verification code', { timeout: 20000 }).should('be.visible')
            // 判断获取 短信\邮箱验证码
            cy.task('getMail', { type: 1, time: newTime }).then((code) => {
              cy.log('verification code:' + code)
              cy.contains('Verification code').type(code.toString())
            })
            cy.get("[data-cy='submit-btn']").click()
            // 断言 Changed 提示框弹出
            cy.contains('Changed', { timeout: 10000 }).should('be.visible')
            // 断言 认证的号码 已更换
            cy.get('.account-setting__verification > :nth-child(1)').contains(Cypress.env(user.changeEmail))
            // 断言 绑定号码 已认证
            cy.get('.account-setting__verification > :nth-child(1)').contains('verified')
          }
        })
      })
    }

    if (user.changePhone) {
      it(user.modifyName + ' change phone', function () {
        // sign in
        cy.signIn((user.isEmail ? (user.changeEmail ? user.changeEmail : user.email) : user.phone), user.password, { cacheSession: false })
        // 如果phone还沒有修改
        cy.get('.account-setting__verification').then($header => {
          const text = $header.text()
          const reg = new RegExp(Cypress.env(user.phone))
          const text2 = $header.find(':nth-child(2)').text()
          const reg2 = new RegExp('unverified')
          // 手机号还是旧的  或 新手机号未验证
          if (reg.test(text) || reg2.test(text2)) {
            cy.get('.account-setting__verification > :nth-child(2)').click()
            cy.get('.option-flags').last().click()
            cy.get('.q-menu', { timeout: 10000 }).should('be.visible').scrollTo(0, 600).then(a => {
              cy.contains('Canada (+1)').click()
              cy.get('.q-card').contains('+1', { timeout: 10000 })
              cy.get('input[type="tel"]').type('{selectall}{backspace}').type(Cypress.env(user.changePhone))
            })
            // 获取验证码步骤相同
            const newTime = Date()
            cy.get("[data-cy='submit-btn']").click()
            cy.contains('Verification code', { timeout: 20000 }).should('be.visible')
            // 判断获取 短信\邮箱验证码
            cy.task('getSMS', { type: 1, time: newTime }).then((code) => {
              cy.log('verification code:' + code)
              cy.contains('Verification code').type(code.toString())
            })
            cy.get("[data-cy='submit-btn']").click()
            // 断言 Changed 提示框弹出
            cy.contains('Changed', { timeout: 10000 }).should('be.visible')
            // 断言 认证的号码 已更换
            cy.get('.account-setting__verification > :nth-child(2)').contains(Cypress.env(user.changePhone))
            // 断言 绑定号码 已认证
            cy.get('.account-setting__verification > :nth-child(2)').contains('verified')
          }
        })
      })
    }

    if (user.isSentInvitationCode) {
      it(user.modifyName + ' sent Invitation code to ' + (user.isSentToEmail ? 'email' : 'phone'), function () {
        // sign in
        cy.signIn((user.isEmail ? (user.changeEmail ? user.changeEmail : user.email) : user.phone), user.password, { cacheSession: false })
        cy.get('.account-setting__invitation-code-container > :nth-child(1)', { timeout: 5000 }).then($header => {
          const text = $header.text()
          cy.log(text)
          if (/available/.test(text)) {
            cy.get('.account-setting__invitation-code-container > :nth-child(1)').click()
            if (user.isSentToEmail) {
              cy.focused().type(Cypress.env(user.sentInvitationCode))
            } else {
              cy.get('.option-flags').last().click()
              cy.get('.q-menu', { timeout: 10000 }).should('be.visible').scrollTo(0, 600).then(a => {
                cy.contains('Canada (+1)').click()
                cy.get('.q-card').contains('+1', { timeout: 10000 })
                cy.get('input[type="tel"]').type('{selectall}{backspace}').type(Cypress.env(user.sentInvitationCode))
              })
            }
            cy.get("[data-cy='submit-btn']").click()
            // cy.get("[data-cy='cancel-btn']").click()
            cy.contains('Invitation code has been sent', { timeout: 10000 }).should('be.visible')
            cy.get('.account-setting__invitation-code-container > :nth-child(1)').contains('invited', { timeout: 10000 })
          }
        })
      })
    }
    it(user.modifyName + ' check and modify nickName', function () {
      // sign in
      cy.signIn((user.isEmail ? (user.changeEmail ? user.changeEmail : user.email) : user.phone), user.password)
      // modify nickName start
      cy.contains('Nickname').type('{selectall}{backspace}').type(user.modifyName)
      cy.get('.q-btn__wrapper > .q-btn__content').contains('Submit').click()
      // wait page jump
      // should nickname modify
      cy.contains('Changed', { timeout: 10000 }).should('be.visible')
      cy.get('.q-toolbar > .q-btn > .q-btn__wrapper > .q-btn__content').click()
      cy.get('.corner > .q-item > .q-item__section--main > :nth-child(1)').should('have.text', user.modifyName)
      cy.get('.fullscreen').click()
      // sign out
      // cy.signOut()
    })
  }
  it('test1 to test2 transfer - check bill details', () => {
    // 转账人账号 转账人密码
    const transferee = 'test1Email'
    const transfereePassword = 'password'
    // 收款人账号 收款人密码
    const payee = 'test2Email'
    const payeePassword = 'password'
    // 转账金额
    const transferAmount = 9
    cy.signIn(payee, payeePassword)
    cy.toCredits()
    cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(2)').click()
    cy.get('body').then($el => {
      // 获取 收款人 初始积分
      const payeePoint = $el.find('.text-right > div').text()
      cy.log('payeePoint:' + payeePoint)
      // 获取 收款人 ID
      let payeeID = $el.find('.col-grow > .q-btn > .q-btn__wrapper').text()
      // 去除文本两边的空格
      payeeID = payeeID.replace(/(^\s*)|(\s*$)/g, '')
      cy.log('payeeID:' + payeeID)
      cy.signIn(transferee, transfereePassword)
      cy.toCredits()
      cy.sleep(3000)
      cy.get('.text-right > div').then($element => {
        const point = parseInt($element.text())
        cy.log('point:' + point)
        cy.contains('Bonus >> 99').click()
        cy.get('.text-right > div').contains((point + 99).toString(), { timeout: 10000 })
      })
      // cy.get('.q-table__grid-content > :nth-child(1) > .q-item', { timeout: 10000 }).should('be.visible').contains('BONUS', { timeout: 10000 })
      // cy.get('.q-table__grid-content > :nth-child(1) > .q-item').contains('FINISH', { timeout: 10000 })

      cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(2)').click()
      cy.get('body').then($el => {
        // 获取 收款人 初始积分
        const transfereePoint = $el.find('.text-right > div').text()
        cy.log('payeePoint:' + transfereePoint)
        // 获取 收款人 ID
        let transfereeID = $el.find('.col-grow > .q-btn > .q-btn__wrapper').text()
        // 去除文本两边的空格
        transfereeID = transfereeID.replace(/(^\s*)|(\s*$)/g, '')
        cy.log('transfereeID:' + transfereeID)
        cy.get('.q-card').contains('Cancel').click()
        // 转账 start
        cy.transfer(payeeID, transferAmount)
        // 转账 end
        // 断言 付款人 转单明细
        cy.get('.q-table__grid-content > :nth-child(1) > .q-item').first().click()
        cy.get('.q-dialog__inner > .q-card', { timeout: 5000 }).should('be.visible').then($card => {
          cy.get('.rounded-borders > :nth-child(2)').contains(payeeID)
          cy.get('.rounded-borders > :nth-child(3)').contains('TRANSFER')
          cy.get('.rounded-borders > :nth-child(4)').contains('-' + transferAmount)
          cy.get('.rounded-borders > :nth-child(5)').contains('FINISH')
        })
        // 断言 付款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', (parseInt(transfereePoint) - transferAmount).toString())

        cy.signIn(payee, payeePassword)
        cy.toCredits()
        // 断言 收款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', (parseInt(payeePoint) + transferAmount).toString())
        // 断言 收款人 转单明细
        cy.get('.q-table__grid-content > :nth-child(1) > .q-item').first().click()
        cy.get('.q-dialog__inner > .q-card', { timeout: 5000 }).should('be.visible').then($card => {
          cy.get('.rounded-borders > :nth-child(2)').contains(transfereeID)
          cy.get('.rounded-borders > :nth-child(3)').contains('TRANSFER')
          cy.get('.rounded-borders > :nth-child(4)').contains('+' + transferAmount)
          cy.get('.rounded-borders > :nth-child(5)').contains('FINISH')
        })
      })
    })
  })
  it('test1 test2 Two-way transfer - check credits', () => {
    // 转账人账号 转账人密码
    const transferee = 'test1Email'
    const transfereePassword = 'password'
    // 收款人账号 收款人密码
    const payee = 'test2Email'
    const payeePassword = 'password'
    // 转账金额
    const transferAmount = 9
    // 循环次数
    const cycleTimes = 10
    cy.signIn(payee, payeePassword)
    cy.toCredits()
    cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(2)').click()
    cy.get('body').then($el => {
      // 获取 收款人 初始积分
      // .absolute-bottom-right
      const payeePoint = $el.find('.text-right > div').text()
      // 获取 收款人 ID
      let payeeID = $el.find('.col-grow > .q-btn > .q-btn__wrapper').text()
      // 去除文本两边的空格
      payeeID = payeeID.replace(/(^\s*)|(\s*$)/g, '')
      cy.log('payeeID:' + payeeID)
      cy.signIn(transferee, transfereePassword)
      cy.toCredits()
      cy.get('.q-card:nth-child(2) > .q-card__section:nth-child(1) > :nth-child(2)').click()
      cy.get('body').then($el => {
        // 获取 收款人 初始积分
        const transfereePoint = $el.find('.text-right > div').text()
        cy.log('payeePoint:' + transfereePoint)
        // 获取 收款人 ID
        let transfereeID = $el.find('.col-grow > .q-btn > .q-btn__wrapper').text()
        // 去除文本两边的空格
        transfereeID = transfereeID.replace(/(^\s*)|(\s*$)/g, '')
        cy.log('transfereeID:' + transfereeID)
        const afterPayeePoint = (parseInt(payeePoint) + cycleTimes * transferAmount).toString()
        const afterTransfereePoint = (parseInt(transfereePoint) - cycleTimes * transferAmount).toString()
        cy.get('.q-card').contains('Cancel').click()
        // 转账 start
        cy.times(cycleTimes, () => {
          cy.transfer(payeeID, transferAmount)
        })
        // 转账 end
        // 断言 付款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', afterTransfereePoint)

        cy.signIn(payee, payeePassword)
        cy.toCredits()
        // 断言 收款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', afterPayeePoint)
        // 转账 start
        cy.times(cycleTimes, () => {
          cy.transfer(transfereeID, transferAmount)
        })
        // 转账 end
        // 断言 收款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', payeePoint)
        cy.signIn(transferee, transfereePassword)
        cy.toCredits()
        // 断言 收款人 积分变化
        cy.get('.text-right > div').invoke('text').should('eq', transfereePoint)
      })
    })
  })
  for (const user of userData) {
    it(user.modifyName + ' password reset', function () {
      // sign in
      cy.signIn((user.isEmail ? (user.changeEmail ? user.changeEmail : user.email) : user.phone), user.password, { cacheSession: false })
      cy.sleep(1000)
      // password reset start
      cy.get('.q-btn__wrapper > .q-btn__content').contains('Change password').click()
      cy.contains('Current').type(Cypress.env(user.password))
      cy.contains('New').type(Cypress.env(user.resetPassword))
      cy.contains('Re-enter').type(Cypress.env(user.resetPassword))
      cy.get("[data-cy='submit-btn']").click()
      // wait page jump
      // should password reset
      cy.contains('Password has been reset', { timeout: 10000 }).should('be.visible')
      // password reset end
      // sign out
      // cy.signOut()
    })
    if (user.isSentInvitationCode) {
      it(user.modifyName + ' check invitation code status', function () {
        cy.signIn((user.isEmail ? (user.changeEmail ? user.changeEmail : user.email) : user.phone), user.resetPassword)
        // check invitation code should used
        cy.get('.account-setting__invitation-code-container').contains(user.invitationCodeStatus)
        // sign out
        // cy.signOut()
      })
    }
    it.only(user.modifyName + ' delete user', function () {
      // 使用resetPassword登录 => 登录失败 => 使用password登录 => 登录失败 => 账号删除成功
      //                      \  登录成功  => 删除账号        \   登陆成功 => 账号删除
      cy.visit('/')
      // toggle sign in page
      cy.toSignIn()
      // resetpassword sign in
      cy.contains('Phone number or email').type('{selectall}{backspace}').type(
        user.isEmail ? Cypress.env(user.changeEmail ? user.changeEmail : user.email) : '+1' + Cypress.env(user.phone))
      cy.contains('Password').type('{selectall}{backspace}').type(Cypress.env(user.resetPassword))
      cy.get('.q-btn__content').contains('Sign in').click()
      // wait page jump
      cy.get('.q-notification__message', { timeout: 40000 }).should('be.visible')
      cy.get('body').then($body => {
        cy.get('.q-notification__message').then($header => {
          const text = $header.text()
          cy.log(text)
          if (/Incorrect username or password/.test(text)) {
            // 密码修改失败
            cy.reload()
            cy.toSignIn()
            // cy.get('.q-notification__message', { timeout: 30000 }).should('not.be.visible')
            // password sign in
            cy.contains('Phone number or email').type('{selectall}{backspace}').type(
              user.isEmail ? Cypress.env(user.changeEmail ? user.changeEmail : user.email) : '+1' + Cypress.env(user.phone))
            cy.contains('Password').type('{selectall}{backspace}').type(Cypress.env(user.password))
            cy.get('.q-btn__content').contains('Sign in').click()
            // wait page jump
            cy.get('.q-notification__message', { timeout: 40000 }).should('be.visible')
            cy.get('body').then($body => {
              cy.get('.q-notification__message').then($header => {
                const text = $header.text()
                if (/Incorrect username or password/.test(text)) {
                  // 账号不存在,不需要删除

                } else if (/Signed in/.test(text)) {
                  // 使用password登录成功
                  cy.contains('Lv.', { timeout: 12000 }).click()
                  cy.get('[data-cy=account-settings-btn]').click()
                  cy.location('pathname', { timeout: 15000 }).should('eq', '/account/settings')
                  cy.deleteUser(user.password)
                }
              })
            })
            // cy.location('pathname', { timeout: 30000 }).should('eq', '/account/settings')
          } else if (/Signed in/.test(text)) {
            // 用户使用resetPassword登录成功
            cy.contains('Lv.', { timeout: 12000 }).click()
            cy.get('[data-cy=account-settings-btn]').click()
            cy.location('pathname', { timeout: 15000 }).should('eq', '/account/settings')
            cy.log('用户登录成功')
            cy.deleteUser(user.resetPassword)
          }
        })
      })
      // cy.log('isDeleteUser:' + isDeleteUser)
      // if (isDeleteUser) {
      //   // delete user start
      //   cy.get('.q-btn__wrapper > .q-btn__content').contains('delete account').click()
      //   cy.get('.q-card', { timeout: 10000 }).should('be.visible').then($el => {
      //     cy.get('[aria-label="Password"]').type('{selectall}{backspace}').type(Cypress.env(finalPassword))

      //     cy.get("[data-cy='submit-btn']").click()
      //   })
      //   cy.location('pathname', { timeout: 15000 }).should('eq', '/account')
      //   cy.log('删除成功')
      //   // delete user end
      // }
    })
  }
})
