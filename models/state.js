var mongoose = require('mongoose');

var suggestionStateSchema = new mongoose.Schema({
    state: String
});

module.exports = mongoose.model('SuggestionState', suggestionStateSchema);
