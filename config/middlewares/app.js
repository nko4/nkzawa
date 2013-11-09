
module.exports = function(req, res, next) {
  res.locals({
    user: req.user,
    session: req.session
  });
  next();
};
