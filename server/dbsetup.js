var http = require('http');
var gunzip = require('zlib').createGunzip();
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://admin:123456@ds145302.mlab.com:45302/vapps"

var options = {
    host: 'aware-ui-test1.s3.amazonaws.com',
    path: '/sample_data.json.txt.gz'
};

//Get the file from provided URL,unzip and convert to json object then save to a remote mongodb
http.get(options, function(res) {
  var body = '';

  res.pipe(gunzip);

  gunzip.on('data', function (data) {
      body += data;
  });

  gunzip.on('end', function() {
    var jsondata = JSON.parse(body);
    MongoClient.connect(MONGO_URL, (err, db) => {  
        if (err) {
            return console.log(err);
        }
        
        //Drop the current database before create a new one
        db.dropDatabase();

        // Insert json data to mongodb
        db.collection('sales').insertMany(
            JSON.parse(body),
            function (err, res) {
                if (err) {
                    db.close();
                    console.log(err.errmsg);
                }
                // Success
                console.log("Database deployment completed")
                db.close();
            })
        });
    });
});