import * as Airtable from 'airtable'

const getBase = () => {
  return new Airtable().base(process.env.AIRTABLE_BASE_ID)
}

interface rideReportData {
  fields: {
    Leader: Array<String>;
    Ride: Array<String>;
    Summary: string;
  }
}

export const createRideReport = async (rideReportData: rideReportData) => {
  const base = getBase()
  const rideReports = await base('Ride Reports').create([
    rideReportData
  ])
  return rideReports
}

export const unprocessedRideReportData = async () => {
  const base = getBase()
  let unprocessedReports = []
  await base('Ride Report Data').select({
      view: "Unprocessed"
  }).eachPage(function page(records, fetchNextPage) {
    unprocessedReports = [...unprocessedReports, ...records]
    fetchNextPage()
  })
  return unprocessedReports
}

interface processedRideReportRequest {
  id: string;
  fields: {
    "Processed at": string;
  }
}
export const markRideReportDataProcessed = (fields: Array<processedRideReportRequest>) => {
  const base = getBase()
  base('Ride Report Data').update(fields) 
}

interface participantReportData {
  fields: {
    Report: String;
    'Ride Report': Array<String>;
    Leader: Array<String>;
    Participant: Array<String>;
  }
}

export const createParticipantReport = async (participantReportData: Array<participantReportData>) => {
  const base = getBase()
  const participantReports = await base('Participant Reports').create(participantReportData)
  return participantReports
}

export const getParticipantIdByName = async () => {
  const base = getBase()
  let participantIds = {}
  await base('Participants').select({
    view: 'Grid view'
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
      participantIds[record.fields["Name"]] = record.id
    });
    fetchNextPage();
  })

  return participantIds
}