const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { isInteger } = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

//Connect to Mongodb
mongoose.connect('mongodb://localhost:27017/articlesDB', 
                 {useNewUrlParser : true, useUnifiedTopology : true});

//Mongoose Schema
const articleSchema = mongoose.Schema({
  id: Number,
  title: String,
  content: String,
});

//Mongoose Model (This is a collection)
const Article = mongoose.model("Articles", articleSchema);

//Home Route
app.get('/', function(req, res){
  res.send('<div> <h1>Home Route</h1><p>Go to /articles to see a list of all available articles!</p></div>')
})

/******************        All Routes to /articles    ***************** */

//Get all articles 

app.route('/articles')
//Get all articles
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err && foundArticles.length){
      res.send(foundArticles)
    }else{
      res.send('<p>No articles found!</p>')
    }
  });
})
//Post an article
.post(function(req, res){
  const newArticle = new Article({
    title : req.body.title, 
    content :req.body.content
  });
  newArticle.save((err) => {
    if(!err){
      res.send('<p>Successfully saved article to database!</p>')
    }else{
      res.send(err)
    }
  });
})
//Delete all articles
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles!")
    }else{
      res.send(err)
    }
  });
})

/******************** Routes to a single article ************************/
app.route('/articles/:articleId')
//get a single article
.get(function(req, res){
  Article.findOne({
    _id : req.params.articleId
  }, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }
    else{
      res.send('<p>No article with that id found!</p>')
    }
  });
})
//Put a single article
.put(function(req, res){
  Article.updateOne( 
    { _id: req.params.articleId },
    { title: req.body.title, content: req.body.content },
    { overwrite: true }, 
    function(err){
      if(!err){
        res.send('<p>Successfully updated article!</p>')
      }
    });
})
//patch a single article
.patch( function(req, res){
  Article.updateOne(
    {_id : req.params.articleId},
    {$set : req.body}, 
    function(err){
      if(!err){
        res.send('<p>Successfully patched article!</p>')
      }
      else{
        res.send(err)}
    }
  )
})
//delete a single article
.delete(function(req, res){
  Article.deleteOne(
    { _id:req.params.articleId}, function (err) {
      if (!err) {
        res.send("Deleted article!");
      } else {
        res.send(err);
      }
});
});

//Listen for port
app.listen(3000, () => {
  console.log("Server started on port 3000!")
})