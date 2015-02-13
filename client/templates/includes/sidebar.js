Template.sidebar.events({
  "click #menu-toggle": function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
    // set the proper icon on the child span for the carret in/out
    if ($("#wrapper").hasClass("active")){
      sp = $("#menu-toggle span");
      sp.removeClass("fa-chevron-circle-right");
      sp.addClass("fa-chevron-circle-left");
    }
    else {
      sp = $("#menu-toggle span");
      sp.removeClass("fa-chevron-circle-left");
      sp.addClass("fa-chevron-circle-right");
    }
  }
});
