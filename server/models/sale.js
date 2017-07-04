var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var SaleSchema = new Schema({
	year: Number,
	product:String,
	country:String,
	revenue: Number
});

mongoose.model('Sale', SaleSchema);