var conf = require('./../config/configuration');
var debug = require("debug")("google:saves");
var async = require("async");
var redis = require('./../helpers/redis');
var utils = require('./../helpers/utils');
var googlemap = require('./../helpers/googlemap');
var UsersavedlocationModels = require('./../models/usersavedlocation');
var commonController = require('./common');


function findAll(req, res, next) {
  // console.log(" im ma hereadsfas dfasdjflkasjdl");
  var authorization = req.headers['authorization'] || req.query.access_token;
  let page = (req.query.page || 1) - 1

  let limit = parseInt(req.query.limit || 10)
  commonController.findAll(UsersavedlocationModels, {
    page: page,
    limit: limit,
    type: "save",
    authorization: authorization,
    username: req.username
  }, function(err, data) {
    if (err) {
      return res.send(500, err)
    } else {
      res.send(data)
    }
  })
}


function create(req, res, next) {
  var save = new UsersavedlocationModels({
    username: req.username,
    placeid: req.body.placeid
  });
  // save.name = req.body.name + " afds";
  save.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        message: 'Location Successfully saved'
      });
    }
  });
}

function findOne(req, res, next) {
  commonController.findOne(UsersavedlocationModels, {
    id: req.params.saved_id,
    type: "save"
  }, function(err, data) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(data);
    }
  })
}


function deletesaved(req, res, next) {
  UsersavedlocationModels.remove({
    _id: req.params.saved_id
  }, function(err, save) {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        message: 'Location Successfully Deleted'
      });
    }
  });
}

////////////////////////////////////////////

var self = {
  create: create,
  findAll: findAll,
  findOne: findOne,
  deletesaved: deletesaved
};

module.exports = self;