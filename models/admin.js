var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    username: String
});

module.exports = mongoose.model('Admin', adminSchema);
