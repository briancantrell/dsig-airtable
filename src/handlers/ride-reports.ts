import { ScheduledHandler } from "aws-lambda"
import { processReports } from "../airtable/ride-report"

const REQUIRED_ENV_VARS = ["AIRTABLE_BASE_ID", "AIRTABLE_API_KEY", "RIDE_REPORT_SNS_TOPIC"]

export const handle: ScheduledHandler = async (_event, _context) => {
  const missing = REQUIRED_ENV_VARS.filter(v => !process.env[v])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  try {
    await processReports()
  } catch (err) {
    console.error("processRideReports handler failed:", err)
    throw err
  }
}