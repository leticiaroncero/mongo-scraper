var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

var PORT = 3000;

// Require all models
// var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static("public"));

var routes = require("./controllers/routes");
app.use(routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/populate", { useNewUrlParser: true });

// When the server starts, create and save a new Library document to the db
// The "unique" rule in the Library model's schema will prevent duplicate libraries from being added to the server

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
