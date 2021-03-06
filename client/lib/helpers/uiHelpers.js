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
  return moment(ts).format("YYYY-MM-DD HH:mm");
});

UI.registerHelper('formatERT', function(ert) {
  if (ert >= 60000) {
    return ((ert / 60000).toPrecision(1)) + (ert >= 120000 ? " minutes" : " minute");
  } else if (ert >= 1000) {
    return (ert / 1000) + (ert >= 2000 ? " seconds" : " second");
  } else {
    return ert + " milliseconds";
  }
});

UI.registerHelper('formatFreq', function(ert) {
  return moment().add(ert, 'minutes').fromNow().replace('in a ', 'Every ').replace('in ', 'Every ');
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
UI.registerHelper('formatNumber', formatNumber);
UI.registerHelper('formatMs', formatMs);
UI.registerHelper('formatCount', formatCount);
UI.registerHelper('mapOperatorToSymbol', mapOperatorToSymbol );
