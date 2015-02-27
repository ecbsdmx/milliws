# TODO

## General
- [x] The session state of the sidebar is only kept for the session and hot code reload BUT not for the user: Store state in DB user collection
- [ ] Tooltip on job suspend action when clicked (preventdefault/propagation?) prevents the tooltip from being hidden again !
- [ ] Check jobs_{list,recycle}.js & jobs_{list,recycle}_item.js : lots of duplicate code to maintain...
- [ ] Fix bug when page refreshed and jobs are in collapsed state, the collapsed class on the panel is not set... (Fix: default panel-body state without padding & .details with ??)
- [ ] Bug: clicking on edit whilst in collapsed mode fails


## Job module
- [x] Fix performance issue (S)
- [ ] Check that the compression flag is used when SDW 3.12 is out
- [ ] Wizard: for metadata queries (later)
- [ ] Keyboard shortcuts (later)
- [x] Fix the creationDate in job pause action (S)
- [x] Add a collapse/show-details for all job items in jobs list & recycle bin views
- [ ] In edit mode replace standard action buttons by save/cancel
- [ ] bug? fix the jobs panel title max width to not interfere with ID field
- [ ] bug: re-activate save/cancel buttons and toggle dynTemp 
- [ ] bug: in edit mode, if cancel clicked, restore orig fields value

## Events module
- [x] Use the same principle of templates & repeaters for events display (as in jobs & jobs recycling)
- [x] Restore "Executed on" time without moment.js relative expression (TZ: why restore now ?)
- [ ] Add an option to get more info about the job
- [x] Align the column content appropriatly (numbers : right-aligned, etc.)
- [ ] Style the status code with a color gradient for better visual identification
- [ ] Use a gauge for the response times
- [ ] Bug: The filter is still displayed even when the filter and the data & equivalent rows are updated... :(
- [ ] Feature: store the content-length for data size comparison (compressed or not, delta, etc.) ???result.content.length compressed via http-more & other prop???

## Settings module
- [ ] Default events go back num days

## Design
- [x] Add colour scheme
- [x] Review bootstrap themes
- [x] Highlight selected item in navigation bar
- [x] Harmonise forms (S)
- [x] Review fonts used
- [x] Review action buttons (position, size, colour)
- [x] Action buttons should remain visible when scrolling
- [x] jobs_item_detail as a fact sheet (X)
- [x] Style confirm box
- [x] Handle page titles (needed?). Icon sufficient? (X)
- [x] tooltips on sidebar icons (especially when toggles closed)
- [x] Sidebar: Fix issue with navigation hover + align icon (S)
- [ ] Theming (later)

## Documentation
- [ ] Document the jobs

## Reports module
- [ ] Number of times a job has run
- [ ] Number of errors
- [ ] Average execution time
- [ ] Whether the last run was successful
