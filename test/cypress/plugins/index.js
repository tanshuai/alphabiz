/* eslint-env node */
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

require('dotenv').config()
const { calculation } = require('../../utils/calculation')
module.exports = (on, config) => {
  on('task', {
    calculation ({ type, from, to }) {
      return calculation(type, from, to)
    },
    log (message) {
      console.log(message)
      return null
    }
  })
  // copy any needed variables from process.env to config.env
  config.env.testEmail = process.env.EMAIL_USERNAME
  config.env.test1Email = process.env.TEST1_EMAIL
  config.env.test2Email = process.env.TEST2_EMAIL
  config.env.test3Email = process.env.TEST3_EMAIL
  config.env.test1PhoneNumber = process.env.TEST1_PHONE_NUMBER
  config.env.test2PhoneNumber = process.env.TEST2_PHONE_NUMBER
  config.env.test3PhoneNumber = process.env.TEST3_PHONE_NUMBER
  config.env.password = process.env.TEST_PASSWORD
  config.env.resetPassword = process.env.TEST_RESET_PASSWORD
  config.env.testEmailDomain = process.env.TEST_EMAIL_DOMAIN
  // do not forget to return the changed config object!
  return config
}
