
var _ = require('lodash')
  , async = require('async')
  , VM = require('../models/vm');


exports.create = function(req, res) {
  var data = _.pick(req.body, 'name');
  data._creator = req.request.user;

  var vm = new VM(data);
  vm.save(function(err, vm) {
    if (err) return res.send(500);
    res.send(vm);
  });
};

