var conf = require('./../config/configuration');
var debug = require("debug")("google:tags");
var async = require("async");
var redis = require('./../helpers/redis');
var utils = require('./../helpers/utils');
var googlemap = require('./../helpers/googlemap');
var TagModels = require('./../models/tag');
var commonController = require('./common');

function findAll(req, res, next) {
  // console.log(" im ma hereadsfas dfasdjflkasjdl");
  var authorization = req.headers['authorization'] || req.query.access_token;
  let page = (req.query.page || 1) - 1

  let limit = parseInt(req.query.limit || 10)
  commonController.findAll(TagModels, {
    page: page,
    limit: limit,
    type: "tag",
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
  var tag = new TagModels({
    username: req.username,
    name: req.body.name,
    placeid: req.body.placeid
  });
  // tag.name = req.body.name + " afds";
  tag.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        message: 'Tag created Successfully'
      });
    }
  });
}

function findOne(req, res, next) {

  commonController.findOne(TagModels, {
    id: req.params.tag_id,
    type: "tag"
  }, function(err, data) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(data);
    }
  })
}


function update(req, res, next) {
  // use our tag model to find the tag we want
  TagModels.findById(req.params.tag_id, function(err, tag) {
    if (err) {
      res.send(err);
    } else {
      tag.name = req.body.name; // update the tags info
      // save the tag
      tag.save(function(err) {
        if (err) {
          return res.send(err);
        } else {
          return res.json({
            message: 'Tag updated!'
          });
        }
      });
    }
  });
}

function deletetag(req, res, next) {
  TagModels.remove({
    _id: req.params.tag_id
  }, function(err, tag) {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        message: 'Tag Successfully Deleted'
      });
    }
  });
}

////////////////////////////////////////////

var self = {
  create: create,
  findAll: findAll,
  findOne: findOne,
  update: update,
  deletetag: deletetag
};

module.exports = self;