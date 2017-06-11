// bring in our Article schema for saving articles to mongodb
var Article = require("../models/article");

module.exports = function(app) {

// Route to save our article to mongoDB via mongoose
app.post("/save", function(req, res) {

  var article = new Article(req.body);

  // With the new "Article" object created, we can save our data to mongoose
  article.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise, send the new doc to the browser
    else {
      res.redirect("/");
    }
  });
});


// Route to retrieve and show saved articles
app.get("/saved", function(req,res){
  Article.find({}, function(err, found){
    if(err){
      console.log(err);
    }
    else{
      res.render("saved",{found:found});
    }
  });
});

// Route to remove saved article
app.get("/remove/:id", function(req,res){
  Article.remove({_id: req.params.id}, function(err){
    if (err) {
      console.log('There was an error removing document:',err);
    };
    res.json({message: true,id:req.params.id});
   });
// return user to saved screen
  

})

// Route to save notes for an article to mongoDB via mongoose
app.post("/addnote", function(req, res) {
  
  console.log("Adding note; req.body:",req.body);
  // find article by _id and 
  Article.update({ _id: req.body.articleId}, { notes: req.body.noteText }, function(err){
    if(err)
      console.log("Error adding note:",err)
    else
      console.log("Note added to saved article.")
    }
    );
  
  res.redirect("/saved");
});

// Route to retrieve notes, if any, for given article
app.get("/getnote/:id", function(req,res){
  console.log("Seeking notes for",req.params.id);
  Article.find({
    _id:req.params.id}, function(err,found){
      if(err)
        console.log("Error retrieving note:",err);
        else {
          res.json(found)
        }
    })
  });
};
