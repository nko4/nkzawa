
var passport = require('passport')
  , User = require('../models/user');


exports.login = function(req, res) {
  if (req.user) {
    res.redirect('/');
    return;
  }

  res.redirect('/auth/github');
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.signup = function(req, res) {
  if (req.user) return res.redirect('/');

  var passport = req.session.passport
    , userId = passport ? passport._user : null;

  passport.deserializeUser(userId, function(err, user) {
    if (!user) {
      return res.redirect('/login');
    }

    res.render('signup', {
      user: user,
      usernameMaxLength: User.USERNAME_MAX_LEN
    });
  });
};

exports.github = passport.authenticate('github');
exports.githubCallback = passport.authenticate('github', {failureRedirect: '/login'});

exports.successCallback = function(req, res) {
  if (req.user && req.user.username) {
    res.redirect('/');
    return;
  }

  var sessionPassport = req.session.passport;
  sessionPassport._user = sessionPassport.user
  req.logout();
  res.redirect('/signup');
};

