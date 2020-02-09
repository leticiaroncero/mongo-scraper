var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("../models");

var router = express.Router();

router.get("/", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            var hbsObj = {
                articles: dbArticle
            }
            res.render("index", hbsObj);
        })
        .catch(function (err) {
            res.render("index");
        });
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

            if (title && link) {
                db.Article.findOneAndUpdate({
                    link: link
                }, {
                    title: title,
                    link: link
                }, { upsert: true }).catch(function (err) {
                    console.log("error inserting article");
                });
            }
        });

        res.status(200).end();
    });
});

router.get("/api/clear", function (req, res) {
    db.Article.deleteMany({}).then(function () {
        console.log("articles deleted");
        res.status(200).end();
    }).catch(function (err) {
        console.log("error deleting articles");
        res.status(400).end()
    });
});

router.post("/api/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

module.exports = router;