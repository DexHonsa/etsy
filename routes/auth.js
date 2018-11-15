const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config = require("../config");
// Set Etsy temporary credentials
var key = "3ekinqtwqcr2w0fin0r9l8n2";
var secret = "7zyd503j8t";
var oauth = require("oauth");
var session = require("express-session");

// Set domain and callback
var domain = "http://localhost:3000";
var callback = "/api/auth/callback";

// Instantiate OAuth object
var oa = new oauth.OAuth(
  "https://openapi.etsy.com/v2/oauth/request_token",
  "https://openapi.etsy.com/v2/oauth/access_token",
  key,
  secret,
  "1.0A",
  domain + callback,
  "HMAC-SHA1"
);

router.get("/get-access-token", function(req, res) {
  console.log("*** get-access-token ***");
  // res.send("Hey");

  oa.getOAuthRequestToken(function(error, token, token_secret, results) {
    if (error) {
      console.log(error);
    } else {
      req.session.oauth.token = token;
      req.session.oauth.token_secret = token_secret;

      console.log("Token: " + token);
      console.log("Secret: " + token_secret);
      res.status(200).send(results["login_url"]);

      //res.redirect(results["login_url"]);
    }
  });
});

router.get("/callback", function(req, res) {
  console.log("*** callback ***");
  console.log(req);

  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;

    oa.getOAuthAccessToken(
      req.session.oauth.token,
      req.session.oauth.token_secret,
      req.session.oauth.verifier,
      function(error, token, token_secret, results) {
        if (error) {
          console.log(error);
        } else {
          req.session.oauth.access_token = token;
          req.session.oauth.access_token_secret = token_secret;

          console.log("Token: " + token);
          console.log("Secret: " + token_secret);
          console.log("Verifier: " + req.query.oauth_verifier);

          test({ token, token_secret }, res);
        }
      }
    );
  }
});

function test(req, res) {
  console.log("*** test ***");

  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/users/__SELF__",
    "GET",
    req.token,
    req.token_secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        console.log("*** SUCCESS! ***");
        res.sendFile(__dirname + "/public/success.html");
      }
    }
  );
}

module.exports = router;
