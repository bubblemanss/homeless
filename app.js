var express = require("express");
var request = require('request');    
var twilio = require("twilio");        
//var bodyParser = require("body-parser");
var app = express();

app.set('port', (process.env.PORT || 5000));

var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

// Configuration

// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
// app.use(express.methodOverride());
// app.use(app.router);
// app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

// Routes

var shelters = [];
request('https://project-8953594553337096456.firebaseapp.com/seattle/shelters', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        shelters = body;
    } 
});
var food = [];
request('https://project-8953594553337096456.firebaseapp.com/seattle/food_banks', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        food = body;
    } 
});


app.get('/homes', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    var data = {
        latitude: 1,
        longitude: 2,
        name: "home"
    }

    res.status(200).send(data);
});

app.post('/location', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    var data = {
        latitude: req.query.latitude,
        longitude: req.query.longitude
    }

    res.status(200).send(shelters);
});

app.post('/food', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    var data = {
        latitude: req.query.latitude,
        longitude: req.query.longitude
    }

    res.status(200).send(food);
});

app.post('/sms', twilio.webhook({
        validate:false
    }), function(req, res) {
        console.log(req.body.Body);
        var smsBody = req.body.Body.split(/\r\n|\r|\n/g);
        crimeplusplus(smsBody[0], smsBody[1]);
});