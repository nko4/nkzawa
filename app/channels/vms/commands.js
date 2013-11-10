
var _ = require('lodash')
  , async = require('async')
  , VM = require('../../models/vm')
  , Command = require('../../models/command');


exports.ssh = function(socket, next) {
  var vmId = socket.params.vmId;
  var user = socket.request.user;

  if (!user) return next();

  VM.findById(vmId, function(err, vm) {
    if (err) return next(err);
    if (vm.users.indexOf(user._id) < 0) {
      next();
      return;
    }

    user.ssh(vm.host, function(err, ssh) {
      if (err) return next(err);

      socket.on('disconnect', function() {
        // exit ssh on disconnect.
        ssh.end();
      });

      ssh.shell(function(err, shell) {
        if (err) return next(err);

        socket.shell = shell;

        shell.on('data', function(chunk, extended) {
          chunk = chunk.toString();

          socket.nsp.emit('output', {
            user: user,
            data: chunk
          });
        });

        next();
      });
    });
  });
};

exports.write = function(req, res) {
  var data = _.pick(req.body, 'command');
  data._vm = req.params.vmId;
  data._creator = req.request.user;

  var command = new Command(data);
  req.socket.shell.write(command.command + '\n');
};

exports.index = function(req, res) {
  var conditions = {_vm: req.params.vmId};

  Command.find(conditions)
    .populate('_creator')
    .sort('-created')
    .limit(25)
    .exec(function(err, commands) {
      if (err) return res.send(500);
      commands.reverse();
      res.send(commands);
    });
};
