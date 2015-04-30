Template.responseTimeItem.helpers({
  graphData: function() {
    var events = EventStats.find({}, {sort: {_id: 1}});
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
    console.dir(job);
    var color = this.value.avg > job.ert ? "btn-danger" : "btn-success";

    return {
      ticks: ticks,
      boxWidth: boxWidth,
      boxStart: boxStart,
      whiskerWidth: whiskerWidth,
      whiskerStart: whiskerStart,
      medianStart: medianStart,
      color: color
    }
  },
});
