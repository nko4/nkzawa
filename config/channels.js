var io = require('./io')
  , loginRequired = require('./io-middlewares/login-required')
  , signup = require('../app/channels/signup')
  , vms = require('../app/channels/vms')
  , commands = require('../app/channels/vms/commands');


io.connect('/signup', signup.notLoggedIn, function(socket) {
  socket.on('validate', signup.validate);
  socket.on('create', signup.create);
});

io.connect('/vms', function(socket) {
  socket.on('create', loginRequired, vms.create);
  socket.on('index', vms.index);
});

io.connect('/vms/:vmId/commands', commands.ssh, function(socket) {
  socket.on('write', loginRequired, commands.write);
  socket.on('index', commands.index);
});
