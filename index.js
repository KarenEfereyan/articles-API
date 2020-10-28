const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/articlesDB");

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Articles", articleSchema);

//MAIN ROUTES

//1. Fetch all articles
app.get("/articles", function (req, res) {
  Article.find({}, function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

//2. Post an article
app.post("/articles", function (req, res) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  article.save(function (err) {
    if (!err) {
      res.send("Successfully saved article!");
    } else {
      res.send(err);
    }
  });
});

//3.Delete articles
app.delete("/articles", function (req, res) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("Successfully deleted articles!");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000!");
});
