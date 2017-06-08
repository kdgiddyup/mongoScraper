// Routes
var db = require("../models/article");

module.exports = function(app) {
    // index route renders main
    app.get("/", function(req,res) {
        res.render("index");
    });

};