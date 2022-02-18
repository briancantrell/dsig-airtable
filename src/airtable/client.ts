import * as Airtable from 'airtable'

const NO_PHOTO = "https://i.pinimg.com/originals/41/c6/2c/41c62c9bf5899dd4f003c801296d3c07.jpg"

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

export const getRideReport = async (id: string) => {
  const base = getBase()
  const report = await base('Ride Reports').find(id)
  return report
}

export const createRideReport = async (rideReportData: rideReportData) => {
  const base = getBase()
  const rideReports = await base('Ride Reports').create([
    rideReportData
  ])
  return rideReports
}

export const getParticipantReports = async (ids: string[]) => {
  const base = getBase()
  const formula = `OR( ${ids.map(id => (`{Record Id} = '${id}'`)).join(",")} )`
  return await base("Participant Reports").select({
   filterByFormula: formula 
  }).all()
}

export const getUnprocessedRideReportData = async () => {
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

export interface PeopleByName{
  [key: string]: {
    id: string;
    name: string;
    photo: AirtableImage | undefined;
  }
};

export interface AirtableImage {
  filename: string;
  id: string;
  size: number;
  thumbnails: {
    full: { height: number; url: string; width: number },
    large: { height: number; url: string; width: number },
    small: { height: number; url: string; width: number },
  };
  type: string;
  url: string;
}

export const getPeopleByName = (people) => {
  let peopleByName = {}
  people.forEach(record => {
    peopleByName[record.fields["Name"]] = {
      id: record.id,
      name: record.fields["Name"],
      photo: (record.fields["Photo"] || [{thumbnails: {large: {url: NO_PHOTO}}}])[0] //must be better way to do this!
    }
  });
  return peopleByName
}

export const getPeopleById = (people) => {
  let peopleById = {}
  people.forEach(record => {
    peopleById[record.id] = {
      id: record.id,
      name: record.fields["Name"],
      photo: (record.fields["Photo"] || [{thumbnails: {large: {url: NO_PHOTO}}}])[0]
    }
  });
  return peopleById
}

export const getPeople = async (peopleType) => {
  const base = getBase()
  let people = []
  
  await base(peopleType).select({
    view: 'Grid view'
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
      people.push(record)
      fetchNextPage() 
    }
  )})

  return people
}