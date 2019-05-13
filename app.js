var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var methodoverride = require("method-override");
var expresssanitizer = require("express-sanitizer");

app = express();

// app config
mongoose.connect("mongodb://localhost/restblog");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.use(expresssanitizer());

// mongoose/model config
var blogschema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blog = mongoose.model("blog",blogschema);

/* blog.create({
    title: "test1",
    image: "data:image/jpeg;base64,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",
    body: "Random pic"
}) */

//restful routes

app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index",{blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
    
    blog.create(req.body.blog, function(err,newblog){
        if(err){
            console.log("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    //res.send("yup");
    blog.findById(req.params.id, function(err, foundblog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundblog});
        }
    }); 
});

//Edit Route
app.get("/blogs/:id/edit", function(req,res){
     blog.findById(req.params.id, function(err, foundblog){
         if(err){
             res.redirect("/blogs");
         } else {
             res.render("edit", {blog: foundblog});
         }
     });
});

// Update Route
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, updatedblog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else 
        {
            res.redirect("/blogs");
        }
    })
})

app.listen(3000, "localhost" , function() {
    console.log("Server started");
});