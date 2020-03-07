import { getPeople, peopleByName, PeopleByName, getParticipantReports } from "../../src/airtable/client"


describe("peopleByName", () => {
  test("it returns data of the right shape", async () => {
    const participants = await getPeople("Participants")
    const participantsByName = peopleByName(participants)

    expect(participantsByName).toMatchObject<PeopleByName>(
      {'Test User': {
        id: expect.any(String),
        photo: expect.any(Object),
        name: expect.any(String)
      }}
    )
  })
})

describe("getParticipantsReports", () => {
  it("filters by the passed in ids", async () => {
    const reports = await getParticipantReports(["rec3R7O7ONqmd2mSe"])
    expect(reports.length).toBe(1)
  })
})