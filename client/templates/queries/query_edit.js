Template.queryEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var query = {
            _id: this._id,
            name: $("#inputName").val(),
            url: $("#inputURL").val(),
            subscribed: $("#inputSub").is(':checked'),
            ert: parseInt($("#inputERT").val()),
            ent: parseInt($("#inputENT").val()),
            freq: parseInt($("#inputFreq").val())
        };
        console.log("Updated ENT: " + query.ent);
        console.log("Updated freq: " + query.freq);
        Meteor.call('queryUpdate', query, function(error, result) {
            if (error) {
                return alert(error.reason);
            }
            if (result.urlExists) {
                return alert('There is already a monitoring job for the supplied URL.');
            }
            Router.go('queryPage', {_id: result._id});
        });
    }
});