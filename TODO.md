# TODO

## General
- [ ] Add error handling and logging

## Job module
- [ ] Share/follow jobs rather than default subscription to all (later)
- [ ] Add support for metadata queries in the wizard (later)
- [ ] Add support for keyboard shortcuts (later)
- [ ] Store details toggle status should in user profile (later)
- [x] Reset wizard once a job has been created

## Events module
- [ ] Link the job id to a job detail panel (later)
- [ ] Store columns to display, # of rows, sort order in user profile (later)
- [ ] Bug: 'Old' rows do not get the updated average
- [x] Correct typo in status code description

## Design
- [ ] Add support for themes (later)
- [ ] Use animations (e.g. new events, page transitions) (later)

## Documentation
- [ ] Document the jobs module
- [ ] Document the events module
- [ ] Document the statistics module
- [ ] Document the user management
- [ ] Document the reports module

## Reports module
- [x] Display the number of times a job has run
- [x] Display the number of errors
- [x] Display the average execution time
- [x] Display whether the last run of a job was successful
- [ ] Display a time series view of jobs execution times
- [x] Display a timeline view of errors per job
- [ ] Bug: "P1M" calculations does not depend on data available
- [ ] Bug: "Today" calculations does not depend on data available
- [x] Bug: Today's total RT differs from calendar tooltip value
- [x] Bug: RT calendar tooltip displays sec not ms
- [ ] Bug: cal tip: doesn't hide if hover too quick after indicator type change
- [ ] Bug: cal tip: strange 2-step color change when switching indicator type
- [ ] Pagination for heatmap (later)
- [ ] Review the colours and the boundaries for the heatmap
- [x] Fix various minor issues with heatmap tooltips
- [ ] Check the aggregated statistics for correctness
