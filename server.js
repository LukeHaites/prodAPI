/**
 * Created by Luke on 5/07/2014.
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    item = require('./server/dataService');

//Set env variable to nodes param or 'development' if node param not set.  Works because an or check (||) always just returns the first true statement and empty is falsey
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

app.get('/', function(req, res){
    res.json({message: 'Welcome to the API, please call /API for more details'})
});

app.get('/api', function(req, res){
    res.send('Congratulations - you have found the API !')
});

app.get('/api/products', item.findAll);
app.get('/api/products/:id', item.findById);

app.post('/api/products', function(req, res){
    console.dir(req.body);
    db.products.save(req.body, function(err, doc){
        if (err) {
            res.send(500, err.message);
        }
        else res.send(200, doc);
    });
});
app.put('/api/products/:id', item.updateItem);
app.delete('/api/products/:id', item.deleteItem);

var port = 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');