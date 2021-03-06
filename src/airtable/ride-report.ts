import { 
  unprocessedRideReportData, 
  createRideReport, 
  createParticipantReport, 
  markRideReportDataProcessed, 
  getRideReport,
  getPeople,
  peopleById,
  peopleByName,
  getParticipantReports
} from "./client"

import { publishRideReportCreated } from "../sns/client"
// import { sendRideReportToSlack } from "../slack/client"


// interface ParticipantRideReport {
//   Participant: {
//     Name: string;
//     PhotoUrl: string;
//   };
//   Report: string;
// }

// interface RideReport {
//   Leader: string;
//   Ride: string;
//   Summary: string;
//   ParticipantReports: ParticipantRideReport[];
// }

const buildRideReportFields = (reportData) => {
  return {
    fields: {
      Leader: reportData.fields.Leader,
      Summary: reportData.fields.Summary,
      Ride: reportData.fields.Ride
    }
  }
}

const buildParticipantReportFields = (reportData, reportId, participantByName) => {
  return participantFields(reportData.fields).map((participantData) => {
    const participantId = participantByName[participantData[0]].id
    return {
      fields: {
        Report: String(participantData[1]),
        'Ride Report': [reportId],
        Leader: reportData.fields.Leader,
        Participant: [participantId]
      }
    }
  })
}

const participantFields = (data) => {
  return Object.entries(data).filter((kv) => {
    return !["Created at", "Leader", "Summary", "Ride", "Name"].includes(kv[0])
  })
}

const buildMarkRideReportDataProcessedFields = (processedReportDataIds) => {
  const now = new Date()
  return processedReportDataIds.map(id => {
    return {
      id,
      fields: {
        "Processed at": now.toISOString()
      }
    }
  })
}

export const processReports = async () => {
  const processedReportDataIds = []
  const newRideReportIds = []
  const unprocessedReportData = await unprocessedRideReportData() 
  const participants = await getPeople("Participants")
  const participantByName = peopleByName(participants)

  await Promise.all(
    unprocessedReportData.map(async (reportData) => {
      const rideReportFields = buildRideReportFields(reportData)
      const rideReport = await createRideReport(rideReportFields)
      newRideReportIds.push(rideReport[0].id)
      processedReportDataIds.push(reportData.id)
      const participantReportFields = buildParticipantReportFields(
        reportData, 
        rideReport[0].id, 
        participantByName
        )
      return await createParticipantReport(participantReportFields)
    })
  )

  if(processedReportDataIds.length > 0) {
    const markFields = buildMarkRideReportDataProcessedFields(processedReportDataIds)
    markRideReportDataProcessed(markFields)
  }

  newRideReportIds.forEach(id => {
    publishRideReportCreated(id)
  })
}

const formatParticipantReports = async (participantReports) => {
  const participants = await getPeople("Participants")
  const participantsById = peopleById(participants)
  return participantReports.map(report => ({
      Report: report.fields["Report"],
      Participant: participantsById[report.fields["Participant"][0]]
    }
  ))
}

export const getRideReportById = async (id: string)  => {
  const rideReport = await getRideReport(id)
  const leaders = await getPeople("Leaders")
  const rideLeader = peopleById(leaders)[rideReport.fields["Leader"][0]]
  const participantReports = await getParticipantReports(rideReport.fields["Participant Reports"])
  const formattedReports = await formatParticipantReports(participantReports)

  return {
    Leader: rideLeader,
    Ride: rideReport.fields["Ride Name"][0],
    Summary: rideReport.fields["Summary"],
    Reports: formattedReports,
    Id: rideReport.id
  }
}
