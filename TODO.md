# TODO

## General
- [ ] Get rid of dead code

## Job module
- [ ] Check that the compression flag is used when SDW 3.12 is out
- [ ] Wizard: for metadata queries (later)
- [ ] Keyboard shortcuts (later)
- [x] Allow for behind firewall w/proxy access to remote service (use env var)

## Events module
- [x] Job column: When clicking on the job id, display information about the job.
- [x] Executed on column: Find the best format for displaying the timestamp.
- [x] HTTP status code column: When clicking on the status code, display the meaning of the code.
- [x] HTTP status code column: Should be in red if not 200, 304 or 404.
- [x] Table should take all available vertical space (currently, scrollbar added even when plenty of space is still available).
- [x] Find the best table component for meteor (reactive table, tabular, fuelux repeater, something else?)
- [x] DataTables information summary not aligned with filter box.
- [x] Issue with end of the table overlaping the footer
- [x] Arrows for sorting not in line with colour scheme.
- [x] There should be an option to only show the problematic entries.
- [ ] Expected response time and response time should be in the same column and displayed as a gauge. The problematic ones should stand out.
- [ ] An alternative 'calendar' view should be added (later).
- [ ] Job column: Link to the job panel in the job section (later).
- [ ] Store the content-length for data size comparison (compressed or not, delta, etc.) (later)
- [ ] Add filter (faded-out + hover) buttons in cells (later)


## Settings module
- [ ] Default events go back num days

## Design
- [ ] Theming (later)

## Documentation
- [ ] Document the jobs

## Reports module
- [ ] Number of times a job has run
- [ ] Number of errors
- [ ] Average execution time
- [ ] Whether the last run was successful
