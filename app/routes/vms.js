var VM = require('../models/vm');

exports.vmId = function(req, res, next, vmId) {
  VM.findById(vmId)
    .populate('_creator')
    .populate('users')
    .exec(function(err, vm) {
      if (err) return next(err);
      if (!vm) return res.send(404);

      req.params.vm = vm;
      next();
    });
};

exports.new = function(req, res) {
  res.render('vms/new', {
    settings: JSON.stringify({
      user: req.user
    })
  });
};

exports.show = function(req, res) {
  res.render('vms/show', {
    vm: req.params.vm,
    settings: JSON.stringify({
      user: req.user,
      vm: req.params.vm
    })
  });
};
