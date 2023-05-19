// require('dotenv').config()
const simpleParser = require('mailparser').simpleParser
var MailListener = require('mail-listener2')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @function datestring
 * @description Get specified format date [mmm dd ,yyyy]
 * @return { string } datestring
 */
function datestring () {
  const d = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const datestring = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
  return datestring
}

/**
 * @function makeid
 * @description  Generate email - [random number]@email.domain
 * @param length
 * @return { string } email
 */
function makeid (length) {
  var result = ''
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function getCode(mail, options) {
  const { type, to, from, oauth } = options;
  const emailTo = mail.to;
  const emailFrom = mail.from;

  switch (oauth) {
    case 'github':
      if (to && emailTo.text && !emailTo.text.includes(to)) return null;
      const githubCodeReg = /(?<=Verification code: )\d{6}/gm;
      const githubCode = githubCodeReg.exec(mail.text);
      return githubCode ? githubCode[0] : null;

    case 'twitter':
      if (to && emailTo.text && !emailTo.text.includes(to)) return null;
      const twitterCodeReg = /(?<=Your Twitter confirmation code is )\w{8}/gm;
      const twitterCode = twitterCodeReg.exec(mail.subject);
      return twitterCode ? twitterCode[0] : null;

    default:
      if (to && emailTo.text === to || from && emailFrom.text && emailFrom.text.includes(from)) {
        const targetStr = type ? mail.html : mail.text;
        const codeReg = type ? /\d{6}(?=\sis\syour\sAlphabiz)/gm : /(?<=\bYou\sreceived\san\sinvitation\scode:\s)\w+\b/;
        const code = codeReg.exec(targetStr);
        return code ? code[0] : null;
      } else {
        return null;
      }
  }
}


// 获取email
// type: 1  =>  subject:email Verification        =>  mail.html
// type: 0  =>  subject:email Invitation          =>  mail.text
/**
 * @function mailListener
 * @description IMAP connect email get email text
 * @param { string } type 1:verification code 0: invitation code
 * @param { date } time Date()
 * @param { string } to email TO
 * @return { string } verification/invitation code
 */
async function mailListener (options) {
  const { type, time, to, from } = options
  return new Promise((resolve, reject) => {
    const mailListener = new MailListener({
      username: process.env.GOOGLE_EMAIL_USERNAME,
      password: process.env.GOOGLE_EMAIL_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      connTimeout: 10000, // Default by node-imap
      authTimeout: 10000, // Default by node-imap,
      debug: null, // Or your custom function with only one incoming argument. Default: null
      tlsOptions: { servername: 'imap.gmail.com' },
      mailbox: 'INBOX', // mailbox to monitor
      searchFilter: ['UNSEEN'], // the search filter being used after an IDLE notification has been retrieved
      markSeen: true
    })
    mailListener.start() // start listening
    // 连接60秒后，返回0，并关闭连接
    sleep(90000).then(res => {
      resolve(0)
      mailListener.stop()
    })
    // 连接开始时
    mailListener.on('server:connected', function () {
      mailListener.imap.search([['SINCE', datestring()]], function (err, list) {
        if (err) throw err
        if (list.length === 0) return
        var f = mailListener.imap.fetch(list, { bodies: '' })
        f.on('message', function (msg, seqno) {
          msg.on('body', function (stream, info) {
            simpleParser(stream).then(mail => {
              if (err) throw err
              // 点击获取邮件 时间之后 收到的邮件
              if (Date.parse(time) >= Date.parse(mail.date)) return
              const code = getCode(mail, options)
              if (code) { // if code != null
                resolve(code)
                mailListener.stop()
              }
            }).catch(err => {
              console.log(err)
            })
          })
        })
        // 抓取完一封邮件后触发
        f.on('error', function (err) {
          if (err) throw err
        })
      })
    })
    // 连接结束时
    mailListener.on('server:disconnected', function () {
      // console.log('imapDisconnected')
    })
    mailListener.on('error', function (err) {
      console.log(err)
      resolve(0)
    })
    // 新邮件到达时
    mailListener.on('mail', function (mail, seqno, attributes) {
      // 点击获取邮件 时间之后 收到的邮件
      if (Date.parse(time) >= Date.parse(mail.date)) return
      const code = getCode(mail, options)
      if (code) { // if code != null
        resolve(code)
        mailListener.stop()
      }
    })
  })
}

/**
 * @function getSMS
 * @description connect twilio get sms text
 * @param { string } type 1:verification code 0: invitation code
 * @param { date } time Date()
 * @return { string } verification/invitation code
 */
function getSMS (type, time) {
  return new Promise((resolve, reject) => {
    const client = require('twilio')(process.env.PHONE_NUMBER_ACCOUNT, process.env.PHONE_NUMBER_TOKEN)

    client.messages.list({ limit: 5 }).then(messages => messages.forEach(m => {
      if (!type || Date.parse(time) < Date.parse(m.dateSent)) {
        const str = m.body
        const codeReg = (type ? new RegExp('(?<=\\bYour\\sVerification\\sCode\\sis\\s)\\w+\\b')
          : new RegExp('(?<=\\bYou\\sreceived\\san\\sinvitation\\scode:\\s)\\w+\\b'))
        const code = codeReg.exec(str)
        if (code) { // if code != null
          resolve(code[0])
        }
      }
    })).then(m => {
      resolve(0)
    })
  })
}

/**
 * @function getMailCode
 * @description failed to get the email message and try again
 * @param { string } type 1:verification code 0: invitation code
 * @param { date } time Date()
 * @param { string } to email TO
 * @return { string } verification/invitation code
 */
async function getMailCode (options) {
  let res = await mailListener(options)
  // 如果未获取到邮件，等待5秒后，重新调用mailListener
  if (!res) {
    await sleep(5000)
    console.log('mailListener again')
    res = await mailListener(options)
  }
  if (!res) {
    await sleep(5000)
    console.log('mailListener again')
    res = await mailListener(options)
  }
  return res
}

/**
 * @function getSMSCode
 * @description failed to get the sms message and try again
 * @param { string } type 1:verification code 0: invitation code
 * @param { date } time Date()
 * @return { string } verification/invitation code
 */
async function getSMSCode ({ type, time }) {
  let res = await getSMS(type, time)
  // 如果未获取到短信，等待10秒后，重新调用getSMS
  if (!res) {
    await sleep(10000)
    console.log('getSMS again')
    res = await getSMS(type, time)
  }
  console.log('code:' + res)
  return res
}
module.exports = {
  mailListener,
  getSMS,
  getMailCode,
  getSMSCode,
  sleep,
  makeid
}
