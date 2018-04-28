var LocationModels = require('./../models/location');
var conf = require('./../config/configuration');
var debug = require("debug")("google:location");
var async = require("async");
var redis = require('./../helpers/redis');
var googlemap = require('./../helpers/googlemap');
var utils = require('./../helpers/utils');
var commonController = require('./common');


var googleMapsClient = require('@google/maps').createClient({
  key: conf.google.mapkey
});

function search(req, res, next) {
  debug(req.query.text);
  if (!req.query.text) {
    return res.status(400).json({
      message: "Please send search text"
    })
  } {
    var locationModels = new LocationModels();
    var searchText = req.query.text;
    req.query.text = searchText.toLowerCase();
    googlemap.search(req.query.text, function(err, location) {
      if (err) {
        return res.send(err)
      } else {
        locationModels.username = req.username;
        locationModels.searchText = searchText;
        locationModels.save()
        return res.json(location);
      }

    })
  }
}

function findAll(req, res, next) {
  var authorization = req.headers['authorization'] || req.query.access_token;
  let page = (req.query.page || 1) - 1
  let limit = parseInt(req.query.limit || 10)
  commonController.findAll(LocationModels, {
    page: page,
    limit: limit,
    type: "search",
    authorization: authorization,
    username: req.username
  }, function(err, data) {
    if (err) {
      return res.send(500, err)
    } else {
      console.log("here");
      res.send(data)
    }
  })
}

function analytics(req, res, next) {
  req.query.username = req.username;
  LocationModels.analytics(req.query, function(err, data) {
    if (err) {
      res.send(500, err)
    } else {
      res.send(data)
    }
  })
}


////////////////////////////////////////////

var self = {
  findAll: findAll,
  analytics: analytics,
  // findOne: findOne,
  // update: update,
  // deletebear: deletebear,
  search: search
};

module.exports = self;