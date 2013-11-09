
var _ = require('lodash')
  , async = require('async')
  , Command = require('../../models/command');


exports.exec = function(req, res) {
  var data = _.pick(req.body, 'command');
  data._vm = req.params.vmId;
  data._creator = req.request.user;

  var command = new Command(data);
  command.save(function(err, command) {
    if (err) {
      console.error('Failed to create command:', err);
      return res.send(500);
    }

    command.setValue('_creator', req.request.user);
    res.broadcast.send(command);
  });
};

exports.index = function(req, res) {
  var conditions = {_vm: req.params.vmId};

  Command.find(conditions)
    .populate('_creator')
    .sort('-created')
    .limit(25)
    .exec(function(err, commands) {
      if (err) return res.send(500);
      res.send(commands);
    });
};
