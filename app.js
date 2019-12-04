
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose");

// mongo setup
    mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});

//express setup
    app.set("view engine", "ejs");
    app.use(express.static ("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride("_method"));
    app.use(expressSanitizer());

//mongo SCHEMA
 var blogSchema = new mongoose.Schema({
    title : String,
    image: String,
    body : String,
    created : {type: Date, default: Date.now}
});

// mongo MODEL
 var Blog = mongoose.model("Blog", blogSchema);

//Blog.create ({
   // title: "Test",
    //image: "https://images.unsplash.com/photo-1498248193836-88f8c8d70a3f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fef7abd0edb5cd7e37c4e15923a20733&auto=format&fit=crop&w=500&q=60",
    //body: "Hello this is the test blog"
 //});

//RESTful Routes

//INDEX "/x" list all x in database
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
           if (err){
               console.log("ERROR!!");
           } else {
               res.render("index", {blogs: blogs});
           }
    });
});

//HOME "/""
app.get("/", function(req, res){
    res.redirect("/blogs");

});

//NEW ROUTE "/x/new" create new x
app.get("/blogs/new", function(req, res){
               res.render("new");
    });

//CREATE ROUTE "/x/" create new x
app.post("/blogs", function(req, res){
          //CREATE x
         req.body.blog.body = req.sanitize(req.body.blog.body);
         Blog.create(req.body.blog, function(err, newBlog){
             if (err){
                 res.redirect("new");
             }else{
                res.redirect("/blogs");
             }
         });
    });

//SHOW ROUTE "/x/:id" show details of x
app.get("/blogs/:id", function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            }else
                res.render("show", {blog: foundBlog});
        });
    });

//EDIT ROUTE "/x/:id/edit" edit existent x
app.get("/blogs/:id/edit", function(req, res){
          Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            }else
                res.render("edit", {blog: foundBlog});
        });
    });

//UPDATE ROUTE "/x/:id" update rute from edit route info
app.put("/blogs/:id", function(req, res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        //Blog.findByIdAndUpdate(id, newData, callback)
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
           if(err){
               res.redirect("/blogs");
           } else {
               res.redirect("/blogs/" + req.params.id);
           }
        });
    });

//DESTROY ROUTE "/x/:id" delete existind x
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, removedBlog){
           if(err){
               res.redirect("/blogs");
           } else {
               res.redirect("/blogs/");
           }
        });
    });


//SERVER setup
app.listen(3000, process.env.IP, function(){
    console.log("SERVER RUNNING!!");
});


