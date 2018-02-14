"use strict";

const express = require('express');
const app = express();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'binance-service';
const bodyParser = require('body-parser');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient
const jsonParser = bodyParser.json();

app.post('/', jsonParser, (req, res) => {
    if(!req.body.user || !req.body.tickerToAdd) {
        res.status(400);
        res.send('User or tickerToAdd is missing');
    } else{
        console.log(req.body);

        //MongoDB Operations
        MongoClient.connect(mongoUrl, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
        
            const db = client.db(dbName);
        
            findDocumentWithUser(req.body.user, db, function() {
                console.log("Testing");
            });
            addTickerValue(req.body.user, req.body.tickerToAdd, db, function() {
                console.log("Ticker value added");
            });
            client.close();
        });        
        res.json(req.body);
    }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));


const findDocumentWithUser = function(user, db, callback) {
    const collection = db.collection('binance-service');
    collection.find({'user': user}).toArray(function(err, docs){
        assert.equal(err, null);
        console.log('Found the following records');
        console.log(docs);
        callback(docs);
    })
}

const addTickerValue = function(userName, tickerValue, db, callback) {
    // Get the documents collection
    const collection = db.collection('user-ticker-watch');
    // Insert some documents
    collection.insertOne(
        {user : userName, ticker: tickerValue}
    , function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      console.log("Inserted 1 document into the collection");
      callback(result);
    });
  }