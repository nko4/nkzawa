
var _ = require('lodash')
  , async = require('async')
  , User = require('../models/user');


exports.notLoggedIn = function(socket, next) {
  if (socket.request.user) {
    var err = new Error();
    err.data = new Error();
    err.data.status = 400;
  }
  next(err);
}

exports.validate = function(req, res) {
  var user = new User(_.pick(req.body, 'username'));
  if (!user.username) {
    user.invalidate('username', 'empty');
  }
  user.validate(function(err) {
    var errors = (err ? err.errors : null) || {};
    for (var k in errors) {
      errors[k] = errors[k].type;
    }
    res.send(errors);
  });
};

exports.create = function(req, res) {
  var data = _.pick(req.body, 'username');
  var session = req.session;
  var sessionPassport = (session ? session.passport : null) || {};

  async.waterfall([
    function(callback) {
      User.findById(sessionPassport._user, function(err, user) {
        if (!user) {
          res.send(404);
          return;
        }
        callback(err, user);
      });
    },
    function(user, callback) {
      _.assign(user, data);
      if (!user.username) {
        user.invalidate('username', 'empty');
      }
      user.save(function(err, user) {
        callback(err, user);
      });
    },
    function(user, callback) {
      req.request.login(user, function(err) {
        callback(err, user);
      });
    },
    function(user, callback) {
      delete sessionPassport._user
      session.resetMaxAge();
      session.save(function() {
        callback(null, user);
      });
    }
  ], function(err, user) {
    if (err) return res.send(500);
    res.send(user);
  });
};

