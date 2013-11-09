var express = require('express')
  , redis = require('redis')
  , util = require('util')
  , RedisStore = require('connect-redis')(express);


exports.ports = {
  app: 80
};

exports.mongodb = {
  host: 'localhost',
  database: 'vmchat',
  toString: function() {
    return util.format('mongodb://%s/%s', this.host, this.database)
  }
};

exports.redis = {
  db: 0
};

exports.logFormat = 'dev';

exports.auth = {
  github: {
    clientID: 'c0f80da9fc4605e320e6',
    clientSecret: '1fa424877281b3d8e5e58a5091bd3142d53cd465',
    callbackUrl: 'http://localhost/auth/github/callback'
  }
};

exports.session = {
  store: new RedisStore(),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

exports.signal = {
  adapter: null
};
                                            signal.io
