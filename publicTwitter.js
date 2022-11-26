const { TwitterApi } = require('twitter-api-v2')
const fs = require('fs')
require('dotenv').config()
let describe = fs.readFileSync('./github-describe/github-describe.txt', 'utf-8')
describe = describe.replace(/\r\n/gm, '\r')
// describe length cannot exceed 280
const getDescribe = (describe) => {
  let desc = describe.replace(/(,\s|)skip e2e/gm, '').replace(/^\s*\n/gm, '')
  desc = desc.substring(0, 280)
  desc = desc.replace(/\r?\n?[^\r\n]*$/, "").replace(/\.(?=\w+)/gm, ' ')
  return desc
}

const publicTwitter = async (describe) => {
  const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })
  await twitterClient.v2.tweet(describe).catch(err => {
    if (!err.data.detail.includes('Tweet with duplicate content')) throw err
  })
  console.log('Tweet successfully!')
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

(async () => {
  const descArr = []
  let remainDesc = describe
  while (1) {
    if (remainDesc.length < 280) {
      descArr.push(remainDesc)
      break
    }
    const desc = getDescribe(remainDesc)
    descArr.push(desc)
    remainDesc = remainDesc.slice(desc.length + 1, remainDesc.length)
  }
  console.log(descArr)
  for (const d of descArr) {
    await publicTwitter(d)
    await sleep(5000)
  }
})()




