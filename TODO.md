# TODO

## User management module

## Job module
- [ ] Review validation rules
- [ ] Add a contextual help functionality
- [ ] HTTP Conneg: Should support all SDMX 2.1 formats
- [ ] HTTP Conneg: Should offer the possibility to ask for compressed responses
- [ ] HTTP IMS: Should offer the possibility to perform an If-Modified-Since query
- [ ] Should offer a wizard to build the SDMX 2.1 RESTful query
- [ ] Should work with both http and https
- [ ] We could also use additional information such as the number of times a job has run, since when it is active, the number of problems, whether the last run was successful, etc. but that would mean joining with the events data
- [ ] Keyboard shortcuts
- [ ] Fix bug found when editing one job than another in the same run without page refresh (url/name already exist)

## Scheduler module

## Events module

## Reports module

## Settings module

## Recycle bin module

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



# OLD Done TODOs

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

## Scheduler module
- [x] Setup cron job
- [x] Jobs execution
- [x] Change user-agent

## Events module
- [x] Rename jobs to events

## Recycle bin module
- [x] Add GUI to recover / physically delete

## Design
- [x] Core layout
- [x] Air a bit the content part of the interface
- [x] Jobs button bar: icons only + tooltip
- [x] Jobs master detail layout
- [x] Fix the chevron javascript toggle in jobs item.html + size ?
- [x] Buttons & design for the recycle page

## Documentation
- [x] Add basic info about the app
