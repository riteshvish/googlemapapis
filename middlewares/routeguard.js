var auth = require('./../helpers/auth');
var async = require('async');
var redis = require('./../helpers/redis');
var debug = require("debug")("google:routeguard:middlewares");

module.exports = {
  secure: function(req, res, next) {
    var authorization = req.headers['authorization'] || req.query.access_token;

    if (!authorization) {
      res.status(401).send({
        message: "unauthorized user"
      })
    } else {
      var check = {};
      check.auth = function(cb) {
        auth.verifyToken(authorization, function(err, data) {
          if (err) {
            // incase authorization is expired but not deleted from cache
            redis.del(authorization)
          }
          if (data) {
            req.username = data.username;
          }
          cb(err, data)
        })
      }
      check.checkinradis = function(cb) {
        redis.get(authorization, function(err, valid) {
          if (err) {
            return cb(err);
          } else if (!valid) {
            return cb({
              mesage: "Access token expired"
            })
          } else {
            debug("found token in redis");
            cb(null, valid)
          }
        })
      }
      async.parallel(check, function(err, results) {
        if (err) {
          // console.log(err.message, " my eoor");
          res.status(401).send(err.message ? {
            message: err.message
          } : err)
          // var err = new Error(err.message || 'You must be logged in.');
          // err.status = 401;
          // next(err)
        } else {
          next()
        }
      })
    }
  }
}