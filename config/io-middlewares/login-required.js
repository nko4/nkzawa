
module.exports = function(req, res, next) {
  if (!req.request.user) {
    res.send(401);
    return;
  }

  next();
};


