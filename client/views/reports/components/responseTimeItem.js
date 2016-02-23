Template.responseTimeItem.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
};

Template.responseTimeItem.helpers({
  graphData: function() {
    var events = EventStats.find({_id: {$in: Session.get("SelectedEventsStats")}}, {sort: {_id: 1}});
    var max = 0;
    events.forEach(function(element) {
      if (element.value.whiskerStop > max) {
        max = element.value.whiskerStop;
      }
    });
    var divider = Math.pow(10, max.toString().length - 1);
    var maxRange = Math.round((max * 1.1) / divider) * divider;
    var numTicks = 5;
    var ticks = [];
    var step = Math.round(maxRange / numTicks);

    for (var i = 0; i <= numTicks; i++) {
      ticks[i] = {
        tickValue:    i * step,
        tickPercent:  (100 / numTicks) * i + "%"
      };
    }

    var boxWidth = (((this.value.quartile3 - this.value.quartile1) / maxRange) * 100) + "%";
    var boxStart = ((this.value.quartile1 / maxRange) * 100) + "%";

    var whiskerWidth = (((this.value.whiskerStop - this.value.min) / maxRange) * 100) + "%";
    var whiskerStart = ((this.value.min / maxRange) * 100) + "%";

    var medianStart = ((this.value.quartile2 / maxRange) * 100) + "%";

    var job = Jobs.findOne({_id: this._id});
    var color = this.value.avg > job.ert ? "btn-danger" : "btn-success";

    return {
      ticks: ticks,
      boxWidth: boxWidth,
      boxStart: boxStart,
      whiskerWidth: whiskerWidth,
      whiskerStart: whiskerStart,
      medianStart: medianStart,
      color: color
    };
  },
  tooltip: function() {
    var text = "";
    text += '<i class="fa fa-line-chart fa-fw text-center"></i>';
    text += "<table>";
    text += "<tr><td class=\"text-left\">Average: </td><td class=\"text-right\">" + formatNumber(this.value.avg) + "</td></tr>";
    text += "<tr><td class=\"text-left\">Median: </td><td class=\"text-right\">" + formatNumber(this.value.quartile2) + "</td></tr>";
    text += "<tr><td class=\"text-left\">25th percentile: </td><td class=\"text-right\">" + formatNumber(this.value.quartile1) + "</td></tr>";
    text += "<tr><td class=\"text-left\">75th percentile: </td><td class=\"text-right\">" + formatNumber(this.value.quartile3) + "</td></tr>";
    text += "<tr><td class=\"text-left\">91st percentile: </td><td class=\"text-right\">" + formatNumber(this.value.whiskerStop) + "</td></tr>";
    text += "<tr><td class=\"text-left\">Minimum: </td><td class=\"text-right\">" + formatNumber(this.value.min) + "</td></tr>";
    text += "<tr><td class=\"text-left\">Maximum: </td><td class=\"text-right\">" + formatNumber(this.value.max) + "</td></tr>";
    text += "</table>";

    return text;
  }
});
