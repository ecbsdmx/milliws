Template.columnFilter.events({
  'click .filtersMenu a': function (e){
    var symbol = $(e.currentTarget).find(".symbol").first().text();
    $(e.currentTarget).closest('div').find("button").first().text(symbol);
  }
});
