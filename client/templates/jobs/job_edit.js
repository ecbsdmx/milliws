Template.jobEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var job = {
            _id: this._id,
            name: $("#inputName").val(),
            url: $("#inputURL").val(),
            ert: parseInt($("#inputERT").val()),
            freq: parseInt($("#inputFreq").val()),
            isDeleted: this.isDeleted
        };
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