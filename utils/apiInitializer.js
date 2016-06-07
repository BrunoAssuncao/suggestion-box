var SuggestionState = require('../models/state');
var Admin = require('../models/admin');

var states = [{state: "Open"}, {state: "Taking in consideration"}, {state: "Resolved"}, {state: "Ignored"}];
var admins = [{username: "goncalo.assuncao"}, {username: "gcardoso"}];

Admin.find({}, function(err, docs) {
    if(err) {
        console.log(err);
    }

    if(docs.length === 0 ) {
        Admin.collection.insert(admins);
    }
});


SuggestionState.find({}, function(err, docs) {
    if(err) {
        console.log(err);
    }

    if(docs.length === 0) {
        SuggestionState.collection.insert(states);
    }
});
