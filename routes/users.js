const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");

var URL =
  "mongodb://dexhonsa:Awesomeo21!@theshopbutler-shard-00-00-cnt4l.mongodb.net:27017,theshopbutler-shard-00-01-cnt4l.mongodb.net:27017,theshopbutler-shard-00-02-cnt4l.mongodb.net:27017/main?ssl=true&replicaSet=TheShopButler-shard-0&authSource=admin&retryWrites=true";

router.get("/:id", (req, res, next) => {
  var userId = req.params.id;

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .findOne(
          { _id: ObjectId(userId) },
        )
        .then(result => {
          res.status(200).send(result);
        });
    }
  );
});


module.exports = router;
