# TODO

## General
- [ ] Get rid of dead code
- [ ] App hardening
- [ ] Error handling and logging

## Job module
- [ ] Wizard: for metadata queries (later)
- [ ] Keyboard shortcuts (later)
- [ ] Check that zlib works with Meteor bundled packages
- [ ] Jobs must have an owner
- [ ] Jobs can be shared
- [ ] Jobs display should be split (shared vs. own) or visually distinguishable

## Events module
- [ ] An alternative 'calendar' view should be added (later).
- [ ] Job column: Link to the job panel in the job section (later).
- [ ] Store the content-length for data size comparison (compressed or not, delta, etc.) (later)
- [ ] Bullet cell: BUG? memory loss - to identify & fix !!! (1/2 done)
- [ ] Implement repeater, limiting & paging of events
- [ ] Implement sorting & filtering (filter builder - puzzle tags - ...)

## Scheduler module
- [ ] Bug: Events are inserted even in case the connection was unsuccessful (offline)

## Settings module
- [ ] ```Default``` events go back num days

## User management module
- [ ] Implement authentication
- [ ] Implement authorisation: Sys-Admin, Power-Users, Users

## Design
- [ ] Theming (later)

## Documentation
- [ ] Document the jobs

## Reports module
- [ ] Number of times a job has run
- [ ] Number of errors
- [ ] Average execution time
- [ ] Whether the last run was successful

### Collections
- [x] Code review and tests for jobs
- [x] Code review and tests for events
- [ ] Code review and tests for events statistics
- [ ] Code review and tests for users
