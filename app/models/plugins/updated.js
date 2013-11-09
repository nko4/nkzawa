
module.exports = function(schema, options) {
  schema.add({updated: {type: Date, default: Date.now}});

  schema.pre('save', function(next) {
    this.updated = new Date();
    next();
  });
};
