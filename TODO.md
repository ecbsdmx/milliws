# TODO

## General
- [ ] The session state of the sidebar is only kept for the session and hot code reload BUT not for the user: Store state in DB user collection
- [ ] Table sorter: when sorting tables with expanded details row, it sorts wrongly all rows !

## Job module
- [x] Add missing fields in edit job view
- [ ] Check that the compression flag is used when SDW 3.12 is out
- [ ] Wizard: for metadata queries (later)
- [ ] Keyboard shortcuts (later)
- [ ] Add a delete all button with confirmation (along side the other create, start & recycle button)
- [ ] Is recycle button really well placed (other view and not general table action...) ?

## Events module
- [ ] Use the same principle of templates & repeaters for events display (as in jobs & jobs recycling)
- [ ] Restore "Executed on" time without moment.js relative expression (TZ: why restore now ?)
- [ ] Add an option to get more info about the job
- [ ] Align the column content appropriatly (numbers : right-aligned, etc.)
- [ ] Style the status code with a color gradient for better visual identification
- [ ] Use a gauge for the response times
- [ ] The filter is still displayed even when the filter and the data & equivalent rows are updated... :(

## Settings module
- [ ] Default events go back num days

## Design
- [ ] Add footer
- [ ] Theming (later)
- [ ] Review design of the overview page
- [ ] Review design of the CRUD views
- [ ] Jobs & jobs item : move global table buttons nearer to table

## Documentation
- [ ] Document the jobs

## Reports module
- [ ] Number of times a job has run
- [ ] Number of errors
- [ ] Average execution time
- [ ] Whether the last run was successful
