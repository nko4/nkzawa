
exports.vmId = function(req, res, next, vmId) {
  next();
};

exports.new = function(req, res) {
  res.render('vms/new', {
    settings: JSON.stringify({
      user: req.user
    })
  });
};
