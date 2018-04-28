var conf = require('./../config/configuration');
var debug = require("debug")("google:tags");
var async = require("async");
var redis = require('./../helpers/redis');
var utils = require('./../helpers/utils');
var googlemap = require('./../helpers/googlemap');
var TagModels = require('./../models/tag');

function findAll(req, res, next) {
  // console.log(" im ma hereadsfas dfasdjflkasjdl");
  var authorization = req.headers['authorization'] || req.query.access_token;
  let page = (req.query.page || 1) - 1

  let limit = parseInt(req.query.limit || 10)
  TagModels.count({
    username: req.username
  }, function(err, count) {
    if (err) {
      return res.send(err)
    } else {
      TagModels.find({
        username: req.username
      }, {
        __v: 0
      }, {
        limit: limit,
        skip: limit * page
      }, function(err, tags) {
        if (err) {
          return res.send(err)
        }
        var next = `http://localhost:3000/location/tag/?limit=${limit}&page=p=${page+1}&access_token=${authorization}`;
        var pervious = `http://localhost:3000/location/tag/?limit=${limit}&page=${(page-1)}&access_token=${authorization}`;
        let pagination = {};
        if (tags && tags.length == limit) {
          pagination.next = next;
        }
        if (page != 0) {
          pagination.pervious = pervious;
        }

        res.send({
          page: page + 1,
          limit: limit,
          tags: tags,
          total: count,
          pagination: pagination
        })
      })
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

  TagModels.findById(req.params.tag_id, function(err, tag) {
    if (err) {
      return res.send(err);
    } else {
      if (!tag) {
        return res.send(500, {
          message: "invalid tag id"
        })
      } else {
        if (tag.placeid) {
          debug("this is my placeid ", tag.placeid)
          googlemap.place({
            placeid: tag.placeid
          }, function(err, location) {
            if (!err) {
              tag["place"] = location
              res.json(tag);
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