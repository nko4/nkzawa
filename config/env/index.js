
exports.cookie = {
  secret: 'c0kp3ysvskxm6vty'
};

var env = process.env.NODE_ENV || 'development'
  , params = require('./' + env);

for (var k in params) {
  exports[k] = params[k];
}
