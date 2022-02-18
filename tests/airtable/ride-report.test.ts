import { getRideReportById } from "../../src/airtable/ride-report"

describe("getRideReportById", () => {
  test("it returns data of the right shape", async () => {
    const testReportId = "recOiHxTTxFh8IHzl"
    const rideReport = await getRideReportById(testReportId)

    expect(rideReport.Ride).toBe("West Hudson Dirt")
    expect(rideReport.Leader.name).toBe("Brian Cantrell")
    expect(rideReport.Summary).toBe("This is a summary")
    expect(rideReport.Reports.length).toBe(3)
  })
})