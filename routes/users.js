var router = require('express').Router();
var User = require('../models/user');

router.get('/', function(req, res) {
    User.find({}, function(err, docs) {
        if(err) {
            console.log(err);
            res.json(err);
        }

        res.json(docs);
    });
});

router.get('/currentUser', function(req, res) {
    res.json(req.user || {});
});

router.get('/:id', function(req, res) {
    User.findOne({'_id': req.params.id}, function(err, doc) {
        if(err) {
            console.log(err);
            res.json(err);
        }

        res.json(doc);
    });
});

module.exports = router;
