var mongoose = require('mongoose');

var suggestionSchema = new mongoose.Schema({
    creator: String,
    title: String,
    body: String,
    likes: {type: Array, default: []},
    dislikes: {type: Array, default: []},
    createdAt: {type: Date, default: Date.now() },
    state: String,
    updates: {type: Array, default: []}
});

suggestionSchema.virtual('score').get(function(){
    return this.likes.length - this.dislikes.length;
});

suggestionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);
