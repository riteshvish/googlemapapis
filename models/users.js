var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var UserSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

// UserSchema.statics.getUserByUsername = function(username, callback) {
//   return this.where('username', username).exec(callback);
// };

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function(data, callback) {
  User.findOne({
      username: data.username
    })
    .exec(function(err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('Invalid username or password');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(data.password, user.password, function(err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          var err = new Error('Invalid username or password');
          err.status = 401;
          return callback(err);
        }
      })
    });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;