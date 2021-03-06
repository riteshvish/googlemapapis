var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaveSchema = new Schema({
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


module.exports = mongoose.model('Usersavedlocation', SaveSchema);