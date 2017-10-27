const express = require("express");
const jwt = require("jwt-simple");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const config = require("../config");

router.post("/signup", (req, res, next) => {
  // extract the info we need from the body
  // of the request
  const { username, name, password } = req.body;

  // create the new user
  // notice how we don't pass the password because
  // we're letting User.register add the hashed version
  // for us
  const user = new User({
    username,
    name
  });

  User.register(user, password, err => {
    next(err)
    res.json({ success: true });
  });
});

// User.authenticate() returns a function
const authenticate = User.authenticate();
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  // check if we have a username and password
  if (username && password) {
    // test if the credentials are valid
    authenticate(username, password, (err, user, failed) => {
      if (err) {
        // an unexpected error from the database
        return next(err);
      }
      if (failed) {
        // failed logging (bad password, too many attempts, etc)
        return res.status(401).json(failed.message);
      }
      if (user) {
        // success!! Save the user id
        // NEVER save the password here
        // the id is usually enough because we can get back
        // the actual user by fetching the database later
        const payload = {
          id: user.id
        };
        // generate a token and send it
        // this token will contain the user.id encrypted
        // only the server is able to decrypt it
        // for the client, this is just a token, he knows that
        // he has to send it
        const token = jwt.encode(payload, config.jwtSecret);
        res.json({
          token,
          name: user.name
        });
      }
    });
  } else {
    // unauthorized error
    res.status(401).json("username or password missing");
  }
});

router.get('/login/facebook', passport.authenticate('facebook'))
router.get(
  '/login/facebook/callback',
  // TODO failureredirect doesn't make sense here
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const { user } = req
    const payload = {
      id: user.id
    };
    // generate a token and send it
    // this token will contain the user.id encrypted
    // only the server is able to decrypt it
    // for the client, this is just a token, he knows that
    // he has to send it
    const token = jwt.encode(payload, config.jwtSecret);
    const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080'
    // Redirect to client with the token and name
    res.redirect(`${baseURL}/login/callback?token=${token}&name=${encodeURI(user.name)}`)
  }
);

module.exports = router;
