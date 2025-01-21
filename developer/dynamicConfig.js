/**
 * Configure dynamic config for development
 */
module.exports = {
  remote: {
    url: 'https://alpha.biz/app/remote_config'
  },
  local: {
    type: 'local',
    version: 'default:v1',
    oauth: {
      enable: false,
      providers: [
        'Github',
        'Twitter'
      ]
    },
    library: {
      show_explore: false
    },
    update: {
      enable: false
    }
  }
}
