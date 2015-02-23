# TODO

## General
- [ ] The session state of the sidebar is only kept for the session and hot code reload BUT not for the user: Store state in DB user collection

## Job module
- [ ] Review job edit validation rules
- [ ] Add missing fields in edit job view
- [ ] Check that the compression flag is used when SDW 3.12 is out
- [ ] Wizard: for metadata queries (later)
- [ ] Keyboard shortcuts (later)

## Events module
- [ ] Use same table as for jobs
- [ ] Restore "Executed on" time without moment.js relative expression
- [ ] Add an option to get more info about the job
- [ ] Align the column content appropriatly (numbers : right-aligned, etc.)
- [ ] Style the status code with a color gradient for better visual identification
- [ ] (Tricky) Style the response time with a (fixed) color gradient from green-to-red with the ratio of responseTime:expectedResponseTime or use a gauge

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
