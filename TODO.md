# TODO

## General
- [ ] Get rid of dead code
- [ ] App hardening
- [ ] Error handling and logging
- [ ] Correct reports template & less files for line-ending (^M char)
- [ ] Store user conf. (user profile)

## Job module
- [ ] It could be nice to share / follow jobs rather than being automatically subscribed to all existing ones (later).
- [ ] Wizard: for metadata queries (later)
- [ ] Keyboard shortcuts (later)
- [ ] Store user conf. : details toggle status

## Recycle module
- [ ] avoid displaying the recycle module tab in sidebar when there are no jobs deleted

## Events module
- [ ] An alternative 'calendar' view should be added (later).
- [ ] Job column: Link to the job panel in the job section (later).
- [x] Bug: filter for smaller than 1200 RT, toggle problematic on/off, if some present, they only appear when toggle on !
- [ ] Table should be customizable (columns to display, number of rows)
- [ ] Store user conf. : columns displayed
- [ ] Store user conf. : sort order
- [ ] Store user conf. : number of rows defined (ATT: max capped !!!) 
- [ ] Filters: Implement filtering (filter builder - puzzle tags - ...)
- [ ] Filters: Reset ALL filters 
- [ ] Filters: in filter tag, display column name instead of column variable
- [ ] Filters: code the filter remove click action
- [x] Filters: clicking on th etag but not the 'x' would open filters and focus on the filter input !!!
- [ ] Bug: Average is recalculated but only 'old' rows in the events list do not get updated with it
- [x] Bug: Filtering on responsetime resulting in count rows < 10, next/last still active


## Scheduler module

## User management module

## Design
- [ ] Theming (later)
- [ ] Check if animations can be used (e.g. new events, page transitions)

## Documentation
- [ ] Document the jobs

## Reports module
- [ ] Number of times a job has run
- [ ] Number of errors
- [ ] Average execution time
- [ ] Whether the last run was successful
- [ ] Moving average of the job etime : showing etime evolution?
- [ ] Timeline view per job showing where in time the errors/warnings occured

### Collections
- [ ] Code review and tests for events statistics
