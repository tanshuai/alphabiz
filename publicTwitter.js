const { TwitterApi } = require('twitter-api-v2')
const fs = require('fs')
require('dotenv').config()
let describe = fs.readFileSync('./github-describe/github-describe.txt', 'utf-8')
describe = describe.replace(/\r\n/gm, '\n')
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
  // const res = await twitterClient.v2.userTimeline('424858141')
  // const lastDesc = res._realData.data[0].text
  // const tweetList = res._realData.data

  // for (const tweetObj of tweetList) {
  //   const lastDesc = tweetObj.text
  //   // console.log(tweetObj)
  //   // console.log('------------------------')
  //   if (describe === lastDesc + '\n' || describe === lastDesc.replace(/\r/gm, '\n')) {
  //     console.log('duplicate content!')
  //     return false
  //   }
  // }
  await twitterClient.v2.tweet(describe).catch(err => {
    if (!err.data.detail.includes('Tweet with duplicate content')) throw err
  })
  console.log('Tweet successfully!')
  return true
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
    const result = await publicTwitter(d)
    if (!result) return
    await sleep(5000)
  }
})()




