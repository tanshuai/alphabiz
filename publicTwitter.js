const Twitter = require('twitter')
const fs = require('fs')
require('dotenv').config()
const describe = fs.readFileSync('./github-describe/github-describe.txt', 'utf-8')
console.log(describe)
const publicTwitter = (describe) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  })
  client.post(
    'statuses/update',
    { status: describe },
    function (error, tweet, response) {
      if (error) {
        if (error && Array.isArray(error) && error[0].message && error[0].message.includes('duplicate.')) {
          console.log('error:', error[0].message)
          return
        } else {
          throw error
        }
      }
      console.log(tweet.text); // Tweet body.
      // console.log(response); // Raw response object.
    }
  )
}
// publicTwitter(describe)