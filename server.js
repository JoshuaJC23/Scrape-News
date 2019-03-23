var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
const cheerio = require('cheerio');

const  request = require('request-promise');


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// app.use(routes);
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Configure middleware
// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// var routes = require("./controller/routes");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/Scrape_News", { useNewUrlParser: true });

app.get("/", function (req, res) {
    console.log("is this working")
    db.Article.find({}, function (error, data) {
        var hbsObject = {
            article: data
        };
        console.log(hbsObject);
        res.render("home", hbsObject)
    })
})

app.get("/saved", function (req, res) {
    db.Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
        var hbsObject = {
            article: articles
        };
        res.render("saved", hbsObject);
    })
})


app.get("/scrape", function (req, res) {

    (async () => {

        await request('https://www.ksl.com/')
            .then((res) => {

                let $ = cheerio.load(res);
                let records = [];

                $("div[class='queue_story']").each((i, item) => {
                    let title = $(item).find("div").find("h2").text();
                    let summary = $(item).find("div").find("h5").text();
                    let URL = $(item).find("div").find("a").attr("href");

                    var record = {
                        title,
                        summary,
                        URL: URL
                    }
                    records.push(record)
                })
                console.log('test', records);

                if (records) {
                    for(var i = 0; i < records.length; i++){
                        let record = records[i];

                        db.Article.create({
                            title: record.title,
                            summary: record.summary,
                            URL: record.URL
                        },
                            function (err, inserted) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log(inserted)
                                }
                            },
                        )
                    }

                }
    })
        res.send("Scrape Complete");
  
  }) ()
});

app.get("/articles", function (req, res) {

})


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});