var auth = require('./auth');
var async = require('async');
var redis = require('./redis');
var debug = require("debug")("google:utils:helper");
module.exports = {
  createtoken: function(key, options, cb) {
    var username = key;
    var ttl = 12000;
    var optionParma = null
    optionParma = options;
    if (!cb) {
      optionParma = {
        ttl: ttl,
        refresh: false
      };
      cb = options;
    }
    auth.generateToken(username, optionParma,
      function(err, token) {
        if (err) {
          cb(err)
        } else {
          redis.setex(token.access_token, ttl, true)
          cb(null, token)
        }
      }
    )
  },
  safelyParseJSON: function(json, cb) {
    var parsed
    try {
      parsed = JSON.parse(json)
    } catch (e) {
      debug(e)
    }

    if (cb) {
      cb(null, parsed)
    } else {
      return parsed
    }
  }
}