var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
/////http://localhost:8081/scrape
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGOOSE_URL || 'mongodb://localhost:27017/rudy-crud')

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination')
        process.exit(0)
    })
})
/////needed to get the data into the req.body
app.use(bodyParser.json())


app.get('/scrape', function (req, res) {

    url = 'http://www.imdb.com/title/tt0468569';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = {
                title: "",
                release: "",
                rating: ""
            };

            $('.title_wrapper').filter(function () {
                var data = $(this);
                title = data.children().first().text().trim();
                release = data.children().last().children().last().text().trim();

                json.title = title;
                json.release = release;
            })

            $('.ratingValue').filter(function () {
                var data = $(this);
                rating = data.text().trim();

                json.rating = rating;
            })
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            debugger
            console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;