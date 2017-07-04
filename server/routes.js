module.exports = function(app){
    var controller = require('./controllers/sale');
    app.get('/sales', controller.findAll);
    app.get('/years', controller.getYears);
}