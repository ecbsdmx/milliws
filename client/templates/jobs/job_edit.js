Template.jobEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var job = {
            _id: this._id,
            name: $("#inputName").val(),
            url: $("#inputURL").val(),
            subscribed: $("#inputSub").is(':checked'),
            ert: parseInt($("#inputERT").val()),
            ent: parseInt($("#inputENT").val()),
            freq: parseInt($("#inputFreq").val())
        };
        console.log("Updated ENT: " + job.ent);
        console.log("Updated freq: " + job.freq);
        Meteor.call('jobUpdate', job, function(error, result) {
            if (error) {
                return alert(error.reason);
            }
            if (result.urlExists) {
                return alert('There is already a monitoring job for the supplied URL.');
            }
            Router.go('jobPage', {_id: result._id});
        });
    }
});