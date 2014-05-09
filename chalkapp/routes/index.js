var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'NodeJS Blog', notLoggedIn: true });
});

router.get('/logout', function(req, res) {
  if (req.cookies.email) {
    res.clearCookie('email')
    res.redirect("/");
  } else {
    res.send("You aren't logged in!")
  }
});

router.post('/follow', function(req, res) {
  var follow = req.body.email
  var db = req.db
  var users = db.get('usercollection');
  var connections = db.get('followers');
  
  users.findOne({"email":follow}, function(err, user) {
    if (err) {
      res.send(err, 400)
      return
    }

    if (user) {
      connections.insert({
        "user_email": follow,
        "follower": req.cookies.email
      }, function(err, doc) {
        if (err) {
          res.send("There was a problem connecting to the database")
        } else {
          res.redirect("/blog")
        }
      });
    } else {
      res.send("There is no user with that email");
    }
  });
});


function isLoggedIn(req, res, next) {

  // if user is authenticated, carry on
  if (req.cookie.email) {
    return next();
  }
  // if they aren't redirect them
  res.redirect('/');
}

module.exports = router;
