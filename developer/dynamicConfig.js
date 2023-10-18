/**
 * Configure dynamic config for development
 */
module.exports = {
  remote: {
    url: 'https://alpha.biz/app/remote_config.json'
  },
  local: {
    id: 'local_config_v1',
    oauth: {
      enable: false,
      providers: [
        'Github',
        'Twitter'
      ]
    }
  }
}
