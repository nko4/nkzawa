
module.exports = function(schema, options) {
  // fix bug of mongoose with `minimize`
  schema.set('toObject', {getters: true, minimize: false});
  schema.set('toJSON', {getters: true, minimize: false});
};
