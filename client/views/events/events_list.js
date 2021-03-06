Template.eventsList.onCreated(function(){
  // maybe here for the events count
  var filterOptions = Session.get("eventsFilter") || {};
  Meteor.call("countFilteredEvents", filterOptions, function(err, resp){
    Session.set("CurrentEventsCount", resp);
  });
});

Template.eventsList.rendered = function() {
  $('#problematicToggle').bootstrapToggle();
}  

Template.eventsList.helpers({
  totalEventCount: function() {
    return Session.get("CurrentEventsCount") || 0;
  },
  eventsStart: function() {
    var from = Session.get("EventsFromCount") || 1;
    return from;
  },
  eventsEnd: function() {
    var from = Session.get("EventsFromCount") || 0;
    return from + defaultEventRowCount;
  },
  isLastPage: function() {
    var from = Session.get("EventsFromCount") || 0;
    var max = Session.get("CurrentEventsCount") || 0;
    return ((max < defaultEventRowCount) || (from === (max - defaultEventRowCount)))?{class: "disabled"}:{};
  },

  isFirstPage: function() {
    var from = Session.get("EventsFromCount") || 0;
    return from === 0?{class: "disabled"}:{};
  },
  paginationElems: function() {
    var numEvt = Session.get("CurrentEventsCount") || 0;
    var elems = [];
    var index = 0;
    for (var i=0;i<numEvt;i+=defaultEventRowCount) {
      elems[index] = {offset: i, page: index + 1};
      index++;
    }
    return elems;
  },
  isSorted: function(sortFieldName) {
    var sortingClass="sorting_poss";
    var sorting = Session.get("eventsSorting");
    if ((typeof sorting != 'undefined') && (sortFieldName === sorting.by)) {
      sortingClass = sorting.order === -1?"sorting_desc":"sorting_asc";
    }
    return sortingClass;
  },
  showProblematicOnly: function() {
    var filters = Session.get("eventsFilter");
    if (typeof filters == 'undefined'){
      filters = {isProblematic: false};
    } else if (filters.isProblematic == 'undefined') {
      filters.isProblematic = false;
    }
    return filters.isProblematic ? {checked:"checked"} : "";
  },
  jobIdFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var query = {};
    query.field = "jobId";
    query.label = "Job";
    query.default = filters.hasOwnProperty(query.field) ? mapOperatorToSymbol(filters[query.field].op) : "&isin;";
    query.filters = [
      {symbol: "&isin;", desc: "In"},
      {symbol: "&#x2209;", desc: "Not in"}
    ];
    query.help = "<p>An <strong>identifier</strong> for the jobs (e.g.: <code>dexr-comp</code>).</p><p>The identifier can be <strong>partial</strong>, to match any job whose id contains the supplied string (e.g.: <code>dexr</code> to match <code>dexr-json</code> and <code>dexr-gen</code>).</p><p><strong>Multiple</strong> identifiers can be supplied, using a whitespace as separator (e.g.: <code>dexr-json dexr-gen</code>).</p><p>Use <code>&isin;</code> to <strong>include</strong> the matching jobs in the results.</p><p>Use <code>&#x2209;</code> to <strong>exclude</strong> the matching jobs from the results.</p>";
    query.fieldValue = filters.hasOwnProperty(query.field) ? filters[query.field].val : "";
    return query;
  },
  statusFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var query = {};
    query.field = "status";
    query.label = "Status";
    query.default = filters.hasOwnProperty(query.field) ? mapOperatorToSymbol(filters[query.field].op) : "&isin;";
    query.filters = [
      {symbol: "&isin;", desc: "In"},
      {symbol: "&#x2209;", desc: "Not in"}
    ];
    query.help = "<p>The response <strong>HTTP status code</strong> (e.g.: <code>200</code>).</p><p><strong>Multiple</strong> codes can be supplied, using a whitespace as separator (e.g.: <code>200 302</code>).</p><p>Use <code>&isin;</code> to <strong>include</strong> the events with the matching status codes in the results.</p><p>Use <code>&#x2209;</code> to <strong>exclude</strong> the events with the matching status codes from the results.</p>";
    query.fieldValue = filters.hasOwnProperty(query.field) ? filters[query.field].val : "";
    return query;
  },
  sizeFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var query = {};
    query.field = "size";
    query.label = "Size";
    query.default = filters.hasOwnProperty(query.field) ? mapOperatorToSymbol(filters[query.field].op) : "&ge;";
    query.filters = [
      {symbol: "&ge;", desc: "Greater than or equal"},
      {symbol: "&le;", desc: "Less than or equal"},
      {symbol: "[,]", desc: "Between"}
    ];
    query.help = "<p>The <strong>size</strong> of the response message, in <strong>bytes</strong>.</p><p>Use <code>&ge;</code> to <strong>include</strong> all the events whose size was larger than or equal to the supplied number and <code>&le;</code> to <strong>include</strong> all the events whose size was smaller than or equal to the supplied number.</p><p>Use <code>[,]</code> and supply 2 sizes separated by a whitespace to include all events whose size was between the supplied numbers.</p>";
    query.fieldValue = filters.hasOwnProperty(query.field) ? filters[query.field].val : "";
    return query;
  },
  obsFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var query = {};
    query.field = "observations";
    query.label = "Obs.";
    query.default = filters.hasOwnProperty(query.field) ? mapOperatorToSymbol(filters[query.field].op) : "&ge;";
    query.filters = [
      {symbol: "&ge;", desc: "Greater than or equal"},
      {symbol: "&le;", desc: "Less than or equal"},
      {symbol: "[,]", desc: "Between"}
    ];
    query.help = "<p>The <strong>number of observations</strong> included in the response message.</p><p>Use <code>&ge;</code> to <strong>include</strong> all the events whose number of observations was larger than or equal to the supplied number and <code>&le;</code> to <strong>include</strong> all the events whose number of observations was smaller than or equal to the supplied number.</p><p>Use <code>[,]</code> and supply 2 numbers separated by a whitespace to include all events whose number of observations was between the supplied numbers.</p>";
    query.fieldValue = filters.hasOwnProperty(query.field) ? filters[query.field].val : "";
    return query;
  },
  seriesFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var query = {};
    query.field = "series";
    query.label = "Series";
    query.default = filters.hasOwnProperty(query.field) ? mapOperatorToSymbol(filters[query.field].op) : "&ge;";
    query.filters = [
      {symbol: "&ge;", desc: "Greater than or equal"},
      {symbol: "&le;", desc: "Less than or equal"},
      {symbol: "[,]", desc: "Between"}
    ];
    query.help = "<p>The <strong>number of series</strong> included in the response message.</p><p>Use <code>&ge;</code> to <strong>include</strong> all the events whose number of series was larger than or equal to the supplied number and <code>&le;</code> to <strong>include</strong> all the events whose number of series was smaller than or equal to the supplied number.</p><p>Use <code>[,]</code> and supply 2 numbers separated by a whitespace to include all events whose number of series was between the supplied numbers.</p>";
    query.fieldValue = filters.hasOwnProperty(query.field) ? filters[query.field].val : "";
    return query;
  },
  rtFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var query = {};
    query.field = "responseTime";
    query.label = "Response time";
    query.default = filters.hasOwnProperty(query.field) ? mapOperatorToSymbol(filters[query.field].op) : "&ge;";
    query.filters = [
      {symbol: "&ge;", desc: "Greater than or equal"},
      {symbol: "&le;", desc: "Less than or equal"},
      {symbol: "[,]", desc: "Between"}
    ];
    query.help = "<p>The <strong>time it took</strong> to receive the response, in <strong>milliseconds</strong>.</p><p>Use <code>&ge;</code> to <strong>include</strong> all the events that took longer to complete than to the supplied number and <code>&le;</code> to <strong>include</strong> all the events that finished faster than the supplied number.</p><p>Use <code>[,]</code> and supply 2 numbers separated by a whitespace to include all events that finished within the supplied times.</p>";
    query.fieldValue = filters.hasOwnProperty(query.field) ? filters[query.field].val : "";
    return query;
  },
  etimeFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var query = {};
    query.field = "etime";
    query.label = "Executed";
    query.default = filters.hasOwnProperty(query.field) ? mapOperatorToSymbol(filters[query.field].op) : "&ge;";
    query.filters = [
      {symbol: "&ge;", desc: "Greater than or equal"},
      {symbol: "&le;", desc: "Less than or equal"},
      {symbol: "[,]", desc: "Between"}
    ];
    query.help = "<p>The <strong>time</strong> when the query was executed, in the <strong>ISO8601</strong> format (e.g.: <code>2015-03-24T09:02:00+01:00</code>).</p><p><strong>Partial dates</strong> can be supplied (e.g.: <code>2015</code>, <code>2015-01</code>, <code>2015-01-01</code>, etc.)</p><p>Use <code>&ge;</code> to <strong>include</strong> all the events that were executed at or after the supplied time and <code>&le;</code> to <strong>include</strong> all the events that were executed at or before the supplied time.</p><p>Use <code>[,]</code> and supply 2 timestamps separated by a whitespace to include all events that were executed between the 2 supplied times (e.g.: <code>2015-03-24T09:02:00+01:00 2015-03-24T11:02:00+01:00</code>).</p>";
    query.fieldValue = filters.hasOwnProperty(query.field) ? filters[query.field].val : "";
    return query;
  }
});

Template.eventsList.events({
  //-- sorting
  'click .sortByJobId': function(e) {
    e.preventDefault();
    triggerSort("jobId");
  },
  'click .sortByETime': function(e) {
    e.preventDefault();
    triggerSort("etime");
  },
  'click .sortByStatus': function(e) {
    e.preventDefault();
    triggerSort("status");
  },
  'click .sortByResponseTime': function(e) {
    e.preventDefault();
    triggerSort("responseTime");
  },
  'click .sortBySeries': function(e) {
    e.preventDefault();
    triggerSort("series");
  },
  'click .sortByObservations': function(e) {
    e.preventDefault();
    triggerSort("observations");
  },
  'click .sortBySize': function(e) {
    e.preventDefault();
    triggerSort("size");
  },
  //-- paging
  'click .firstEvents': function (e) {
    e.preventDefault();
    Session.set("EventsFromCount", 0);
  },
  'click .previousEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount") || 0;
    Session.set("EventsFromCount", (from >= defaultEventRowCount)?(from-defaultEventRowCount):0);
  },
  'click .nextEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount") || 0;
    var max = Session.get("CurrentEventsCount") || 0;
    Session.set("EventsFromCount", (from + defaultEventRowCount <= max-defaultEventRowCount)?(from+defaultEventRowCount):(max-defaultEventRowCount));
  },
  'click .lastEvents': function (e) {
    e.preventDefault();
    var numEvt = Session.get("CurrentEventsCount") || 0;
    Session.set("EventsFromCount", numEvt - defaultEventRowCount);
  },
  //-- filters
  'click #filterBtn': function (e) {
    $("#filtersRow").toggleClass('hide');
    $("#runFiltersBtn").toggleClass('hide');
  },
  'change #problematicToggle': function(e) {
    e.preventDefault();
    applyFilters();
  },
  'click #runFiltersBtn':function(e) {
    e.preventDefault();
    applyFilters();
  },
  'submit form': function(e) {
    e.preventDefault();
    applyFilters();
  }
});

var triggerSort = function(sortField) {
  var sorting = Session.get("eventsSorting");
  if (typeof sorting == 'undefined') {
    sorting = {by: sortField, order: 1};
    Session.set("eventsSorting", sorting);
  }
  if (sorting.by === sortField) {
    sorting.order === 1?sorting.order=-1:sorting.order=1;
  }
  else {
    sorting.by = sortField
  }
  Session.set("eventsSorting", sorting);
};

var getFieldLabel = function(field) {
  switch (field) {
    case "jobId":
      return "Job";
    case "status":
      return "Status";
    case "size":
      return "Size";
    case "observations":
      return "Obs.";
    case "series":
      return "Series";
    case "responseTime":
      return "Response time";
    case "etime":
      return "Executed";
    default:
      throw "Not expected field: " + field;
  }
}

var applyFilters = function() {
  var query = {};
  $('#filtersRow').find('input').each(function(index) {
    var value = $(this).val();
    if (value) {
      var field = $(this).attr("id");
      var symbol = $(this).closest('div').find("button").first().text();
      var mSymbol = mapSymbolToOperator(symbol);
      var label =  getFieldLabel(field);
      query[field] = {
        op: mSymbol,
        val: value,
        label: label
      };
    }
  });

  var isProblematic = $("#problematicToggle").prop('checked');
  if (isProblematic) query.isProblematic = isProblematic;
  //else do not put field otherwise only non-problematic returned !!!
  Session.set("eventsFilter", query);
  Session.set("EventsFromCount", 0);
}
