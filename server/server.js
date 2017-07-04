var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var mongoUri = 'mongodb://admin:123456@ds145302.mlab.com:45302/vapps';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function() {
    throw new Error('unable to connect to database at ' + mongoUri);
});


var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

require('./models/sale');
require('./routes')(app);

app.listen(3001);
console.log('Listening on port 3001...');