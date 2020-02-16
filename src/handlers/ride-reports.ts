import { ScheduledHandler } from "aws-lambda"
import { processReports } from "../airtable/ride-report"

export const handle: ScheduledHandler = async (_event, _context) => {
  await processReports()
}