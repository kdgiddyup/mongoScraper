// scraper tools:
/****************/
// scrapes the html
var cheerio = require( "cheerio" );

// for getting HTML from URLs
var request = require ( "request" );

module.exports = function(app) {
  // index route renders main and scrapes headlines
  // "get"" api route to render index page
  app.get("/", function(req,res){

 // get some poppin' fresh html form the passed in market index
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

};