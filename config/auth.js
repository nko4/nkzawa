var url = require('url')
  , passport = require('passport')
  , Strategy = require('passport-github').Strategy
  , env = require('./env')
  , User = require('../app/models/user');


passport.serializeUser(function(user, callback) {
  callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
  User.findById(id, function(err, user) {
    callback(err, user);
  });
});

var strategy = new Strategy(env.auth.github, function(accessToken, refreshToken, profile, callback) {
  User.saveGithubUser(accessToken, refreshToken, profile, function(err, user) {
    callback(err, user);
  });
});

passport.use(strategy);
