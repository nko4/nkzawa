var fs = require('fs');
var ssh = require('./ssh');

exports.key = null;

exports.readKey = function(callback) {
  fs.readFile(__dirname + '/../../docker/id_rsa', function(err, data) {
    exports.key = data;
    callback(err);
  });
};

exports.ssh = function(host, callback) {
  function run() {
    ssh('root', host, exports.key, callback);
  }

  if (exports.key) {
    run();
    return;
  }

  exports.readKey(function(err) {
    if (err) callback(err);
    run();
  });
};
