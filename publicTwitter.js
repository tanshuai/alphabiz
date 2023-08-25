const { TwitterApi } = require('twitter-api-v2')
const fs = require('fs')
require('dotenv').config()
const describe = fs.readFileSync('./github-describe/github-describe.txt', 'utf-8')

// describe length cannot exceed 280
const getDescribe = (describe) => {
  let desc = describe.replace(/(,\s|)skip e2e/gm, '').replace(/^\s*\n/gm, '')
  // delete duplicate lines
  desc = desc.split('\r')
    .filter((item, i, allItems) => {
      return i === allItems.indexOf(item)
    })
    .join("\n")
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
const desc = getDescribe(describe)
console.log(desc)
publicTwitter(desc)



