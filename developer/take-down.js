/**
 * Configure take-down users/channels/posts in library. The users/channels/posts in
 * the take-down list will be removed in your app.
 * You can edit `take-down.json` to add default banned ids, and add administrators
 * to manage the lists in app.
 * Note that the `take-down.json` should exist in your own repository, and the app
 * will automatically fetch its latest version without upgrading the app.
 */
module.exports = {
  /**
   * @type { 'admin'|'committee' }
   * 'admin' mode will ban all ids if one of the admins ban them,
   * while 'committee' mode will only ban ids that at least half
   * of admins ban then.
   */
  mode: 'committee',
  /**
   * @type { string[] }
   * Preset keys of admins.
   * Note that you should use pubkey, not id.
   * Type `lib.user.is.pub` in main-process devtools console to get your pubkey.
   */
  admins: [
    'FQi3UfsB5zY7SSfLMPdl9Fdh7_EeM4og0ZGivp4tfJU.yXhvCAmmUz1Pw9-Iwhf9hpo9-H4WDHwezzRAGE5Oipk',
    'an_id_of_admin',
    'an_id_of_other_admin'
  ]
}
