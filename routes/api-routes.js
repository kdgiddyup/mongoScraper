// scraper tools
// for getting HTML from URLs
var request = require("request");

// scrapes the html
var cheerio = require("cheerio");

// bring in our Article schema for saving articles to mongodb
var Article = require("../models/article");

module.exports = function(app) {

// "get"" api route to scrape mcclatchydc.com politics section and render data to index.handlebars
app.get("/scrape", function(req,res) {
  console.log("Route hit");
  // get some poppin' fresh html
  request("http://www.mcclatchydc.com/news/politics-government/", function (error, response, html){

    // set up our jquery-like $ function for cheerio selecting on our html
    var $ = cheerio.load(html);
    // we need a box in which to put our articles objects
    var articleArr = [];
    $("article").each(function(index,element){
      // push {headline, link, summary} object to articleArr array
      var headline = $(element).find(".title").text();
      // but first, some <article> tags on this site are empty for various reasons, so skip those
      if ( headline != ""){
        // use regex to remove /n strings in head and summary, and trim whitespace
        var headline = headline.replace(/\n/g,"").trim();
        var summary = $(element).find(".summary").text();
        summary = summary.replace(/\n/g,"").trim();
        if(summary=="")
          summary="No summary available.";
        
        articleArr.push({headline:  headline.replace(/\n/g,"").trim(), link: $(element).find("a").attr("href"), summary: summary });
      }
    });
    res.render("index",{articles:articleArr});
  })
});


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
      res.redirect("/scrape");
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
    if (err)
    console.log('There was an error removing document:',err);
  });
  // return user to saved screen
    res.redirect("/saved");
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
