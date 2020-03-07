import { SNSHandler, SNSEvent } from "aws-lambda"
import { getRideReportById } from "../airtable/ride-report"
import { sendRideReportToSlack } from "../slack/client"

export const handle: SNSHandler = async (event: SNSEvent, _context) => {
  const rideReportIds = event.Records.map(record =>{
    return record.Sns.MessageAttributes.rideReportId.Value
  })

  await Promise.all(
    rideReportIds.map(async id => {
      const report = await getRideReportById(id)
      return await sendRideReportToSlack(report)
    })
  )
}