var io = require('./io')
  , loginRequired = require('./io-middlewares/login-required')
  , signup = require('../app/channels/signup')
  , vms = require('../app/channels/vms');


io.connect('/signup', signup.notLoggedIn, function(socket) {
  socket.on('validate', signup.validate);
  socket.on('create', signup.create);
});

io.connect('/vms', loginRequired, function(socket) {
  socket.on('create', vms.create);
  socket.on('index', vms.index);
});

