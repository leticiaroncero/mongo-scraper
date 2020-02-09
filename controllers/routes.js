var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("../models");

var router = express.Router();

router.get("/", function (req, res) {
    db.Article.find({})
    .populate("notes")
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

        var $ = cheerio.load(response.data);

        $("div[data-click-id=background]").each(function (i, element) {

            var titleContainer = $(element).find("a[data-click-id=body]");
            var title = $(titleContainer).text();
            var link = $(titleContainer).attr("href");

            var description = $(element).find("div[data-click-id=text]").text();

            if (title && link) {
                db.Article.findOneAndUpdate({
                    link: link
                }, {
                    title: title,
                    link: link,
                    description: description
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

router.delete("/api/articles/:id", function(req, res) {
    db.Note.deleteOne({_id: req.params.id}).then(function () {
        console.log("note deleted");
        res.status(200).end();
    }).catch(function (err) {
        console.log("error deleting note");
        res.status(400).end()
    });
});

module.exports = router;