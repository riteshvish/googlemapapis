var conf = require('./../config/configuration');
var debug = require("debug")("google:saves");
var async = require("async");
var redis = require('./../helpers/redis');
var utils = require('./../helpers/utils');
var googlemap = require('./../helpers/googlemap');
var UsersavedlocationModels = require('./../models/usersavedlocation');

function findAll(req, res, next) {
  // console.log(" im ma hereadsfas dfasdjflkasjdl");
  var authorization = req.headers['authorization'] || req.query.access_token;
  let page = (req.query.page || 1) - 1

  let limit = parseInt(req.query.limit || 10)
  UsersavedlocationModels.count({
    username: req.username
  }, function(err, count) {
    if (err) {
      return res.send(err)
    } else {
      UsersavedlocationModels.find({
        username: req.username
      }, {
        __v: 0
      }, {
        limit: limit,
        skip: limit * page
      }, function(err, saves) {
        if (err) {
          return res.send(err)
        }
        var next = `http://localhost:3000/location/save/?limit=${limit}&page=p=${page+1}&access_token=${authorization}`;
        var pervious = `http://localhost:3000/location/save/?limit=${limit}&page=${(page-1)}&access_token=${authorization}`;
        let pagination = {};
        if (saves && saves.length == limit && (page * limit !== count)) {
          pagination.next = next;
        }
        if (page != 0) {
          pagination.pervious = pervious;
        }

        res.send({
          page: page + 1,
          limit: limit,
          saves: saves,
          total: count,
          pagination: pagination
        })
      })
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
        message: 'Tag created Successfully'
      });
    }
  });
}

function findOne(req, res, next) {

  UsersavedlocationModels.findById(req.params.saved_id, function(err, save) {
    if (err) {
      return res.send(err);
    } else {
      if (!save) {
        return res.send(500, {
          message: "invalid save id"
        })
      } else {
        if (save.placeid) {
          debug("this is my placeid ", save.placeid)
          googlemap.place({
            placeid: save.placeid
          }, function(err, location) {
            if (!err) {
              save["place"] = location
              res.json(save);
            } else {
              res.send(err);
            }
          });

        } else {
          res.json(500, {
            message: "no place id found"
          });
        }

      }
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