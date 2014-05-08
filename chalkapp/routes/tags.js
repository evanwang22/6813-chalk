var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/:tag', function(req, res) {
  var db = req.db
  var collection = db.get('postcollection');
  var connections = db.get('followers');
  var users = [req.cookies.email]

  connections.find({"follower": req.cookies.email}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      users.push(docs[i].user_email)
    }
    collection.find({"user_email": {$in : users}, "tags": req.params.tag}, {"sort": [['_id', -1]]}, function(e, docs) {
      res.render('tags', { 'posts': docs, 'user':req.cookies.email, 'tag':req.params.tag });
    });
  });
});

module.exports = router;