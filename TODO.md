# TODO

## General
- [ ] Save sidebar toggle state in user session

## Job module
- [ ] Review job edit validation rules
- [ ] Wizard: Review validation rules
- [ ] Wizard: for metedata queries (later)
- [ ] Wizard: HTTP Conneg: Should support all SDMX 2.1 formats
- [ ] Wizard: HTTP Conneg: Should offer the possibility to ask for compressed responses
- [ ] Wizard: HTTP IMS: Should offer the possibility to perform an If-Modified-Since query
- [ ] We could also use additional information such as the number of times a job has run, since when it is active, the number of problems, whether the last run was successful, etc. but that would mean joining with the events data
- [x] Fix bug found when editing one job than another in the same run without page refresh (url/name already exist)
- [ ] Keyboard shortcuts
- [ ] Add a contextual help functionality

## Scheduler module
- [ ] EnableHTTPS connection to target

## Events module
- [ ] Use same table as for jobs

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

