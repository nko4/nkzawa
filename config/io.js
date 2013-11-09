var signal = require('signal.io')
  , ioPassport = require('socket.io-passport')
  , app = require('./app')
  , env = require('./env')
  , server = require('./server');


var io = module.exports = signal(server, {
  adapter: env.signal.adapter
});

io.use(signal.cookieParser(env.cookie.secret));
io.use(signal.session(env.session));
io.use(ioPassport.initialize());
io.use(ioPassport.session());

