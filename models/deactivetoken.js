var mongoose = require('mongoose');

var DeactivetokenSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'deactive'
  },
  ip: String
});

module.exports = mongoose.model('Deactivetoken', DeactivetokenSchema);