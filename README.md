# Getting Started

This app expects the following environment variables. In the live environment, they're being set via serverless.yml with AWS Systems Manager > Parameter Store. In the development environment, they can be set with a .envrc file.

AIRTABLE_BASE_ID
AIRTABLE_API_KEY
SLACK_WEBHOOK_URL

## Design

Leaders submit ride reports to the denormalized Ride Report Data table. This app polls the "Unprocessed" view for any entries. When entries are returned from the Airtable api, the data is copied into normalized tables, and an SNS message is published.

## Testing

Run the tests with 
`yarn test`
tests will write to the Airtable base specified in AIRTABLE_BASE_ID, currently using the same test base for development and testing.

## Development

To run a function locally use 
`serverless invoke local -f processRideReports`

`serverless invoke local -f rosterPreview --data '{ "queryStringParameters": {"rideId":"P50WXIl6PUlonrSH"}}'`

## Deploying

There are two serverless framework "stages". dev and production.

current mac os needs this

`export NODE_OPTIONS=--openssl-legacy-provider && serverless deploy -s production`

not this

`serverless deploy -s production`

## Logs

To view logs for a stage, 
`serverless logs -t -s dev -f processRideReports`

## Process of starting a new year
1. Setup a new Airtable workspace and base and update the base id in AWS Systems Manager
1. Configure Airtable to allow access to the new base with the existing personal access token https://airtable.com/create/tokens
3. Setup a slack webhook for the new channel and update it in AWS Systems Manager
4. Make sure the job schedule is enabled in serverless.yml

## When the SIG ends
1. Disable the job schedule in serverless.yml


## TODO
1. ~All tests pass~
    - ~Reconfigure test data in test base~
2. ~Confirm ride report copies participants' report, not their name as the report description~
3. Refactor larger files, order methods by call stack
4. Add missing types
5. Email - is it worth it?
6. User manual
