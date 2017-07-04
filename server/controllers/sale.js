var mongoose = require('mongoose'),
    Sale = mongoose.model('Sale');

/**
This method returns all the records in database
Results can be filtered by year
*/
exports.findAll = function(req, res, next) {
    var year = req.query.year;
    var query = year ? {
        "year": year
    } : {}
    Sale.find(query, function(err, results) {
        if (results != null) {
            return res.send(results);
        } else {
            return res.send("Error getting data")
        }    
    });
};

/**
This method returns an array of distinct value of reported years
*/
exports.getYears = function(req, res) {
    Sale.find({}).distinct("year", function(error, results) {
        if (results != null) {
            return res.send(results);
        }
        else {
            return res.send("Error getting data")
        }
    });
}