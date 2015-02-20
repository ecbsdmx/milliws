# TODO

## General
- [x] Save sidebar toggle state in user session
- [ ] The session state of the sidebar is only kept for the session and hot code reload BUT not for the user: Store state in DB user collection

## Job module
- [ ] Review job edit validation rules
- [ ] Add missing fields in edit job view
- [x] Wizard: Review validation rules
- [ ] Wizard: for metadata queries (later)
- [ ] Wizard: HTTP Conneg: Should support all SDMX 2.1 formats
- [x] Wizard: HTTP Conneg: Should offer the possibility to ask for compressed responses
- [x] Wizard: HTTP IMS: Should offer the possibility to perform an If-Modified-Since query
- [x] We could also use additional information such as the creation date, last run
- [ ] Keyboard shortcuts (later)
- [x] Add a contextual help functionality
- [x] Removed uniqueness constraints on jobs URL
- [ ] Wizard should have a vertical scrollbar, when needed
- [ ] Need to check that the compression flag is used when SDW 3.12 is out (later)

## Scheduler module
- [x] Enable HTTPS connection to target

## Events module
- [ ] Use same table as for jobs
- [ ] Restore "Executed on" time without moment.js relative expression
- [ ] Add an option to get more info about the job
- [ ] Align the column content appropriatly (numbers : right-aligned, etc.)
- [ ] Style the status code with a color gradient for better visual identification
- [ ] (Tricky) Style the response time with a (fixed) color gradient from green-to-red with the ratio of responseTime:expectedResponseTime or use a gauge

## Settings module
- [ ] Add enable/disable cron
- [ ] Add? cron granularity
- [ ] Default events go back num days

## Design
- [ ] Add footer
- [ ] Theming (later)
- [ ] Save sidebar carret state in user session
- [ ] Review design of the overview page
- [ ] Review design of the CRUD views
- [ ] Jobs & jobs item : move global table buttons nearer to table
- [ ] Align events response time numbers to the right

## Documentation
- [ ] Document the jobs

## User management module

## Reports module
- [ ] Number of times a job has run
- [ ] Number of errors
- [ ] Average execution time
- [ ] Whether the last run was successful

## Recycle bin module

# OLD Done TODOs

## General

## Job module
- [x] Basic CRUD operations
- [x] Basic design
- [x] Rename queries to jobs
- [x] Rename comments
- [x] Remove HTTP notifications related fields
- [x] Implement logical rather than physical deletion
- [x] There should be an option to "freeze" a job
- [x] The insert action should be performed in a modal window
- [x] Added default jobs (for testing only)
- [x] Edit and delete button in overview page don't work
- [x] Implement a GUI for the jobs recycle bin
- [x] Deleting a job should delete its events
- [x] Jobs : sorting & filtering. ```Datatable?```
- [x] Jobs item (in-place) edit with bootstrap toggle
- [x] Jobs item delete button
- [x] Replicate jobs design for the recycle page : use same template & replace buttons by different in-place templates (js template helper rendering)
- [x] Re-activate buttons and toggle for detail on existing & recycled jobs
- [x] Style jobs tables as the event one (with appropriate font)
- [x] Should offer a wizard to build the SDMX 2.1 RESTful query
- [x] Fix bug found when editing one job than another in the same run without page refresh (url/name already exist)

## Scheduler module
- [x] Setup cron job
- [x] Jobs execution
- [x] Change user-agent

## Events module
- [x] Rename jobs to events

## Settings module

## Design
- [x] Core layout
- [x] Air a bit the content part of the interface
- [x] Jobs button bar: icons only + tooltip
- [x] Jobs master detail layout
- [x] Fix the chevron javascript toggle in jobs item.html + size ?
- [x] Buttons & design for the recycle page

## Documentation
- [x] Add basic info about the app

## Recycle bin module
- [x] Add GUI to recover / physically delete
