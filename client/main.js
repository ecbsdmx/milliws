
defaultJobPanelState = "details";


//FIXME find a way to have git/Github set the latest tag in this field..
UI.registerHelper('appVersion', function() {
  return "0.3.0";
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
formatEntrypoint = function(url) {
  var pos = url.indexOf("/data");
  if (-1 < pos) {
    return url.substring(0, pos);
  } else {
    return url;
  }
}
UI.registerHelper('formatEntrypoint', formatEntrypoint);
formatPathParams = function(url) {
  var pos = url.indexOf("/data");
  var end = url.indexOf("?");
  if (-1 < pos) {
    return -1 < end ? url.substring(pos, end) : url.substring(pos);
  } else {
    return "-";
  }
}
UI.registerHelper('formatPathParams', formatPathParams);

formatQueryStringParams = function(url) {
  var pos = url.indexOf("?");
  if (-1 < pos) {
    return url.substring(pos + 1);
  } else {
    return "-";
  }
}
UI.registerHelper('formatQueryStringParams', formatQueryStringParams);

formatFormQueryStringParams = function(url) {
  var pos = url.indexOf("?");
  if (-1 < pos) {
    return url.substring(pos + 1);
  } else {
    return "";
  }
}
UI.registerHelper('formatFormQueryStringParams', formatFormQueryStringParams);

updateCollapseMode = function(state, $panel) {
  if (typeof(state) == 'undefined') {
    state = defaultJobPanelState;
  }
  switch (state) {
    case "edit":
    case "details":
      $panel.removeClass("collapsed").addClass("details");
      break;
    case "" :
      $panel.removeClass("details").addClass("collapsed");
      break;
  }
}


/*
 * Debugging helpers
 * Author :   leroyse (integration & modification of orginal code found on stackoverflow)
 * Source :   stackoverflow.com/questions/15422456/detecting-which-reactive-query-was-triggered
 *
 */
/*
//===============================================
//-- debugging the collections interactions
//===============================================
var wrappedFind = Meteor.Collection.prototype.find;

Meteor.Collection.prototype.find = function () {
  var cursor = wrappedFind.apply(this, arguments);
  var collectionName = this._name;

  cursor.observeChanges({
    added: function (id, fields) {
      console.log(collectionName, 'added', id, fields);
    },

    changed: function (id, fields) {
      console.log(collectionName, 'changed', id, fields);
    },

    movedBefore: function (id, before) {
      console.log(collectionName, 'movedBefore', id, before);
    },

    removed: function (id) {
      console.log(collectionName, 'removed', id);
    }
  });

  return cursor;
};
*/
