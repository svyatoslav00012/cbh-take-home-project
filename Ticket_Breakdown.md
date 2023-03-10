# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Ok, so the goal is to move from just using database ids for Agents in our reports to custom ids, which will be set by Facilities.

The general plan is like this:
1) Add field to Agent table with a default value equal to database id

   Make it unique?
   I guess facilities are isolated from each other and Agent id must only be unique inside one agent.
   In this case, we have multiple ways
    1) create a simple (not unique) field and check that it is unique throughout the Facility in code business logic
        * Pros: faster, simpler
        * Cons: not so elegant, may cause bugs in the future when used by another code/microservice
    2) create a composite key for Agent table, which will consist of columns `facilityId, customId`
        * Pros: db table behavior is self-descriptive now
        * Cons: more efforts (altering db, etc.)

   If I'm wrong and a single Agent id must be unique between all facilities - just create a unique database field
2) Add respected field to project frontend
3) Add respected API to alter this field
4) Cover new codebase with unit-tests
5) Deploy to test environment, let testers test new features
6) If everything is ok - deploy the feature to the prod

### Ticket1
Add the field `customId` to the `Agent` table.
#### Implementation details:
```
1) Default value equal to database id
2) Make it unique?
   I guess facilities are isolated from each other and Agent id must only be unique inside one agent. 
   In this case, we have multiple ways 
      1) create a simple (not unique) field and check that it is unique throughout the Facility in code business logic
          * Pros: faster, simpler
          * Cons: not so elegant, may cause bugs in the future when used by another code/microservice
      2) create a composite key for Agent table, which will consist of columns `facilityId, customId`
         * Pros: db table behavior is self-descriptive now
         * Cons: more efforts (altering db, etc.)
      
    If I'm wrong and a single Agent id must be unique between all facilities - just create a unique database field
```

#### Time estimate:
4-8 hours
#### Acceptance criteria:
DB is altered in the dev branch/your branch (depends on how the dev process is implemented from the ci-cd perspective).
`Agent` table has a new field `customId`, implemented as described in "Implementation details"

### Ticket2
Add API for altering new `customId`
#### Implementation details:
```
1) add this method, pass custom id in the body

200 - ok
401 - not authorized
403 - forbidden
404 - no facility/agent found
412 - customId not passed
417 - an agent with such customId already exists within Facility
PUT /api/v1/facility/{facilityId}/agent/{agentId}/customId
Content-Type: text/plain

2) add respected business logic to the service and db layer
3) cover new code with unit tests
```
#### BlockedBy:
Ticket1
#### Time estimate:
4 hours
#### Acceptance criteria:
A new API method can be called and tested for all specified responses.

### Ticket3
Validate and deploy new functionality of letting facilities set custom ids for agents
#### BlockedBy:
Ticket2
#### Time estimate:
4-8 hours
#### Acceptance criteria:
New functionality tested by manual testers as well as it's passed all automated testing, and now it's working on production
