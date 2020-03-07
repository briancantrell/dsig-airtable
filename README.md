# Getting Started

This app expects two environment variables. AIRTABLE_BASE_ID and AIRTABLE_API_KEY, currently they're being set via serverless.yml with AWS Systems Manager.

## Design

Leaders submit ride reports to the denormalized Ride Report Data table. This app polls the "Unprocessed" view for any entries. When entries are returned from the Airtable api, the data is copied into normalized tables, and an SNS message is published.


