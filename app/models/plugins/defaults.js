
module.exports = function(schema, options) {
  schema.set('toObject', {getters: true});
  schema.set('toJSON', {getters: true});
};
