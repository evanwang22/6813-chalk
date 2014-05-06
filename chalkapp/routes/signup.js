var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

router.get('/', function(req, res) {
  res.render('signup.ejs', {message: ""});
});

router.post('/', function(req, res) {
  var db = req.db
  var email = req.body.email
  var password = genHash(req.body.password)

  var users = db.get('usercollection');
  
  users.findOne({ "email": email }, function(err, user) {
    
    if (err) {
      res.send(err, 400);
      return
    }
    
    // Following user already exists
    if (user) {
      res.send("username already taken", 400);
    } else {
      users.insert({
        "email":email,
        "password":password
      }, function(err, doc) {
        if (err) {
          res.send("There was a problem connecting to the database")
        } else {
          res.cookie('email', email);
          res.redirect("/blog")
        }
      });
    }
  });
});

function genHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function isLoggedIn(req, res, next) {

  // if user is authenticated, carry on
  if (req.cookie.email) {
    return next();
  }
  // if they aren't redirect them
  res.redirect('/');
}

module.exports = router;
