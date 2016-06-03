var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    slack: {
        id: String,
        token: String,
        username: String
    },
    isAdmin: Boolean
});

module.exports = mongoose.model('User', userSchema);
