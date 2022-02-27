import * as aws from "aws-sdk"

export const publishRideReportCreated = async (id) => {
  const params = {
    Message: "RideReportCreated",
    Subject: "wut",
    MessageAttributes: {
      rideReportId: {
        DataType: 'String',
        StringValue: id
      }
    },
    TopicArn: process.env.RIDE_REPORT_SNS_TOPIC
  }
  const data = await sendSNSMessage(params)
  console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
  console.log("MessageID is " + data.MessageId);
}

const sendSNSMessage = async (params) => {
  return new aws.SNS({apiVersion: '2010-03-31'}).publish(params).promise()
}