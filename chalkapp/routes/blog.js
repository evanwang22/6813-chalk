var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');

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
      res.render('blog', { 'posts': docs, 'user':req.cookies.email});
    })
  })
});

router.post('/favorite', function(req, res){
  var post_id = req.body.id
  var is_fav = req.body.is_fav
  var db = req.db;
  var collection = db.get('postcollection');
  collection.update(
    {_id: post_id},
    {
      $set: {is_favorite: is_fav}
    }
  );
});

router.post('/add_post', function(req, res) {
  console.log("add post called")
  
  var db = req.db

  var title = req.body.title
  var body = req.body.body
  var tags = req.body.tagsEntered.split(',');
  var formTags = []
  for (var i = 0; i < tags.length; i++){
    if (tags[i].trim()) {
      formTags.push(tags[i].trim())
    }
  }

  var tmp_path, target_path, image;

  // Set moment timezone
  var time = moment().zone('-04:00')

  if (req.files.file){
    image = req.files.file.originalFilename;
    tmp_path = req.files.file.path;
    target_path = './public/images/' + image;

    // TODO: Clean this up -- maybe use a hash or something
    if (fs.exists(target_path, function(exists){
      if(exists){
        console.log("exists");
        image = image.split('.')[0] + '1.' + image.split('.')[1];
        target_path = './public/images/' + image;
      }
    }));
    console.log(image, target_path);

    fs.rename(tmp_path, target_path, function(err){
      console.log("rename", target_path, image);
      if (err) throw err;
      fs.unlink(tmp_path, function(){
        if (err) throw err;
        //res.send("file uploaded to: " + target_path);
      });
    });
  }

  var collection = db.get('postcollection');

  collection.insert({
    "title" : title,
    "body" : body,
    "user_email" : req.cookies.email,
    "image" : image,
    "dir_path" : "/images/" + image,
    "tags": formTags,
    "date" : time.format('YYYYMMDD'),
    "timeString": time.format('MMMM Do YYYY, h:mm:ss a'),
    "is_favorite": false
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
