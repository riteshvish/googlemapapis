var LocationModels = require('./../models/location');
var conf = require('./../config/configuration');
var debug = require("debug")("google:location");
var async = require("async");
var redis = require('./../helpers/redis');
var googlemap = require('./../helpers/googlemap');
var utils = require('./../helpers/utils');

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
  LocationModels.count({
    username: req.username
  }, function(err, count) {
    if (err) {
      return res.send(err)
    } else {
      LocationModels.find({
        username: req.username
      }, {
        __v: 0
      }, {
        limit: limit,
        skip: limit * page
      }, function(err, location) {
        if (err) {
          return res.send(err)
        }
        var next = `http://localhost:3000/location/search/list/?limit=${limit}&page=${page+2}&access_token=${authorization}`;
        var pervious = `http://localhost:3000/location/search/list/?limit=${limit}&page=${(page)}&access_token=${authorization}`;
        let pagination = {};
        if (location && location.length == limit) {
          pagination.next = next;
        }
        if (page != 0) {
          pagination.pervious = pervious;
        }

        res.send({
          page: page + 1,
          limit: limit,
          location: location,
          total: count,
          pagination: pagination
        })
      })
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