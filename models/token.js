var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  ttl: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'active'
  },
  ip: String
});


module.exports = mongoose.model('Token', TokenSchema);