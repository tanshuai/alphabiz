const { TwitterApi } = require('twitter-api-v2')
const fs = require('fs')
require('dotenv').config()
const describe = fs.readFileSync('./github-describe/github-describe.txt', 'utf-8')
console.log(describe)
const publicTwitter = async (describe) => {
  const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })
  await twitterClient.v2.tweet(describe)
  console.log('Tweet successfully!')
}
// publicTwitter(describe)



