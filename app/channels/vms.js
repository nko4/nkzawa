
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
