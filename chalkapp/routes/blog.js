var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db
  var collection = db.get('postcollection');
  var connections = db.get('followers');
  var users = [req.cookies.email]

  connections.find({"follower": req.cookies.email}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      users.push(docs[i].user_email)
    }
    collection.find({"user_email": {$in : users}}, {"sort": [['_id', -1]]}, function(e, docs) {
      res.render('blog', { 'posts': docs, 'user':req.cookies.email });
    })
  })
});

router.get('/new_post', function(req, res) {
  res.render('blog/new_post');
});

router.post('/add_post', function(req, res) {
  var db = req.db

  var title = req.body.title
  var body = req.body.body

  var collection = db.get('postcollection');

  collection.insert({
    "title" : title,
    "body" : body,
    "user_email" : req.cookies.email
  }, function (err, doc) {
    if (err) {
      res.send("There was a problem connecting to the database")
    } else {
      res.location("/blog");
      res.redirect("/blog");
    }
  });
});

module.exports = router;
