Template.jobsList.helpers({
    jobs: function() {
        return Jobs.find();
    }
});