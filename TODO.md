# TODO

## User management module

## Job module
- [x] Basic CRUD operations
- [x] Basic design
- [x] Rename queries to jobs
- [x] Rename comments
- [x] Remove HTTP notifications related fields
- [x] Implement logical rather than physical deletion
- [ ] Review validation rules
- [ ] Add a contextual help functionality
- [ ] HTTP Conneg: Should support all SDMX 2.1 formats
- [ ] HTTP Conneg: Should offer the possibility to ask for compressed responses
- [ ] HTTP IMS: Should offer the possibility to perform an If-Modified-Since query
- [ ] Should offer a wizard to build the SDMX 2.1 RESTful query
- [ ] Should work with both http and https
- [x] There should be an option to "freeze" a job
- [x] The insert action should be performed in a modal window
- [x] Added default jobs (for testing only)
- [x] Edit and delete button in overview page don't work
- [x] Implement a GUI for the jobs recycle bin
- [ ] We could also use additional information such as the number of times a job has run, since when it is active, the number of problems, whether the last run was successful, etc. but that would mean joining with the events data
- [ ] Keyboard shortcuts
- [ ] Deleting a job should delete its events?
- [x] Jobs : sorting & filtering. ```Datatable?``` 
- [ ] Jobs item (in-place) edit with bootstrap toggle
- [x] Jobs item delete button
- [x] Replicate jobs design for the recycle page : use same template & replace buttons by different in-place templates (js template helper rendering)
- [ ] Re-activate buttons and toggle for detail on existing & recycled jobs
- [ ] Style jobs tables as the event one (with appropriate font)

## Scheduler module
- [x] Setup cron job
- [x] Jobs execution
- [x] Change user-agent

## Events module
- [x] Rename jobs to events

## Reports module

## Settings module

## Recycle bin module
- [ ] Add GUI to recover / physically delete

## Design
- [x] Core layout
- [ ] Add footer
- [x] Air a bit the content part of the interface
- [ ] Theming (later)
- [ ] Save sidebar carret state in user session
- [x] Jobs button bar: icons only + tooltip
- [x] Jobs master detail layout
- [ ] Review design of the overview page
- [ ] Review design of the CRUD views
- [x] Fix the chevron javascript toggle in jobs item.html + size ?
- [ ] Jobs & jobs item : move global table buttons nearer to table
- [x] Buttons & design for the recycle page
- [ ] Align events response time numbers to the right

## Documentation
- [x] Add basic info about the app
- [ ] Document the jobs
