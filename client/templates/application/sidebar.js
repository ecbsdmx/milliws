Template.sidebar.rendered = function() {
  var carretState = Session.get('sidebarCarretState');  
  if (carretState != null)
  {
    switch(carretState) {
      case "openned":
        $("#wrapper").addClass("active");    
        break;
      default: 
        $("#wrapper").removeClass("active");    
    }
  }
}

Template.sidebar.events({
  "click #menu-toggle": function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
    // set the proper icon on the child span for the carret in/out
    if ($("#wrapper").hasClass("active")){
      Session.set("sidebarCarretState", "openned");
      sp = $("#menu-toggle span");
      sp.removeClass("fa-chevron-circle-right");
      sp.addClass("fa-chevron-circle-left");
    }
    else {
      Session.set("sidebarCarretState", "closed");
      sp = $("#menu-toggle span");
      sp.removeClass("fa-chevron-circle-left");
      sp.addClass("fa-chevron-circle-right");
    }
  }
});
