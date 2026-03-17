import { SNSHandler, SNSEvent } from "aws-lambda"
import { getRideReportById } from "../airtable/ride-report"
import { sendRideReportToSlack } from "../slack/client"

const REQUIRED_ENV_VARS = ["AIRTABLE_BASE_ID", "AIRTABLE_API_KEY", "SLACK_WEBHOOK_URL"]

export const handle: SNSHandler = async (event: SNSEvent, _context) => {
  const missing = REQUIRED_ENV_VARS.filter(v => !process.env[v])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  const rideReportIds = event.Records.map(record => {
    const id = record.Sns.MessageAttributes?.rideReportId?.Value
    if (!id) {
      throw new Error(`SNS record missing rideReportId attribute: ${JSON.stringify(record.Sns.MessageAttributes)}`)
    }
    return id
  })

  try {
    await Promise.all(
      rideReportIds.map(async id => {
        const report = await getRideReportById(id)
        return sendRideReportToSlack(report)
      })
    )
  } catch (err) {
    console.error("postRideReportToSlack handler failed:", err)
    throw err
  }
}