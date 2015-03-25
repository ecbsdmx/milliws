Template.eventsList.rendered = function() {
  $('#problematicToggle').bootstrapToggle();
}

Template.eventsList.helpers({
  totalEventCount: function() {
    return EventsCount.findOne().count;
  },
  eventsStart: function() {
    var from = Session.get("EventsFromCount");
    return from + 1;
  },
  eventsEnd: function() {
    var from = Session.get("EventsFromCount");
    return from + Events.find().count();
  },
  isLastPage: function() {
    var from = Session.get("EventsFromCount");
    var max = EventsCount.findOne().count;
    return from === (max - 10)?{class: "disabled"}:{};
  },

  isFirstPage: function() {
    var from = Session.get("EventsFromCount");
    return from === 0?{class: "disabled"}:{};
  },
  paginationElems: function() {
    var numEvt = EventsCount.findOne().count;
    var elems = [];
    var index = 0;
    for (var i=0;i<numEvt;i+=10) {
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
    query.field = "obs";
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
  'change #problematicToggle': function(e) {
    applyFilters();
  },
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
  'click .firstEvents': function (e) {
    e.preventDefault();
    Router.go("eventsList" , {fromCount: 0});
  },
  'click .previousEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount");
    Router.go("eventsList" , {fromCount: (from >= 10)?(from-10):0});
  },
  'click .nextEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount");
    var max = EventsCount.findOne().count;
    Router.go("eventsList" , {fromCount: (from + 10 <= max-10)?(from+10):(max-10)});
  },
  'click .lastEvents': function (e) {
    e.preventDefault();
    Router.go("eventsList" , {fromCount: (EventsCount.findOne().count - 10 )});
  },
  'click #filterBtn': function (e) {
    $("#filtersRow").toggleClass('hide');
    $("#runFiltersBtn").toggleClass('hide');
  },
  'click #runFiltersBtn':function(e) {
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

var mapSymbolToOperator = function(symbol) {
  var operator;
  switch(symbol) {
    case "≥":
      operator = "gte";
      break;
    case "≤":
      operator = "lte";
      break;
    case "[,]":
      operator = "rg";
      break;
    case "∈":
      operator = "in";
      break;
    case "∉":
      operator = "nin";
      break;
  }
  return operator;
}

var mapOperatorToSymbol = function(operator) {
  var symbol;
  switch(operator) {
    case "gte":
      symbol = "≥";
      break;
    case "lte":
      symbol = "≤";
      break;
    case "rg":
      symbol = "[,]";
      break;
    case "in":
      symbol = "∈";
      break;
    case "nin":
      symbol = "∉";
      break;
  }
  return symbol;
}

var applyFilters = function() {
  var query = {};
  $('#filtersRow').find('input').each(function(index) {
    var value = $(this).val();
    if (value) {
      var field = $(this).attr("id");
      var symbol = $(this).closest('div').find("button").first().text();
      var mSymbol = mapSymbolToOperator(symbol);
      query[field] = {
        op: mSymbol,
        val: value
      };
      console.log("field " + field + " - " + symbol + " - " + mSymbol);
    }
  });

  var isProblematic = $("#problematicToggle").prop('checked');
  query.isProblematic = isProblematic;
  Session.set("eventsFilter", query);
}
