const HEADER_TITLE = '.crumb-label'
const LANGUAGE_SELECTION = '[data-cy="select-direct"]:nth()'
const I18N = {
  LANGUAGE_OPTIONS: {
    EN: 'English',
    CN: '简体中文',
    TW: '繁體中文'
  },
  SAVE_BTN: {
    EN: 'Save & Apply',
    CN: '保存并应用',
    TW: '保存並應用'
  },
  SAVE_ALERT: {
    EN: 'Save preferences successfully',
    CN: '偏好设置成功',
    TW: '偏好設置成功'
  },
  BASIC_TITLE: {
    EN: 'Basic',
    CN: '基础设置',
    TW: '基礎設置'
  }
}
Cypress.Commands.add('toBasic', (Lang = 'EN') => {
  cy.clickMenu()
  cy.contains(I18N.BASIC_TITLE[Lang]).click()
})

Cypress.Commands.add('changeLanguage', (lang, targetLang) => {
  cy.toBasic(lang)
  cy.get(LANGUAGE_SELECTION).click()
  cy.contains(I18N.LANGUAGE_OPTIONS[targetLang]).click()
  cy.contains(I18N.SAVE_BTN[targetLang]).click()
  cy.get(HEADER_TITLE).contains(I18N.BASIC_TITLE[targetLang]).click()
  cy.contains(I18N.SAVE_ALERT[targetLang]).click()
  // 刷新验证是否保存
  cy.reload()
  cy.location('pathname', { timeout: 60000 }).should('eq', '/library')
  cy.toBasic(targetLang)
  cy.get(HEADER_TITLE).contains(I18N.BASIC_TITLE[targetLang]).click()
})