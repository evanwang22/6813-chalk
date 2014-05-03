var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db
  var collection = db.get('postcollection');
  collection.find({},{"sort": [['_id', -1]]}, function(e, docs) {
    res.render('blog', { 'posts': docs });
  });

});

router.get('/new_post', function(req, res) {
  res.render('blog/new_post');
});

router.post('/add_post', function(req, res) {
  console.log(req.files);
  var db = req.db

  var title = req.body.title
  var body = req.body.body
  var tmp_path, target_path, image;

  if (req.files){
    image = req.files.image.originalFilename;
    tmp_path = req.files.image.path;
    target_path = './public/images/' + req.files.image.originalFilename;
    
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
    "image" : image,
    "dir_path" : "/images/" + image
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
