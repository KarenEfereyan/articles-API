const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view-engine", "ejs");
app.use(bodyParser({ urlencoded: true }));

mongoose.connect("mongodb://localhost:27017/articlesDB");

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Articles", articleSchema);

//MAIN ROUTES
app.get("/articles", function (req, res) {
  Article.find({}, function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000!");
});
