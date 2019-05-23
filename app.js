//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Hey"
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true
})


const postSchema = {
  inputTitle: String,
  inputPost: String
}

const Post = mongoose.model(
  "Post",
  postSchema
)

const startPost = new Post({
  inputTitle: "Welcome",
  inputPost: 'Welcome to your blog! You can add "/compose" to current url to add new post! Enjoy your blog time!'
})


app.route(['/', '/contact', '/about', '/compose'])
  .get(function(req, res) {
    if (req.url == '/') {
      Post.find({}, function(err, results) {
        if (results.length === 0) {
          startPost.save();
          res.redirect('/');
        } else {
          res.render('home', {
            DisplayContent: homeStartingContent,
            newPosts: results
          });
        }
      });
    } else if (req.url == '/contact') {
      res.render('contact', {
        DisplayContent: contactContent
      });
    } else if (req.url == '/about') {
      res.render('about', {
        DisplayContent: aboutContent
      });
    } else if (req.url == '/compose') {
      res.render('compose');
    }
  });

app.post('/compose', function(req, res) {
  const inputTitle = req.body.titleInput;
  const inputPost = req.body.postInput;

  const newPost = new Post({
    inputTitle: inputTitle,
    inputPost: inputPost
  })

  newPost.save(function(err) {
    if (!err) {
      res.redirect('/');
    }
  });

})

app.get('/posts/:postID', function(req, res) {
  Post.findOne({
    _id: req.params.postID
  }, function(err, results) {
    if (!err) {

        res.render('post', {
          title: results.inputTitle,
          DisplayContent: results.inputPost
        });    
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
