import { getPeople, getPeopleByName, PeopleByName, getParticipantReports } from "../../src/airtable/client"


describe("peopleByName", () => {
  test("it returns data of the right shape", async () => {
    const participants = await getPeople("Participants")
    const participantsByName = getPeopleByName(participants)

    expect(participantsByName).toMatchObject<PeopleByName>(
      {'Test User': {
        id: expect.any(String),
        photo: expect.any(Object),
        name: expect.any(String)
      }}
    )
  })
})

const participantRideReportId = "recMACISZNhj0fdsR"

describe("getParticipantsReports", () => {
  it("filters by the passed in ids", async () => {
    const reports = await getParticipantReports([participantRideReportId])
    expect(reports.length).toBe(1)
  })
})