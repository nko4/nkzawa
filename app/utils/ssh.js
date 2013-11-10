
var fs = require('fs')
  , util = require('util')
  , async = require('async')
  , Connection = require('ssh2');

// TODO: escape

module.exports = connect;

function connect(username, host, key, callback) {
  callback = callback || function() {};

  var ssh = new SSH(username, host, key);
  ssh.connect(function(err) {
    if (err) return callback(err);

    callback(null, ssh);
  });
}


function SSH(username, host, key) {
  this.username = username;
  this.host = host;
  this.key = key;
  this.connection = new Connection();
}

SSH.prototype.connect = function(callback) {
  callback = callback || function() {};

  var self = this;
  var listener = function(err) {
    self.connection.removeListener('ready', listener);
    self.connection.removeListener('close', listener);
    self.connection.removeListener('error', listener);
    callback(err);
  };

  this.connection.on('ready', listener);
  this.connection.on('close', listener);
  this.connection.on('error', listener);

  this.connection.connect({
    host: this.host,
    port: 22,
    username: this.username,
    privateKey: this.key
  });
}

SSH.prototype.exec = function() {
  return this.connection.exec.apply(this.connection, arguments);
};

SSH.prototype.execWait = function(command, options, callback) {
  if ('function' === typeof options) {
    callback = options;
    options = {};
  }

  return this.connection.exec(command, options, function(err, stream) {
    if (err) return callback(err);

    var data = '';
    stream.on('data', function(chunk) {
      data += chunk;
    });
    stream.on('exit', function(err) {
      callback(err, data);
    });
  });
};

SSH.prototype.shell = function(win, callback) {
  return this.connection.shell.apply(this.connection, arguments);
};

SSH.prototype.end = function() {
  this.connection.end();
};

SSH.prototype.writeFile = function(filename, data, callback) {
  this.connection.sftp(function(err, sftp) {
    if (err) return callback(err);

    function end(err) {
      sftp.end();
      callback(err);
    }

    var stream = sftp.createWriteStream(filename);
    stream.on('error', end);
    stream.end(data, end);
  });
};

SSH.prototype.addUser = function(user, isSudoer, callback) {
  if ('function' == typeof isSudoer) {
    callback = isSudoer;
    isSudoer = false;
  }

  var self = this
    , username = user.username;

  this.execWait('useradd -m -s /bin/bash ' + username, function(err) {
    if (err) return callback(err);

    // enable to connect with ssh
    var sshPath = util.format('/home/%s/.ssh', username)
    self.execWait('mkdir -p ' + sshPath, function(err) {
      if (err) return callback(err);

      async.parallel([
        function(callback) {
          var cmd = util.format('chown %s:%s %s', username, username, sshPath);
          self.execWait(cmd, callback);
        },
        function(callback) {
          self.execWait('chmod 700 ' + sshPath, callback);
        }
      ], function(err) {
        if (err) return callback(err);

        // set authorized_keys
        var keysPath = sshPath + '/authorized_keys';
        self.writeFile(keysPath, user.pubkey, function(err) {
          if (err) return callback(err);

          async.parallel([
            function(callback) {
              var cmd = util.format('chown %s:%s %s', username, username, keysPath);
              self.execWait(cmd, callback);
            },
            function(callback) {
              self.execWait('chmod 600 ' + keysPath, callback);
            }
          ], function(err) {
            if (err) return callback(err);

            if (!isSudoer) {
              callback();
              return;
            }

            // set up sudoers
            var cmd = util.format('echo "%s ALL=(ALL) ALL" >> /etc/sudoers.d/%s', username, username);
            self.execWait(cmd, callback);
          });
        });
      });
    });
  });
};

