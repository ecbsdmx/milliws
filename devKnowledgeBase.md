# Development tips & tricks
## Debugging
#### For *nix

```shell
export NODE_OPTIONS --debug
export DEBUG loki:*
meteor
```

#### For windows:

```shell
set NODE_OPTIONS=--debug
set DEBUG=loki:*
meteor
```

## MongoDB
### Remove some fields

```
db.eventStats.update({}, {$unset: {whiskerStop: 1, quartile1:1, quartile2:1, quartile3:1}}, false, true)
```

### Create some indexes on collections

```
db.events.ensureIndex({ "jobId" : 1 },{ "name" : "JobNameIdx" });
db.events.ensureIndex({ "etime" : -1 },{ "name" : "eTimeIdx" });
```
