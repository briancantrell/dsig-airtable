/*
input: ride id
1. filter roster list by ride
2. iterate through rosters and 
    1. fetch last 3 ride reports for each participant
    2. fetch status for each participant
    3. fetch previous sig experience for each participant
    4. send a DM? email? to each leader with the summary
3. Bonus pts: send resent mentee summaries to each mentor
*/

import { getPeople, getPeopleById, getRosterByRideName, getParticipantReports } from "../airtable/client"
import { APIGatewayProxyHandler } from "aws-lambda"

export const handle: APIGatewayProxyHandler = async (event, context) => {
    // console.log(event)
    // console.log(context)
    const rideName = event.queryStringParameters["rideName"]
    console.log(rideName)
    const roster = await getRosterByRideName(rideName)
    roster.eachPage((rosterPage, fetchNextPage) => {
        rosterPage.forEach( roster => {
            // console.log("Group: ", roster.fields["Group"])
            // console.log("Participants: ", roster.fields["Participants"])
            // console.log("Leaders: ", roster.fields["Leaders"])
            formatPreview(roster)
        })
        fetchNextPage()
    })
    console.log(roster)
    return { statusCode: 200, body: 'OK' }
}

const formatPreview = async roster => {
    const participants = await getPeople("Participants")
    const participantsById = getPeopleById(participants)
    // TODO: create a participant type that includes all participant info
    // rosterPreview is an array of participants
    // console.log(roster)
    let rosterPreview = roster.fields["Participants"].map( participantId => {
        const participant = participantsById[participantId]
        return participant
    })

    await Promise.all(rosterPreview.map( participant => {
        console.log("PARTICIPANT", participant)
        participant["RideReports"] = getParticipantReports(participant["reports"])
        // console.log(participant)
        return participant["RideReports"]
    }))
    console.log(participants)


}