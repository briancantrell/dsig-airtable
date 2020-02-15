import { unprocessedRideReportData, createRideReport, getParticipantIdByName, createParticipantReport, markRideReportDataProcessed } from './client'

export const processReports = async () => {
  const processedReportDataIds = []
  const unprocessedReportData = await unprocessedRideReportData() 
  const participantIdByName = await getParticipantIdByName()

  await Promise.all(
    unprocessedReportData.map(async (reportData) => {
      const rideReportFields = buildRideReportFields(reportData)
      const rideReport = await createRideReport(rideReportFields)
      processedReportDataIds.push(reportData.id)
      const participantReportFields = buildParticipantReportFields(reportData, rideReport[0].id, participantIdByName)
      await createParticipantReport(participantReportFields)
    })
  )

  if(processedReportDataIds.length > 0) {
    const markFields = buildMarkRideReportDataProcessedFields(processedReportDataIds)
    markRideReportDataProcessed(markFields)
  }
}

const buildRideReportFields = (reportData) => {
  return {
    fields: {
      Leader: reportData.fields.Leader,
      Summary: reportData.fields.Summary,
      Ride: reportData.fields.Ride
    }
  }
}

const buildParticipantReportFields = (reportData, reportId, participantIdByName) => {
  return participantFields(reportData.fields).map((participantData) => {
    const participantId = participantIdByName[participantData[0]]
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
  return processedReportDataIds.map((id) => {
    return {
      id: id,
      fields: {
        "Processed at": now.toISOString()
      }
    }
  })
}