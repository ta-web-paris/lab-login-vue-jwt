require("dotenv").config();
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const history = require('express-history-api-fallback');

const passport = require("passport");
const User = require("./models/user");
const config = require("./config");
const { Strategy, ExtractJwt } = require("passport-jwt");
const FacebookStrategy = require('passport-facebook').Strategy
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// We don't need cors on production because there we only have 1 server
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      // Only allow the vue application access this server
      origin: "http://localhost:8080"
    })
  );
}

app.use(passport.initialize());
// Create the strategy for JWT
const strategy = new Strategy(
  {
    // this is a config we pass to the strategy
    // it needs to secret to decrypt the payload of the
    // token.
    secretOrKey: config.jwtSecret,
    // This options tells the strategy to extract the token
    // from the header of the request
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  },
  (payload, done) => {
    // payload is the object we encrypted at the route /api/token
    // We get the user id, make sure the user exist by looking it up
    User.findById(payload.id).then(user => {
      if (user) {
        // make the user accessible in req.user
        done(null, user);
      } else {
        done(new Error("User not found"));
      }
    });
  }
);
// tell pasport to use it
passport.use(strategy);

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  // TODO replace by real url in server
  callbackURL: "http://localhost:3000/api/login/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  console.log('Logging in with Facebook')
  console.log('accessToken', accessToken)
  console.log('refreshToken', refreshToken)
  console.log('profile', profile)
  // check if the user is already created
  User.findOne({
    'facebook.id': profile.id
  }).then(user => {
    if (user) return done(null, user)
    // Let's register as a new user
    user = new User({
      facebook: {
        id: profile.id,
        // the accessToken is needed if you want to access extra information on the user
        // In that case we may want to store it
        // we could save more information if we want to
        accessToken
      },
      // make up an username because we need it
      username: `fb__${profile.id}`,
      name: profile.displayName
    });

    User.register(user, "We don't need a password", err => {
      if (err) {
        done(err, null)
      } else {
        done(null, user)
      }
    });
  }).catch(err => done(err))
}));

const authRoutes = require("./routes/auth");

// We populate ourselves req.user because we don't want to
// end up on an error when the authentication fails but rather
// keep user empty
app.use("/api", (req, res, next) => {
  const authenticate = passport.authenticate(
    "jwt",
    config.jwtSession,
    (err, user, fail) => {
      req.user = user;
      next(err);
    }
  );
  authenticate(req, res, next);
});

app.get("/api/me", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json({
      message: "You're not connected"
    });
  }
});

app.use("/api", authRoutes);

// This is an example of protected route
// If the user is not authenticated, he'll be get a 404
// This allows us to keep our routes secret
app.get(
  "/api/secret",
  // this is protecting the route and giving us access to
  // req.user
  ensureLoggedIn(),
  (req, res) => {
    // send the user his own information
    res.json(req.user);
  }
);

// This route is only accessible for non authenticated users
// If the user is not authenticated, he will be redirected to /
app.get(
  "/api/not-secret",
  // this is protecting the route and giving us access to
  // req.user
  ensureLoggedOut(),
  (req, res) => {
    // send the user his own information
    res.json({ message: "Go ahead" });
  }
);

const clientRoot = path.join(__dirname, '../client/dist');
app.use('/', express.static(clientRoot))
app.use(history('index.html', { root: clientRoot }))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.log(err);
  // return the error message only in development mode
  res.json(req.app.get("env") === "development" ? err.message : {});
});

module.exports = app;
