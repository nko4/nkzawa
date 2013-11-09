
exports.index = function(req, res) {
  res.render('index', {
    settings: JSON.stringify({
      user: req.user
    })
  });
};
