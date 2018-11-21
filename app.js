var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var router = express.Router();
var userRoutes = require("./routes/users");
var authRoutes = require("./routes/auth");
var compression = require("compression");
var MongoClient = require("mongodb").MongoClient;
var jwt = require("jsonwebtoken");
var morgan = require("morgan");
var session = require("express-session");
var key = "sfv059k3riqi5q77k28lsyms";
var secret = "yl7n8sprbh";
var oauth = require("oauth");
var crypto = require("crypto");
var config = require("./config");
var ObjectId = require("mongodb").ObjectId;

var URL =
  "mongodb://dexhonsa:Awesomeo21!@theshopbutler-shard-00-00-cnt4l.mongodb.net:27017,theshopbutler-shard-00-01-cnt4l.mongodb.net:27017,theshopbutler-shard-00-02-cnt4l.mongodb.net:27017/main?ssl=true&replicaSet=TheShopButler-shard-0&authSource=admin&retryWrites=true";

app.use(compression());

app.use(
  session({
    saveUninitialized: true,
    secret: "1234567890",
    resave: true
  })
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
//     return res.status(200).json({});
//   }
//   next();
// });

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

app.use("/api/users", userRoutes);


//-------------------------------------------------------------

// Root route
app.get("/api/auth", function(req, res) {
  // If session variable has not been initialized
  if (!req.session.oauth) {
    req.session.oauth = {};
  }

  // If access token has not been generated
  if (!req.session.oauth.access_token) {
    res.redirect("/api/get-access-token");
  } else {
    // test(req, res);
  }
});

// Set domain and callback
var domain = "http://192.168.0.8:8080";
var callback = "/api/callback";

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

app.post("/api/login", function(req, res) {
  const { email, password } = req.body;
  var lowercase = email.toLowerCase();
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection.findOne({ email: lowercase, password: passwordHash }).then(
        result => {
          if (result != null) {
            var token = jwt.sign(
              {
                id: result._id,
                email: result.email,
                token:result.token,
                secret:result.secret
              },
              config.secret,
              {
                expiresIn: 86400 // expires in 24 hours
              }
            );

            res.send({ auth: true, token: token });
          } else {
            res.status(401).send({ error: "Incorrect Credentials" });
          }
        },
        err => {
          res.status(401).send({ error: err });
        }
      );
    }
  );
});

app.post("/api/signup", (req, res, next) => {
  const { password, email } = req.body;
  var lowerEmail = email.toLowerCase();

  if (password.length < 6) {
    res
      .status(401)
      .send({ error: "Passwords must have more than 6 characters" });
    return;
  }
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection.findOne({ email: lowerEmail }).then(result => {
        if (result == null) {
          collection
            .insert({
              password: passwordHash,
              email: lowerEmail
            })
            .then(result => {
              res.send({
                userId: result.ops[0]["_id"],
                message: "Created Succesfully"
              });
            });
        } else {
          res.status(401).send({ error: "Email Exists" });
        }
      });
    }
  );
});

app.put("/api/update_user", function(req, res) {
  const { update, userId } = req.body;

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .update({ _id: ObjectId(userId) }, { $set: update }, { upsert: false })
        .then(
          result => {
            res.status(200).send(result);
          },
          err => {
            res.status(401).send({ error: err });
          }
        );
    }
  );
});



app.get("/api/get-access-token", function(req, res) {
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

app.get("/api/callback", function(req, res) {
  console.log("*** callback ***");

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

          // test({ token, token_secret }, res);
          res.redirect(
            "http://192.168.0.8:8080/connect?token=" +
              token +
              "&secret=" +
              token_secret
          );
        }
      }
    );
  } else {
    res.status(500).send({ message: "something went wrong" });
  }
});

app.get("/api/get_shops/:userId", function(req, res) {
  var userId = req.params.userId;
});

app.post("/api/get_transaction", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/receipts/" +
      req.body.receiptId +
      "/transactions",
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        // console.log(data);
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});

app.post("/api/get_self", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/users/__SELF__",
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});

app.post("/api/get_trans", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/shops/" +
      req.body.shopId +
      "/transactions?was_shipped=false&limit=100&page=" +
      req.body.page,
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        // console.log(data);
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});

app.post("/api/get_receipts", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/shops/" +
      req.body.shopId +
      "/receipts?was_shipped=false&limit=100&page=" +
      req.body.page,
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        //console.log(data);
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});

app.get("/api/get_sample",function(req,res){
  res.status(200).send("hello");
})

app.post("/api/get_all_receipts", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/shops/" +
      req.body.shopId +
      "/receipts?limit=100&page=" +
      req.body.page,
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        //console.log(data);
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});

app.post("/api/get_active_listings", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/shops/" +
      req.body.shopId +
      "/listings/active?limit=100&page=" +
      req.body.page,
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        //console.log(data);
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});

app.post("/api/get_listing_images", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/listings/" + req.body.listingId + "/images",
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        //console.log(data);
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});

app.post("/api/get_shops", function(req, res) {
  oa.getProtectedResource(
    "https://openapi.etsy.com/v2/users/" + req.body.userId + "/shops",
    "GET",
    req.body.token,
    req.body.secret,
    function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        // console.log(data);
        // console.log("*** SUCCESS! ***");
        res.status(200).send(data);
      }
    }
  );
});


//-------------------------------------------------------------

app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
