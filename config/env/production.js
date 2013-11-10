var express = require('express')
  , redis = require('redis')
  , util = require('util')
  , RedisStore = require('connect-redis')(express);


exports.ports = {
  app: 80
};

exports.mongodb = {
  host: 'localhost',
  database: 'vmshare',
  toString: function() {
    return util.format('mongodb://%s/%s', this.host, this.database)
  }
};

exports.redis = {
  db: 0
};

exports.logFormat = 'default';

exports.auth = {
  github: {
    clientID: '024c51319618049d3b2e',
    clientSecret: '3b8fe6f1005f68f547a8dcacdd88f1146faa57b7',
    callbackUrl: 'http://nkzawa.2013.nodeknockout.com/auth/github/callback'
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
