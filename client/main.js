//FIXME find a way to have git/Github set the latest tag in this field..
UI.registerHelper('appVersion', function() {
  return "0.2.0";
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

UI.registerHelper('formatToEnglish', function(format) {
  switch(format) {
    case "sdmx-json-1.0.0":
      return "SDMX-JSON";
    case "sdmx-compact-2.1":
      return "SDMX-ML 2.1 Structure Specific Data";
    case "sdmx-generic-2.1":
      return "SDMX-ML 2.1 Generic Data";
  }
});


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