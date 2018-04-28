var conf = require('./../config/configuration');
var debug = require("debug")("google:googlemap");
var async = require("async");
var redis = require('./redis');
var utils = require('./utils');

var googleMapsClient = require('@google/maps').createClient({
  key: conf.google.mapkey
});

module.exports = {
  search: function(text, cb) {
    redis.get(text, function(err, locationSt) {
      location = utils.safelyParseJSON(locationSt)
      if (location) {
        cb(null, location)
      }
      console.log("");
      googleMapsClient.geocode({
        address: text
      }, function(err, response) {
        debug(err);
        if (!err) {
          cb(null, response.json.results)
          console.log("abut to send respd ");
          redis.set(req.query.text, JSON.stringify(response.json.results), function(err, result) {
            if (err) {
              debug(err);
            } else {
              debug("location saved into cache");
            }
          });
        } else {
          cb(err)
        }
      });
    })
  },
  place: function(data, cb) {
    redis.get(data.placeid, function(err, locationSt) {
      location = utils.safelyParseJSON(locationSt)
      if (location) {
        cb(null, location)
      } else {
        googleMapsClient.place({
          placeid: data.placeid
        }, function(err, response) {
          if (err) {
            cb(err)
          } else {
            cb(err, response.json.result)
            redis.set(req.query.text, JSON.stringify(response.json.result), function(err, result) {})
          }
        });
      }
    })
  }
}