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

## Deploying

There are two serverless framework "stages". dev and production.
`serverless deploy -s production`

## Logs

To view logs for a stage, 
`serverless logs -t -s dev -f processRideReports`

## TODO
1. ~All tests pass~
    - ~Reconfigure test data in test base~
2. ~Confirm ride report copies participants' report, not their name as the report description~
3. Refactor larger files, order methods by call stack
4. Add missing types
5. Email - is it worth it?
6. User manual
