var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

var path = require('path');

const bodyParser = require("body-parser");

var SERVER_PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

var DB_NAME = process.env.DB_NAME||'tradingDB';

console.log("process.env.MONGO_URL=="+process.env.MONGO_URL)

var url = process.env.MONGO_URL||'mongodb://localhost:27017';

app.use(bodyParser.json());

app.route('/').get((req, res)=> {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.route('/trades').get(function(req, res){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(DB_NAME);
            var query = { };
            dbo.collection("trades").find(query).toArray(function(err, result) {
              if (err) throw err;              
              res.send(result);
              db.close();
            });
        });
});

app.route('/createTrade').post((req, resp)=>{
    //req.body.TradeNumber
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db(DB_NAME);
            dbo.collection("trades").insertOne(req.body, function(err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();

            var query = { };            
            resp.send("Trade created successfully: "+JSON.stringify(req.body));
            
          })
    });
});

app.route('/createTrades').post((req, resp)=>{
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db(DB_NAME);
            dbo.collection("trades").insertOne(req.body, function(err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            var query = { }; 

            dbo.collection("trades").find(query).toArray(function(err, result) {
              if (err) throw err;
              console.log(result.length);
              resp.send("Trades created in bulk!, current trade count: "+result.length);
              db.close();
            });

          });
    });
});

app.route('/deleteTrades').post((req, resp)=>{
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db(DB_NAME);
            dbo.collection("trades").drop(function(err, delOK) {
                console.log("Collection trades deleted");
                resp.send("All trades deleted");
                db.close();
              });

    });
});

app.route('/searchTrades').post((req, res)=>{
    res.send("Hey, searched trade as requested!");
});

var server = app.listen(SERVER_PORT, function() {});
console.log("Ramesh, server started at "+SERVER_PORT);