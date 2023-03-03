const AWS = require('aws-sdk')


AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
})

const ec2 = new AWS.EC2()

const instanceParams = {
    InstanceIds: ['i-086697780493ba746']
}
function startInstances () {
  return new Promise((resolve, reject) => {
    ec2.startInstances(instanceParams, (err, data) => {
      if (err) {
        console.log("Error starting instances:", err)
        reject(err)
      } else {
        console.log("Instance started successfully:", data)
        resolve(data)
      }
    })
  })
}

function stopInstances () {
  return new Promise((resolve, reject) => {
    ec2.stopInstances(instanceParams, (err, data) => {
      if (err) {
        console.log("Error stopping instances:", err)
        reject(err)
      } else {
        console.log("Instance stopped successfully:", data)
        resolve('successfully')
      }
    })
  })
}

async function start () {
  console.log(`\x1b[36m Start Instances... \x1b[0m`)
  await startInstances()
}

async function stop () {
  console.log(`\x1b[36m Stop Instances... \x1b[0m`)
  const result = await stopInstances()
  console.log('result', result)
}

if (process.argv.includes('--start')) {
  start()
} else if (process.argv.includes('--stop')) {
  stop()
}
