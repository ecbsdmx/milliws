# TODO

## User management module

## Job module
- [x] Basic CRUD operations
- [x] Basic design
- [x] Rename queries to jobs
- [x] Rename comments
- [x] Remove HTTP notifications related fields
- [ ] Implement logical rather than physical deletion
- [ ] Review validation rules
- [ ] Add a contextual help functionality
- [ ] Review design of the overview page
- [ ] Review design of the CRUD views
- [ ] HTTP Conneg: Format is currently limited to SDMX-JSON. Should support all SDMX 2.1 formats
- [ ] HTTP Conneg: Should offer the possibility to ask for compressed responses
- [ ] HTTP IMS: Should offer the possibility to perform an If-Modified-Since query
- [ ] Should offer a wizard to build the SDMX 2.1 RESTful query
- [ ] Should work with both http and https
- [ ] There should be an option to "freeze" a job or all jobs at once
- [ ] Should the insert / update actions be performed in a modal window? ```Tz: yes ! ```

## Scheduler module
- [x] Setup cron job
- [x] Jobs execution
- [x] Change user-agent

## Events module
- [x] Rename jobs to events

## Reports module

## Settings module

## Recycle bin module

## Design
- [ ] Core layout
```
+-----------------------------------------------------------------------------------+
|Logo                                                             Bell        Admin |
+-----------------+-----------------------------------------------------------------+
|  ** EVENTS  **  |                                                                 |
+-----------------+                    +----------+----------+                      |
|     Reports     |                    | Liste    | Calendar |                      |
+-----------------+                    +----------+----------+                      |
|     Jobs        |                                                                 |
+-----------------+                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
|                 |                                                                 |
+-----------------+-----------------------------------------------------------------+

```


## Documentation
- [ ] Add basic info about the app
- [ ] Document the jobs
