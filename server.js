const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();




const PORT = 3000;
const URL = "mongodb://127.0.0.1:27017/demoDB";


///////////////////////////////////////////mongodb connection/////////////////////////////////////////
mongoose.connect(URL, () => {
    console.log("Mongo connected");
});



app.use(express.static("Public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html", (err) => {
    if (err) return err;
  });
});


/////////////////////////////////////////Schema for blogs///////////////////////////////////////////////////////////
const blogSchema = {
     topic : String,
     body : String,
     auth : String


}

const Blog = mongoose.model("BLOG", blogSchema);


app.get("/blogs" , function(req,res){
  Blog.find({}, function(err, blogs){
    res.render("blogs", {
      para: blogs
      });
  });
});

app.get("/post", function(req,res){
  res.render("post");
});

app.post("/post", function (req,res){
  const blog = new Blog ({
    topic: req.body.topic,
    body : req.body.body,
    auth : req.body.auth
  });

  blog.save(function(err){
    if (!err){
      Blog.find({}, function(err, blogs){
        res.render("blogs", {
          para: blogs
          });
      });
    }
  });
});
app.get("/blogs/:BlogId", function(req, res){

const requestedBlogId = req.params.BlogId;

  Blog.findOne({_id: requestedBlogId}, function(err, blog){
    res.render("readBlog", {
      topic : blog.topic,
      body: blog.body,
      auth : blog.auth
    });
  });

});

app.get("/delete/:deleteId", (req, res) => {
    let deleteId = req.params.deleteId;
    Blog.deleteOne({_id: deleteId}, (err) => {
        if (!err) {
          res.redirect("/blogs");
        }
    })
})

app.get("/update/:updateId", (req, res) => {
    let updateId = req.params.updateId;
    Blog.findOne({_id: updateId}, (err, doc) => {
        res.render("update", {topic: doc.topic, body: doc.body, id: updateId});
    })
})

app.post("/update", (req, res) => {
    const updateId = req.body.post;

    Blog.updateOne({_id: updateId}, {
        topic: req.body.updatedTitle,
        body: req.body.updatedContent

    }).then(() => res.redirect("/blogs"));
})
//////////////////////server/////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
