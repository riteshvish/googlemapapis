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
  },
  query: Object,
  type: String
});


LocationSchema.pre('save', function(next) {
  var location = this;
  location.text = location.searchText.toLowerCase();
  next();
});


LocationSchema.statics.analytics = function(data, callback) {
  var groupBy = {};
  var filter = []
  if (data.on && typeof data.on == "string") {
    filter = data.on.split(",")
    if (filter.indexOf("date") > -1) {
      filter = filter.concat(["year", "month", "day"])
    }
    if (filter.indexOf("search") > -1) {
      groupBy["search"] = "$text";
    }
    if (filter.indexOf("year") > -1) {
      groupBy["year"] = {
        "$year": "$created_at"
      }
    }
    if (filter.indexOf("month") > -1) {
      groupBy["month"] = {
        "$month": "$created_at"
      }
    }
    if (filter.indexOf("day") > -1) {
      groupBy["day"] = {
        "$dayOfMonth": "$created_at"
      }
    }
  } else {
    groupBy["search"] = "$text";
  }
  if (Object.keys(groupBy).length == 0) {
    groupBy["search"] = "$text";
  }

  Location.aggregate([{
      $match: {
        username: data.username,
        type: "search"
      }
    }, {
      $group: {
        // _id: '$text', //$region is the column name in collection
        "_id": groupBy,
        count: {
          $sum: 1
        }
      }
    }],
    function(err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
}



var Location = mongoose.model('Location', LocationSchema);

module.exports = Location