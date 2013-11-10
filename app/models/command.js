
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var schema = new Schema({
  command: {type: String, required: true},
  output: String,
  _vm: {type: ObjectId, ref: 'VM', required: true},
  _creator: {type: ObjectId, ref: 'User', required: true},
  created: {type: Date, default: Date.now, index: true}
});

schema.index({_vm: 1, created: -1});

module.exports = Command = mongoose.model('Command', schema);

