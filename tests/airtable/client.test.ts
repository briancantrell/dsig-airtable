import { getPeople, getPeopleByName, getParticipantReports } from "../../src/airtable/client"


describe("peopleByName", () => {
  test("it returns data of the right shape", async () => {
    const participants = await getPeople("Participants")
    const participantsByName = getPeopleByName(participants)

    const firstUser = Object.values(participantsByName)[0]
    expect(firstUser).toMatchObject({
      id: expect.any(String),
      photo: expect.any(Object),
      name: expect.any(String)
    })
  })
})

const participantRideReportId = "recHc332Vb5oMJAtq"

describe("getParticipantsReports", () => {
  it("filters by the passed in ids", async () => {
    const reports = await getParticipantReports([participantRideReportId])
    expect(reports.length).toBe(1)
  })
})