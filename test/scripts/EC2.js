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

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#allocateHosts-property
function allocateHosts (params) {
  return new Promise((resolve, reject) => {
    const params = {
      AvailabilityZone: 'us-east-1b', /* required */
      Quantity: 1, /* required */
      InstanceFamily: 'mac2',
      InstanceType: 'mac2.metal'
    }
    ec2.allocateHosts(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err)
      } else {
        console.log(data)           // successful response
        resolve(data)
      }
    })
  })
}

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyInstancePlacement-property
function modifyInstancePlacement (param) {
  return new Promise((resolve, reject) => {
    const params = {
      InstanceId: 'STRING_VALUE', /* required */
      GroupId: 'STRING_VALUE',
      GroupName: 'STRING_VALUE',
      HostId: 'STRING_VALUE',
      HostResourceGroupArn: 'STRING_VALUE',
      PartitionNumber: 'NUMBER_VALUE',
      Tenancy: dedicated | host
    }
    ec2.modifyInstancePlacement(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err)
      } else {
        console.log(data)           // successful response
        resolve(data)
      }
    })
  })
}

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeHosts-property
function describeHosts (params) {
  return new Promise((resolve, reject) => {
    ec2.describeHosts(params, function(err, data) {
      if (err) { // an error occurred
        console.log(err, err.stack)
        reject(err)
      } else {  // successful response
        console.log(data)
        resolve(data?.Hosts)
      }           
    })
  })
}

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#releaseHosts-property
function releaseHost (HostIds) {
  return new Promise((resolve, reject) => {
    const params = {
      HostIds: Array.isArray(HostIds) ? [...HostIds] : [HostIds]
    };
    ec2.releaseHosts(params, function(err, data) {
      if (err) { // an error occurred
        console.log(err, err.stack)
        reject(err)
      } else {  // successful response
        // console.log(data)
        resolve(data)
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

async function allocate () {

}

async function release () {
  // Describes all dedicated hosts
  console.log(`\x1b[36m Describe Hosts... \x1b[0m`)
  const HostsArr = await describeHosts({
    Filter: [
      {
        Name: 'instance-type',
        Values: [
          'mac2.metal',
        ]
      },{
        Name: 'state',
        Values: [
          'pending',
          'failed ',
          'available',
          'unavailable'
        ]
      }
    ]
  })
  console.log('HostsArr!', HostsArr)

  if (!Array.isArray(HostsArr) || !HostsArr.length) return
  const HostsIdArr = HostsArr.map((currentValue) => {
    return currentValue.HostId
  })
  console.log('HostsIdArr!', HostsIdArr)

  console.log(`\x1b[36m Release Host... \x1b[0m`)
  const releaseHostResult = await releaseHost(HostsIdArr)
  console.log('releaseHostResult!', releaseHostResult)
  if (releaseHostResult.Unsuccessful.length) throw error('Release Host Unsuccessful!')
}

if (process.argv.includes('--start')) {
  start()
} else if (process.argv.includes('--stop')) {
  stop()
} else if (process.argv.includes('--release')) {
  release()
}
