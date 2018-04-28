var conf = require('./../config/configuration');
var debug = require("debug")("google:favorites");
var async = require("async");
var redis = require('./../helpers/redis');
var utils = require('./../helpers/utils');
var googlemap = require('./../helpers/googlemap');
var FavoriteModels = require('./../models/favoritelocation');
var commonController = require('./common');

function findAll(req, res, next) {
  // console.log(" im ma hereadsfas dfasdjflkasjdl");
  var authorization = req.headers['authorization'] || req.query.access_token;
  console.log(authorization, "sadf authorization");
  let page = (req.query.page || 1) - 1
  let limit = parseInt(req.query.limit || 10)
  commonController.findAll(FavoriteModels, {
    page: page,
    limit: limit,
    type: "favorite",
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


function create(req, res, next) {
  var favorite = new FavoriteModels({
    username: req.username,
    placeid: req.body.placeid
  });
  // favorite.name = req.body.name + " afds";
  favorite.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        message: 'favorite created Successfully'
      });
    }
  });
}

function findOne(req, res, next) {
  commonController.findOne(FavoriteModels, {
    id: req.params.favorite_id,
    type: "favorite"
  }, function(err, data) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(data);
    }
  })
}


function deletefavorited(req, res, next) {
  FavoriteModels.remove({
    _id: req.params.favorite_id
  }, function(err, favorite) {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        message: 'Favorite Successfully Deleted'
      });
    }
  });
}

////////////////////////////////////////////

var self = {
  create: create,
  findAll: findAll,
  findOne: findOne,
  deletefavorited: deletefavorited
};

module.exports = self;