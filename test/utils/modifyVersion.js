const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const modifyVersion = async (opt = {}) => new Promise(resolve => {
  if (!opt) resolve(false)
  const versionPath = path.resolve(__dirname, '../../public/version.json')
  let versionObj = require(versionPath)
  // modify
  if (opt.packageVer) versionObj.packageVer = opt.packageVer
  if (opt.channel) versionObj.channel = opt.channel
  if (opt.buildTime) versionObj.buildTime = opt.buildTime
  if (opt.buildCommit) versionObj.buildCommit = opt.buildCommit
  if (opt.sourceCommit) versionObj.sourceCommit = opt.sourceCommit
  if (opt.version) versionObj.version = opt.version

  // console.log(versionObj, versionPath)
  const data = JSON.stringify(versionObj, null, 2)
  fs.writeFileSync(versionPath, data)
})

const getminversions = async () => {
  const app = require('../../developer/app')
  const versionsUrl = app.versionsUrl
  console.log(versionsUrl)
  let versions
  try {
    versions = await (await fetch(versionsUrl)).json()
  } catch (e) {
    versions = {
      min: {
        stable: '0.1.0',
        nightly: '0.1.0-nightly-202205301917',
        internal: '0.1.0-internal-202205301821'
      }
    }
  }
  return versions.min
}

const getUpdatableVersion = (channel, minVersion, opt = { isExpired: false }) => {
  let targetVersion = ''
  if (
    typeof minVersion === 'object' &&
    !Array.isArray(minVersion) &&
    minVersion !== null
  ) {
    targetVersion = minVersion[channel]
  } else {
    targetVersion = minVersion
  }
  if (!opt.isExpired) return targetVersion

  if (channel !== 'stable') {
    const buildTime = parseVersion(targetVersion).build
    const expiredTime = parseBuildTime(buildTime)
    console.log('targetVersion:', targetVersion)
    targetVersion = targetVersion.replace(/\d{8}/gm, expiredTime)
  } else {
    const versionArr = targetVersion.split('.')
    if (versionArr[2] !== '0') {
      versionArr[2] = parseInt(versionArr[2]) - 1
    } else if (versionArr[1] !== '0') {
      versionArr[1] = parseInt(versionArr[1]) - 1
    } else if (versionArr[0] !== '0') {
      versionArr[0] = parseInt(versionArr[0]) - 1
    }
    targetVersion = versionArr.toString().replace(/,/g, '.')
  }
  return targetVersion
}

const parseVersion = ver => {
  const [version, channel, build] = ver.split('-')
  return {
    version,
    channel: channel ?? 'stable',
    build
  }
}
const parseBuildTime = (str) => {
  const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/
  //将时间格式化成 yyyy-MM-dd HH:mm:ss
  const formatDateStr = str.replace(pattern, '$1/$2/$3 $4:$5')
  //将时间转成Date
  const formatDate = new Date(formatDateStr)
  // 提前一天
  formatDate.setDate(formatDate.getDate() - 1)
  const expiredPattern = /(\d{4})-(\d{2})-(\d{2})/
  const expiredTime = formatDate.toISOString().slice(0, 10).replace(expiredPattern, '$1$2$3')
  return expiredTime
}
module.exports = {
  modifyVersion,
  getminversions,
  getUpdatableVersion
}