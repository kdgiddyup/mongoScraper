/* Article Schema
 * ===================================== */

// Require mongoose
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// Instantiate a new Schema, UserSchema
var ArticleSchema = new Schema({
  // headline
  headline: {
    type: String,
    trim: true
  },
  // link
  link: {
    type: String,
    trim: true,
  },
  //summary
  summary: {
    type: String,
    trim: true
  },
  //notes
  notes: {
    type: String,
    trim: true
  }
});

/* CUSTOM METHODS HERE
 * -/-/-/-/-/-/-/-/-/- */

/* Custom Method Format
    UserSchema.methods.[METHOD NAME HERE ] = function() {
      // the method's processes go here
    }; */

// Pass the schema to the Article model
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
