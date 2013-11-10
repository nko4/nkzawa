
var mongoose = require('mongoose')
  , net = require('net')
  , check = require('validator').check
  , docker = require('docker.io')()
  , jsonSelect = require('mongoose-json-select')
  , root = require('../utils/root')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var OPTIONS = {
  Image: 'nkzawa/ubuntu-sshd',
  Cmd: [],
  Memoty: 1024 * 1024 * 1024 // 1GB
};

var schema = new Schema({
  name: {type: String, required: true},
  _creator: {type: ObjectId, ref: 'User', required: true},
  users: [{type: ObjectId, ref: 'User'}],
  containerId: String,
  containerData: Object,
  created: {type: Date, default: Date.now, index: true}
});

schema.index({name: 1, created: -1});

schema.plugin(jsonSelect, 'name _creator users created');

var namePath = schema.path('name');
namePath.validate(function(value) {
  try {
    check(value).notEmpty();
  } catch (err) {
    return false;
  }
}, 'empty');

schema.pre('save', function(next) {
  if (!this.isNew) return next();

  var self = this;
  this.createContainer(function(err) {
    if (err) return next(err);

    self.startContainer(function(err) {
      if (err) return next(err);

      self.addUser(self._creator, true, next);
    });
  });
});

schema.virtual('host').get(function() {
  return this.containerData ? this.containerData.NetworkSettings.IPAddress : null;
});

schema.methods.addUser = function(userId, isSudoer, callback) {
  if ('function' == typeof isSudoer) {
    callback = isSudoer;
    isSudoer = false;
  }

  if (this.users.indexOf(userId) >= 0) {
    callback(new Error('User already exists'));
    return;
  }

  var User = require('./user')
    , self = this;

  User.findById(userId, function(err, user) {
    if (err) return callback(err);
    if (!user) return callback(new Error('No user exists'));
    if (!self.host) return callback(new Error('Vm doesn\'t start'));

    root.ssh(self.host, function(err, ssh) {
      if (err) return callback(err);

      ssh.addUser(user, isSudoer, function(err) {
        if (err) return callback(err);

        self.users.push(user);
        callback(null, user);
      });
    });
  });
};

schema.methods.createContainer = function(callback) {
  if (this.containerId) {
    throw new Error('containerId already exists.');
  }

  var self = this;
  docker.containers.create(OPTIONS, function(err, data) {
    if (err) return callback(err);

    self.containerId = data.Id;
    callback();
  });
};

schema.methods.startContainer = function(callback) {
  var self = this;

  docker.containers.start(this.containerId, function(err, data) {
    if (err) return callback(err);

    self.inspectContainer(function(err, data) {
      if (err) return callback(err)

      self.containerData = data;
      self._checkPort(callback);
    });
  });
};

schema.methods.inspectContainer = function(callback) {
  docker.containers.inspect(this.containerId, function(err, data) {
    callback(err, data);
  });
};

schema.methods._checkPort = function(callback, count) {
  count = count || 0;

  var socket = new net.Socket()
    , self = this;

  socket.on('error', function(err) {
    if (count > 10) {
      callback(new Error('checking port failed'));
      return;
    }

    setTimeout(function() {
      self._checkPort(callback, count + 1);
    }, 50);
  });

  socket.connect(22, this.host, function() {
    socket.destroy();
    callback();
  });
};

module.exports = VM = mongoose.model('VM', schema);

