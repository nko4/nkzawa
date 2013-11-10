var User = require('../models/user');

exports.userId = function(req, res, next, userId) {
  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    req.params.user = user;
    next();
  });
};

exports.show = function(req, res) {
  res.render('users/show', {
    _user: req.params.user,
    settings: JSON.stringify({
      user: req.user,
      _user: req.params.user
    })
  });
};
