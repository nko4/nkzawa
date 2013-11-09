var mongoose = require('mongoose')
  , env = require('./env')
  , plugins = require('../app/models/plugins');

mongoose.connect(env.mongodb);
mongoose.plugin(plugins.defaults);
