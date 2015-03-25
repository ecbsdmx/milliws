UI.registerHelper('appVersion', function() {
  return appVersion;
});

UI.registerHelper('trimToSize', function(msg, size) {
  var curLen = msg.length;
  if (size < curLen) {
    shortUrl = msg.substr(0, size);
    return shortUrl + "...";
  }
  return msg;
});

UI.registerHelper('booleanToEnglish', function(bool) {
  return bool?'yes':'no';
});

UI.registerHelper('formatRepresentation', function(format) {
  switch(format) {
    case "sdmx-json-1.0.0":
      return "SDMX-JSON";
    case "sdmx-compact-2.1":
      return "SDMX-ML 2.1 Structure Specific Data";
    case "sdmx-generic-2.1":
      return "SDMX-ML 2.1 Generic Data";
  }
});

UI.registerHelper('formatDate', function(ts) {
  return moment(ts).format();
});

UI.registerHelper('formatExecutionTime', function(ts) {
  return moment(ts).format("YYYY-MM-DD [@] HH:mm");
});


UI.registerHelper('formatERT', function(ert) {
  return 1 === ert ? "Every minute" : "Every " + ert + " minutes";
});

UI.registerHelper('formatDeltas', function(delta) {
  return delta ? "Updates and revisions" : "Full replacement";
});

UI.registerHelper('formatCompressed', function(compressed) {
  return compressed ? "Compressed" : "Uncompressed";
});

UI.registerHelper('formatIMS', function(ims) {
  return ims ? "If-Modified-Since request" : "Not an If-Modified-Since request";
});

UI.registerHelper('formatEntrypoint', formatEntrypoint);
UI.registerHelper('formatPathParams', formatPathParams);
UI.registerHelper('formatQueryStringParams', formatQueryStringParams);
UI.registerHelper('formatFormQueryStringParams', formatFormQueryStringParams);

UI.registerHelper('formatNumber', function(number) {
  return number ? number.toLocaleString() : 0;
});
