var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
  var search = req.query.search
  var db = req.db
  var collection = db.get('postcollection');
  var connections = db.get('followers');
  var users = [req.cookies.email]

  connections.find({"follower": req.cookies.email}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      users.push(docs[i].user_email)
    }
    collection.find({
      $or:[{"body": { $regex: search}, "user_email":{$in:users}},
      {"tags": search,"user_email": {$in : users}}]
      },
      {
        "sort": [['_id', -1]]
      },
      function(e, docs) {
        console.log(e);
        console.log(docs);
        res.render('blog', { 'posts': docs, 'user':req.cookies.email });
      }
    );
  });
});

module.exports = router;
