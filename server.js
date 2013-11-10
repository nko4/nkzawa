// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('-0bPuXchfHpC9IBi');

require('./config/mongodb');
require('./config/auth');
require('./config/app');
require('./config/routes');
require('./config/io');
require('./config/channels');

var server = require('./config/server')
  , env = require('./config/env')
  , port = env.ports.app;

server.listen(port, function(err) {
  if (err) { console.error(err); process.exit(-1); }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});

