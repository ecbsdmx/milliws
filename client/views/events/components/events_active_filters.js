Template.eventsActiveFilters.helpers({
  activeFilters: function() {
    var filters = Session.get("eventsFilter") || {};
    var ret = [];
    _.each(filters, function(value, key, list) {
      if (key !== "isProblematic") {
        ret.push({field: key, op:value.op, value: value.val});
      }
    });
    return ret;
  }
});

Template.eventsActiveFilters.events({
  'click .removeBtn': function(e) {
    //FIXME code remove filter btn
    var fieldId = $(e.currentTarget).attr("id").substr("removeField_".length);
    console.log("to be coded! field: " + fieldId);
  },
  'click .label': function(e) {
    var fieldId = $(e.currentTarget).find("span").last().attr("id").substr("removeField_".length);
    console.log("Clicked on tag: " + fieldId);

    //FIXME call parent function that does this (code once + re-use)
    $("#filtersRow").removeClass('hide');
    $("#runFiltersBtn").removeClass('hide');

    $("#"+fieldId).focus().select();

  }
});
