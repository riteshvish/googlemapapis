var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  text: String,
  username: String,
  searchText: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});


LocationSchema.pre('save', function(next) {
  var location = this;
  location.text = location.searchText.toLowerCase();
  next();
});


LocationSchema.statics.analytics = function(data, callback) {
  Location.aggregate([{
    $group: {
      _id: 'text', //$region is the column name in collection
      count: {
        $sum: 1
      }
    }
  }], function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}

var Location = mongoose.model('Location', LocationSchema);

module.exports = Location