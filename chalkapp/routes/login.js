var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

router.get('/', function(req, res) {
  res.render('login.ejs', {message: ""});
});

router.post('/', function(req, res) {
  var db = req.db
  var email = req.body.email
  var password = req.body.password

  var users = db.get('usercollection')

  users.findOne({ "email": email}, function(err, user) {
    if (err) {
      res.send(err, 400);
      return
    }

    if (!user) {
      res.send("No user found.")
    } else if (bcrypt.compareSync(password, user.password) == false) {
      console.log(user)
      console.log(password)
      res.send("Wrong password!")
    } else {
      res.cookie('email', email);
      res.redirect("/blog");
    }
  });

});


function isLoggedIn(req, res, next) {

  // if user is authenticated, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them
  res.redirect('/');
}

module.exports = router;
