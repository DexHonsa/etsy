var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var router = express.Router();
var userRoutes = require("./routes/users");
var authRoutes = require("./routes/auth");

var morgan = require("morgan");
var session = require("express-session");
var key = "6xfp5monh51risw6jjy7hw47";
var secret = "stxg22klvj";
var oauth = require("oauth");

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
// app.use("/api/auth", authRoutes);

//-------------------------------------------------------------

// Root route
app.get("/api/auth", function(req, res) {
  console.log("hey");
  // If session variable has not been initialized
  if (!req.session.oauth) {
    req.session.oauth = {};
  }

  // If access token has not been generated
  if (!req.session.oauth.access_token) {
    res.redirect("/api/get-access-token");
  } else {
    test(req, res);
  }
});

// Set domain and callback
var domain = "http://localhost:3000";
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
            "http://10.0.0.232:8080/?token=" + token + "&secret=" + token_secret
          );
        }
      }
    );
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
        // console.log(data);
        console.log("*** SUCCESS! ***");
        res.redirect("http://10.0.0.232:8080/");
      }
    }
  );
}

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
