module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index')
    });
    var bodyParser = require('body-parser')
    var urlencodedParser = bodyParser.urlencoded({ extended: false })


    app.use('/process',urlencodedParser, require('./process'));

    var comparison = require('./comparison');
    var description = require('./description');
    app.post('/subgraph/getDescriptionData',urlencodedParser,description.getDescriptionData);
    app.post('/subgraph/getComparisonData',urlencodedParser,comparison.getComparisonData);
}