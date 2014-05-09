var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res) {
  res.render('calendar');
});

router.get('/:day', function(req, res) {
  var db = req.db
  var collection = db.get('postcollection');
  var connections = db.get('followers');
  var users = [req.cookies.email]

  var dayString = moment(req.params.day, "YYYYMMDD").format('MMMM Do YYYY');

  connections.find({"follower": req.cookies.email}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      users.push(docs[i].user_email)
    }
    collection.find({"user_email": {$in : users}, "date": req.params.day}, {"sort": [['_id', -1]]}, function(e, docs) {
      res.render('day', { 'posts': docs, 'user':req.cookies.email, 'dayString':dayString, 'date': req.params.day });
    });
  });
});

// API endpoint for getting the # of posts in a day
router.get('/numposts/:day', function(req, res) {

  var db = req.db
  var collection = db.get('postcollection');
  var connections = db.get('followers');
  var users = [req.cookies.email]

  connections.find({"follower": req.cookies.email}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      users.push(docs[i].user_email)
    }
    collection.find({"user_email": {$in : users}, "date": req.params.day}, function(e, docs) {
      res.send({'posts':docs});
    });
  });
});

module.exports = router;
