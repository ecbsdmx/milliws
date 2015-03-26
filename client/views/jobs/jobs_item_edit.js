Template.jobsItemEdit.helpers({
  formatSelected: function(format){
    return this.format === format ? "selected" : "";
  }
});

Template.jobsItemEdit.rendered = function() {
  $('.form-horizontal').validator();
};
