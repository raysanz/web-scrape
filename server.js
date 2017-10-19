var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
/////http://localhost:8081/scrape
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
////importing the model
const barHops = require('./storedData.model.js')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGOOSE_URL || 'mongodb://localhost:27017/barHops')

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination')
        process.exit(0)
    })
})
/////needed to get the data into the req.body
app.use(bodyParser.json())


app.get('/scrape', function (req, res) {

    url = 'https://www.yelp.com/biz/tiki-ti-cocktail-lounge-los-angeles?osq=tiki+bar';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var restaurant, price, rating, address, recommend;
            var json = {
                restaurant: "",
                price: "",
                rating: "",
                address: "",
                recommend: ""
            };
            ////gets name


            $('.u-space-t1').filter(function () {
                debugger
                var data = $(this);
                let newUrl = url
                if (data.children("h1").first().text() !== "") {
                    restaurant = data.children("h1").first().text().trim();
                    json.restaurant = restaurant;
                }


                ////biz-page-header-left
                ///release = data.children().last().children().last().text().trim();
            })

            $('.biz-page-header-left').filter(function () {
                debugger
                var data = $(this);
                let newUrl = url
                if (data.children().first().text() !== "") {
                    restaurant = data.children().children("h1").text()
                    ///.first().text().trim();
                    json.restaurant = restaurant;
                }


                ////biz-page-header-left
                ///release = data.children().last().children().last().text().trim();
            })


            ////gets price
            $('.bullet-after').filter(function () {
                debugger
                var data = $(this);
                price = data.children().first().text().trim();
                ///release = data.children().last().children().last().text().trim();

                json.price = price;

            })
            ////gets rating
            $('.biz-rating-very-large').filter(function () {
                debugger
                var data = $(this);
                rating = data.children().attr('title')
                ///.attr("alt")

                json.rating = rating;
            })
            ////gets address
            $('.street-address').filter(function () {
                debugger
                var data = $(this);
                address = data.children().first().text().trim();
                ///release = data.children().last().children().last().text().trim();

                json.address = address;

            })
            ///gets people also viewed
            $('.ylist').filter(function () {
                debugger
                var data = $(this);
                recommend = data.children().first().text().trim();
                ///release = data.children().last().children().last().text().trim();

                json.address = address;

            })
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            debugger
            console.log('File successfully written! - Check your project directory for the output.json file');
            let newEntry = new barHops(json)
            newEntry.save()
        })

        res.send('Check your console!')
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;