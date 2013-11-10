
var _ = require('lodash')
  , async = require('async')
  , VM = require('../models/vm');


exports.create = function(req, res) {
  var data = _.pick(req.body, 'name');
  data._creator = req.request.user;

  var vm = new VM(data);
  vm.save(function(err, vm) {
    if (err) {
      console.error('Failed to create VM: ', err);
      return res.send(500);
    }
    res.send(vm);
  });
};

exports.index = function(req, res) {
  var conditions = _.pick(req.body, 'name _creator users');
  VM.find(conditions)
    .populate('_creator')
    .populate('users')
    .sort('-created')
    .limit(15)
    .exec(function(err, vms) {
      if (err) return res.send(500);
      res.send(vms);
    });
};

exports.addUser = function(req, res) {
  var vmId = req.params.vmId;
  var data = _.pick(req.body, 'username');
  var User = require('../models/user');

  VM.findById(vmId, function(err, vm) {
    if (err) return res.send(500);
    if (!vm) return res.send(404);

    User.findOne({
      loweredUsername: (data.username || '').toLowerCase()
    }, function(err, user) {
      if (err) return res.send(500);
      if (!user) return res.send(400, 'No user exists');

      if (vm.users.indexOf(user._id) >= 0) {
        res.send(400, 'User already exists');
        return;
      }

      vm.addUser(user._id, function(err, user) {
        if (err) return res.send(500, err.toString());

        res.broadcast.send(user);
      });
    });
  });
};

