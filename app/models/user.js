var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('lodash')
  , check = require('validator').check
  , jsonSelect = require('mongoose-json-select')
  , keygen = require('ssh-keygen')
  , plugins = require('./plugins')
  , mktmpdir = require('mktmpdir');


var schema = new mongoose.Schema({
  username: String,
  loweredUsername: {type: String, index: true, unique: true, sparse: true, select: false},
  key: {type: String, required: true},
  pubkey: {type: String, required: true},
  github: {
    id: {type: String, index: true, unique: true, sparse: true, select: false},
    accessToken: {type: String, select: false},
    refreshToken: {type: String, select: false},
    avatarUrl: String
  },
  created: {type: Date, default: Date.now}
});

var PUBLIC_PROPS = [
  '_id', 'username', 'created', 'updated', 'avararUrl'
];

schema.plugin(plugins.updated);
schema.plugin(jsonSelect, PUBLIC_PROPS.join(' '));

schema.virtual('avatarUrl').get(function() {
  return this.github ? this.github.avatarUrl : null;
});

usernamePath = schema.path('username');
usernamePath.validate(function(value) {
  if (!value) return true;

  try {
    check(value).is(/^[a-zA-Z0-9_\-]+$/);
  } catch (err) {
    return false;
  }
}, 'alphanumeric');

usernamePath.validate(function(value) {
  if (!value) return true;

  try {
    check(value).len(1, USERNAME_MAX_LEN);
  } catch (err) {
    return false;
  }
}, 'maxLength');

usernamePath.validate(function(username, respond) {
  if (!username) {
    return respond(true);
  }
  if (RESERVED_USERNAMES.indexOf(username) >= 0) {
    return respond(false);
  }

  User
    .findOneByUsername(username)
    .where('_id', {$ne: this._id})
    .select('_id')
    .exec(function(err, user) {
      respond(!err && !user);
    });
}, 'alreadyTaken');


schema.pre('validate', function(next) {
  if (this.isNew) {
    this.keygen(next);
  } else {
    next();
  }
});

schema.pre('save', function(next) {
  if (!this.loweredUsername && this.username) {
    this.loweredUsername = this.username.toLowerCase();
  }

  next();
});

var USERNAME_MAX_LEN = schema.statics.USERNAME_MAX_LEN = 15;
schema.statics.PUBLIC_PROPS = PUBLIC_PROPS;

schema.statics.findOneByUsername = function(username, fields, options, callback) {
  var conditions = {loweredUsername: username.toLowerCase()};
  return this.findOne(conditions, fields, options, callback);
}

schema.statics.saveGithubUser = function(accessToken, refreshToken, profile, callback) {
  profile = profile._json;

  var githubId = profile.id
    , self = this;

  async.waterfall([
    function(callback) {
      var conditions = {'github.id': githubId};
      self.findOne(conditions, function(err, user) {
        callback(err, user);
      });
    },
    function(user, callback) {
       if (user) return callback(null, user);

      user = new User()
      if (!profile.login) {
        callback(null, user);
        return;
      }

      user.schema.path('username').doValidate(profile.login, function(err) {
        if (!err) {
          user.username = profile.login;
        }
        callback(null, user);
      }, user);
    },
    function(user, callback) {
      var github = user.github;
      github.id = githubId;
      github.accessToken = accessToken;
      github.refreshToken = refreshToken;
      if (profile.avatar_url) {
        github.avatarUrl = profile.avatar_url;
      }
      user.save(function(err, user) {
        callback(err, user);
      });
    }
  ], callback);
};

schema.methods.keygen = function(callback) {
  var self = this;

  mktmpdir(function(err, dir, done) {
    if (err) return callback(err);

    keygen({
      location: dir + '/id_rsa',
      password: '',
      read: true
    }, function(err, out) {
      if (err) return done(err);

      self.key = out.key;
      self.pubkey = out.pubKey;
      done();
    });
  }, callback);
};

var User = module.exports = mongoose.model('User', schema);

var RESERVED_USERNAMES = [
  'admin',
  'vmchat',
  'root',
  'daemon',
  'bin',
  'sys',
  'sync',
  'games',
  'man',
  'lp',
  'mail',
  'news',
  'uucp',
  'proxy',
  'www-data',
  'backup',
  'list',
  'irc',
  'gnats',
  'nobody',
  'libuuid',
  'syslog',
  'messagebus',
  'ntp',
  'sshd',
  'vagrant',
  'vboxadd',
  'statd',
  'docker',
  'lxc-dnsmasq',
  'redis',
  'mongodb'
];

