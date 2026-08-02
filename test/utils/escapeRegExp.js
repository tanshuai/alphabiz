'use strict'

module.exports = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
