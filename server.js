// server.js

// BASE SETUP
const keys = require('./config/keys');

// call the packages we need
var express = require('express');
var app = express();

// Database
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI);

// bodyParser tillader JSON-posts
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001; // set our port

// MODELS
const question = require('./models/question.js');

// ROUTES
var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
require('./routes/question')(app);

// Registrer alle routes fra denne fil (prefixed '/api')
//app.use('/api', router);

// START SERVEREN
app.listen(port);
console.log('Magic happens on port ' + port);
