var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");

// var db = require("../models");

var router = express.Router();

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/api/fetch", function (req, res) {

    axios.get("https://www.reddit.com/r/photography/").then(function (response) {

        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("a[data-click-id=body]").each(function (i, element) {

            // Save the text of the element in a "title" variable
            var title = $(element).text();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            var link = $(element).attr("href");

            console.log(title + ", " + link);
        });

        res.send("done");
    });

})




module.exports = router;