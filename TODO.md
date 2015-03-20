# TODO

## General
- [ ] Get rid of dead code
- [ ] App hardening
- [ ] Error handling and logging

## Job module
- [x] Check that zlib works with Meteor bundled packages
- [x] Jobs must have an owner
- [x] Avoid displaying the toggle job details when no jobs present
- [x] Bug: editing than cancelling edit does not toggle state back
- [x] Users having no role to change a job state should still be able to see if it is running or not !
- [x] Bug: when aggregation function did not produce entries yet, it logs a run count error in console
- [ ] It could be nice to share / follow jobs rather than being automatically subscribed to all existing ones (later).
- [ ] Wizard: for metadata queries (later)
- [ ] Keyboard shortcuts (later)
- [ ] Bug: inline job edit does not set initial SDMX format on field

## Recycle module
- [ ] avoid displaying the recycle module tab in sidebar when there are no jobs deleted

## Events module
- [ ] An alternative 'calendar' view should be added (later).
- [ ] Job column: Link to the job panel in the job section (later).
- [x] Bullet cell: BUG? memory loss - to identify & fix !!! (1/2 done)
- [x] Implement repeater, limiting & paging of events
- [x] Bug?: when new events are added by scheduler,displayed list is not limited to 10 elems but keeps filling up. entries x of y is also wrong.
- [x] Implement sorting
- [x] Restore the status column
- [x] Bug: when no events present, the skip in the collection publish fails !
- [x] Bug: when only one set of events have run, the aggregation did not produce content and events collection fails with avg enrichment.
- [x] IsProblematic row marker
- [x] Job colum naming: Job
- [x] Series & obs columns without "n°"
- [ ] Implement filtering (filter builder - puzzle tags - ...)
- [x] IsProblematic toggle 'filter'
- [x] Store the content-length for data size comparison (compressed or not, delta, etc.)
- [ ] Sorting should always use etime (e.g.: jobId + etime)

## Scheduler module
- [x] Bug: Events are inserted even in case the connection was unsuccessful (offline)

## Settings module
- [ ] ```Default``` events go back num days

## User management module
- [x] Implement authentication
- [x] Implement authorisation: Sysadmins, Users

## Design
- [ ] Theming (later)

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
- [x] Code review and tests for jobs
- [x] Code review and tests for events
- [ ] Code review and tests for events statistics
- [x] Code review and tests for users
