import { sendRideReportToSlack } from "../../src/slack/client"

describe("sendRideReportToSlack", () => {
  it("send the message to slack", async () => {
    const rideReport = {
      Leader: { 
        name: "Brian Cantrell",
        photo: { thumbnails: { large: { url: "https://ca.slack-edge.com/TTGD8JYTZ-UTE3YBH8U-f4b4ceb617ee-48" }}}
      },
      Ride: 'West Hudson Dirt',
      Summary: 'This is a summary',
      Reports: [ { 
        Report: "test user's ride report", 
        Participant: {
          name: "Test participant",
          photo: { thumbnails: { large: { url: "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg"}}}
        } } ]
    }

    const response = await sendRideReportToSlack(rideReport)
    console.log(response)
  })
})