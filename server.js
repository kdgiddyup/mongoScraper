// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

// scraper tools
  // required in api-routes.js

// db set up
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// local or deployed? Use the right mongo db
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongoscraper" );



// Hook mongoose connection to db
var db = mongoose.connection;

// Log any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Log a success message when we connect to our mongoDB collection 
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Bring in our Article model so we can send Article-classed objects as validated, formatted data to our mongoDB collection.
var Article = require("./models/article.js");

// Initialize Express
var app = express();

// Configure app with morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Static file support with public folder
app.use(express.static("public"));

// Configure Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// get routes here
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

var port = 3000;
// Listen on assigned port
app.listen(process.env.PORT || port, function() {
  console.log("App running on port "+port+"!");
});
