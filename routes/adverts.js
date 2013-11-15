var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('motoads', server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'motoads' database");
    db.collection('adverts', {strict: true}, function(err, collection) {
      if (err) {
        console.log("The 'adverts' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.findAll = function(req, res) {
  db.collection('adverts', function(err, collection) {
    collection.find().toArray(function(err, items) {
      console.log('adverts send from DB');
      res.send(items);
    });
  });
};

exports.add = function(req, res) {
  var advert = req.body;
  console.log('Adding advert: ' + JSON.stringify(advert));
  db.collection('adverts', function(err, collection) {
    collection.insert(advert, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
};

var populateDB = function() {
  var fs = require('fs');
  var file = './data/adverts.json';

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var adverts = JSON.parse(data);
    db.collection('adverts', function(err, collection) {
      if (err) {
        throw err;
      }
      collection.insert(adverts, {safe: true}, function(err, result) {
        if (err) {
          throw err;
        }
      });
    });
  });
};