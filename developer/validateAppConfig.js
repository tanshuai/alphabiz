const throwError = reason => {
  const errorMsg = `Failed to validate app config: ${reason}`
  const validateError = new Error(errorMsg)
  validateError.stack = validateError.stack.trim().split('\n')[0]
  throw validateError
}

/**
 * Windows Store does not allow registering following protocols.
 * @see https: //learn.microsoft.com/en-us/previous-versions/windows/apps/hh452686(v=win.10)#step-1-specify-the-extension-point-in-the-package-manifest
 */
const windowsReservedProtocols = [
  'application.manifest', 'application.reference', 'batfile', 'blob',
  'cerfile', 'chm.file', 'cmdfile', 'comfile', 'cplfile', 'dllfile', 'drvfile', 'exefile',
  'explorer.assocactionid.burnselection', 'explorer.assocactionid.closesession', 'explorer.assocactionid.erasedisc',
  'explorer.assocactionid.zipselection', 'explorer.assocprotocol.search-ms', 'explorer.burnselection', 'explorer.closesession', 'explorer.erasedisc', 'explorer.zipselection',
  'file', 'fonfile', 'hlpfile', 'htafile', 'inffile', 'insfile', 'internetshortcut', 'jsefile', 'lnkfile',
  'microsoft.powershellscript .1', 'ms-accountpictureprovider', 'ms-appdata', 'ms-appx', 'ms-autoplay', 'msi.package', 'msi.patch', 'ms-windows-store',
  'ocxfile', 'piffile', 'regfile', 'scrfile', 'scriptletfile', 'shbfile', 'shcmdfile', 'shsfile', 'smb', 'sysfile',
  'ttffile', 'unknown', 'usertileprovider', 'vbefile', 'vbsfile', 'windows.gadget', 'wsffile', 'wsfile', 'wshfile'
]

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
  if (windowsReservedProtocols.includes(config.protocol)) {
    throwError(`The protocol "${config.protocol}" is not available since it is reserved by Windows Store`)
  }
  if (!config.shortProtocol.match(/^[a-z][a-z0-9.\-+]{1,}/)) {
    throwError('config.shortProtocol should contain at least 2 characters, start with lower-case letter(a-z) and not include upper-case letters')
  }
  if (windowsReservedProtocols.includes(config.shortProtocol)) {
    throwError(`The protocol "${config.shortProtocol}" is not available since it is reserved by Windows Store`)
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
