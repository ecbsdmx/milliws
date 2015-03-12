# TODO

## General
- [ ] Get rid of dead code
- [ ] App hardening
- [ ] Error handling and logging

## Job module
- [x] Check that the compression flag is used when SDW 3.12 is out
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
- [x] Expected response time and response time should be in the same column and displayed as a gauge. The problematic ones should stand out.
- [ ] An alternative 'calendar' view should be added (later).
- [ ] Job column: Link to the job panel in the job section (later).
- [ ] Store the content-length for data size comparison (compressed or not, delta, etc.) (later)
- [ ] Add filter (faded-out + hover) buttons in cells (later)
- [x] Bullet cell : add responseTime text to the bullet cell
- [x] Bullet cell : decide how to handle outliers
- [x] Bullet cell : take the full width
- [x] Bullet cell : change bar color when ert < responseTime
- [x] Bullet cell : style the measure bar for warning area
- [x] BUG: when a search is keyed in and we refresh the page, the results are filtered it seems but not displayed
- [x] Bullet cell : should the scale be uniform accross jobs ? (Create a button to toggle between uniform scale & default ?) (later)
- [x] Bullet cell : BUG : Status 404 & rt > ert not tagging line with red marker.
- [ ] Bullet cell : BUG? memory loss - to identify & fix !!!


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

### Collections
- [ ] Code review and tests for jobs
- [ ] Code review and tests for events
- [ ] Code review and tests for events statistics
