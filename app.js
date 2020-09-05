const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useUnifiedTopology: true,useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema);

app.route("/articles")
.get(function(req, res){
    Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added new entry!");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the entries!");
        }else{
            res.send(err);
        }
    });
});

//////////////////// Requests Targetting A Specific Article ///////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

    Article.findOne({title: req.params.articleTitle}, function(err, article){
        if(article){
            res.send(article);
        }else{
            res.send("No matching article was found!");
        }
    });
})
.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.params.title, content: req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }
        }
    )
})
.patch(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }else{
                res.send(err);
            }
        }
    )
})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},function(err){
            if(!err){
                res.send("Successfully deleted article.")
            }else{
                res.send(err);
            }
        } 
    )
});




app.listen(2000,function(){
    console.log("Running on 2000!")
});
