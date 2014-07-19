/**
 * Created by Luke on 13/07/2014.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('PLM', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'PLM' database");
    }
    else {
        console.log("Failed to connect to 'PLM' database, error returned - " + err);
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving item: ' + id);
    db.collection('products', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('products', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if (err) {
                res.send(500, err.message);
            }
            else if(!items) res.send(204, {message: 'No products found'});
            else {
                res.send(200, items);
            };
        });
    });
};

exports.addItem = function(req, res) {
    var item = req.body;
    console.log('Adding item: ' + JSON.stringify(item));
    db.collection('products', function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateItem = function(req, res) {
    var id = req.params.id;
    var item = req.body;
    console.log('Updating item: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('products', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating item: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(item);
            }
        });
    });
};

exports.deleteItem = function(req, res) {
    var id = req.params.id;
    console.log('Deleting item: ' + id);
    db.collection('products', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' item(s) deleted');
                res.send(req.body);
            }
        });
    });
};
