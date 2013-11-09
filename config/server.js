var http = require('http')
  , app = require('./app');

module.exports = http.createServer(app);
