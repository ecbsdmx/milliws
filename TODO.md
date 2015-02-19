# TODO

## General
- [x] Save sidebar toggle state in user session
- [ ] The session state of the sidebar is only kept for the session and hot code reload BUT not for the user: Store state in DB user collection

## Job module
- [ ] Review job edit validation rules
- [x] Wizard: Review validation rules
- [ ] Wizard: for metadata queries (later)
- [ ] Wizard: HTTP Conneg: Should support all SDMX 2.1 formats
- [ ] Wizard: HTTP Conneg: Should offer the possibility to ask for compressed responses
- [ ] Wizard: HTTP IMS: Should offer the possibility to perform an If-Modified-Since query
- [ ] We could also use additional information such as the number of times a job has run, since when it is active, the number of problems, whether the last run was successful, etc. but that would mean joining with the events data
- [ ] Keyboard shortcuts
- [ ] Add a contextual help functionality

## Scheduler module
- [X] Enable HTTPS connection to target

## Events module
- [ ] Use same table as for jobs
- [ ] Restore "Executed on" time without moment.js relative expression
- [ ] Add current state of the job for the line dispayed
- [ ] Add a toggle to get more info on that particular line such as: parameters (url, ert, ...) at the time of execution (they can change over time and only the ones at the moment of execution are of concern)
- [ ] Align the column content appropriatly (numbers : right-aligned, etc.)
- [ ] (Maybe?) Style the status code with a color gradient for better visual identification
- [ ] (Tricky) Style the response time with a (fixed) color gradient from green-to-red with the ration of responseTime:expectedResponseTime or use a gauge ?

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

