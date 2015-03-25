Template.columnFilter.rendered = function(){
  $('[data-toggle="popover"]').popover();
}

Template.columnFilter.events({
  'click .filtersMenu a': function (e){
    var symbol = $(e.currentTarget).find(".symbol").first().text();
    $(e.currentTarget).closest('div').find("button").first().text(symbol);
  },
  'keypress input': function(e) {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      $(e.currentTarget).closest("form").submit();
    }
  }
});
