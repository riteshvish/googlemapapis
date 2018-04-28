var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  placeid: {
    type: String,
    required: true
  },
  place: Object,
  created_at: {
    type: Date,
    default: Date.now
  },
});


module.exports = mongoose.model('Favorite', FavoriteSchema);