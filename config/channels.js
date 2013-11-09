var io = require('./io')
  , loginRequired = require('./io-middlewares/login-required')
  , signup = require('../app/channels/signup')


io.connect('/signup', signup.notLoggedIn, function(socket) {
  socket.on('validate', signup.validate);
  socket.on('create', signup.create);
});

