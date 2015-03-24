Template.columnFilter.rendered = function(){
  $('[data-toggle="popover"]').popover();
}

Template.columnFilter.helpers({
  getHelpInfo: function(help){
    console.log("help text = " + help);
    return help;
  }
});

Template.columnFilter.events({
  'click .filtersMenu a': function (e){
    var symbol = $(e.currentTarget).find(".symbol").first().text();
    $(e.currentTarget).closest('div').find("button").first().text(symbol);
  }
});
