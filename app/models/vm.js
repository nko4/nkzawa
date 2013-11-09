
var mongoose = require('mongoose')
  , check = require('validator').check;


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
  name: {type: String, required: true},
  _creator: {type: ObjectId, ref: 'User', required: true},
  users: [{type: ObjectId, ref: 'User'}],
  created: {type: Date, default: Date.now}
});

var namePath = schema.path('name');
namePath.validate(function(value) {
  try {
    check(value).notEmpty();
  } catch (err) {
    return false;
  }
}, 'empty');

schema.pre('save', function(next) {
  if (this.isNew) {
    this.users.push(this._creator);
  }
  next();
});

module.exports = VM = mongoose.model('VM', schema);

