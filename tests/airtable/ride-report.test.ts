import { getRideReportById } from "../../src/airtable/ride-report"

describe("getRideReportById", () => {
  test("it returns data of the right shape", async () => {
    const testReportId = "reccIXcstUoWm902P"
    const rideReport = await getRideReportById(testReportId)

    expect(typeof rideReport.Ride).toBe("string")
    expect(typeof rideReport.Leader.name).toBe("string")
    expect(typeof rideReport.Id).toBe("string")
    expect(Array.isArray(rideReport.Reports)).toBe(true)
  })
})