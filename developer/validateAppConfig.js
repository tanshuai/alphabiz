const throwError = reason => {
  const errorMsg = `Failed to validate app config: ${reason}`
  const validateError = new Error(errorMsg)
  validateError.stack = validateError.stack.trim().split('\n')[0]
  throw validateError
}
module.exports = function validateAppConfig (config) {
  if (!config || typeof config !== 'object') {
    throwError('config is not an object')
  }
  for (const key of [
    'name', 'displayName', 'author', 'developer',
    'description', 'publisher', 'homepage', 'upgradeCode',
    'protocol', 'shortProtocol'
  ]) {
    if (!(key in config) || typeof config[key] !== 'string') {
      throwError(`config.${key} must be string`)
    }
  }
  if (!config.name.match(/^[a-zA-Z0-9.\-+]{3,}/)) {
    throwError('config.name should contain at least 3 characters')
  }
  if (!config.protocol.match(/^[a-z][a-z0-9.\-+]{2,}/)) {
    throwError('config.protocol should contain at least 3 characters, start with lower-case letter(a-z) and not include upper-case letters')
  }
  if (!config.shortProtocol.match(/^[a-z][a-z0-9.\-+]{1,}/)) {
    throwError('config.shortProtocol should contain at least 2 characters, start with lower-case letter(a-z) and not include upper-case letters')
  }
  if (config.name.toLowerCase() === config.shortProtocol) {
    throwError('config.shortProtocol should not be same as config.name')
  }
  if (config.protocol === config.shortProtocol) {
    throwError('config.shortProtocol should not be same as config.protocol')
  }
  if (config.protocol === config.shortProtocol) {
    throwError('config.shortProtocol should not be same as app name')
  }
  if (!config.register || typeof config.register !== 'object') {
    throwError('config.register should be object')
  }
  if (config.register.mode === 'whitelist') {
    if (!Array.isArray(config.register.list) || config.register.list.length === 0) {
      throwError('config.register.list should be array with at least one country code since register mode is "whitelist"')
    }
  }
}
