var async = require('async');
var conf = require('./../config/configuration');
var UserModel = require('./../models/users');
var TokenModel = require('./../models/token');
var DeactivetokenModel = require('./../models/deactivetoken');
var debug = require("debug")("google:users");
var utils = require("./../helpers/utils")
var auth = require("./../helpers/auth")
var redis = require("./../helpers/redis")


function createtoken(body, cb) {
  utils.createtoken(body.username, function(err, token) {
    if (err) {
      cb(err)
    } else {
      cb(null, token)
    }
  })
}




function savetoken(req, token, cb) {
  var tokenmodel = new TokenModel({
    username: req.body.username,
    token: token.access_token,
    ttl: token.ttl,
    ip: req.ip
  });
  tokenmodel.save(function(err, data) {
    if (err) {
      return cb(err)
    } else {
      return cb(null, {
        // status: data.status,
        token: data.token,
        ttl: data.ttl
      })
    }
  })
}

function login(req, res, next) {
  debug(req.body);
  let body = req.body;
  async.waterfall([
    UserModel.authenticate.bind(null, body),
    createtoken,
    savetoken.bind(null, req)
  ], function(err, data) {
    if (err) {
      res.status(err.status || 500).send({
        message: err.message || "Something went wrong. Please try after few minutes"
      })
    } else {
      res.send(data)
    }
  })
}



function signup(req, res, next) {
  let body = req.body;

  var user = new UserModel(req.body);
  user.save(function(err, data) {
    if (err) {
      debug(err);
      return res.status(400).send({
        message: err.errmsg
      });
    } else {
      return res.json({
        message: 'User created Successfully'
      });
    }
  });
}




var findToken = function(authorization, cb) {
  TokenModel.findOne({
    token: authorization
  }, function(err, token) {
    if (err) {
      return cb(err)
    } else if (!token) {
      redis.del(authorization)
      return cb({
        status: 400,
        mesage: "invalid"
      })
    } else {
      return cb(null, token)
    }
  });
}

var removeToken = function(req, token, cb) {
  debug("remove toek", token)
  var tokenop = {};
  tokenop.remove = function(cb) {
    TokenModel.remove({
      token: token.token,
      "status": "active"
    }, function(err, deletetoken) {
      if (err) {
        cb(err)
      } else {
        redis.del(token.token)
        debug("", deletetoken)
        cb(null, deletetoken)
      }
    });
  }
  tokenop.move = function(cb) {
    debug(" sve ", token)
    delete token._id;
    delete token.status;
    var dToken = new DeactivetokenModel({
      username: token.username,
      token: token.token,
      ttl: token.ttl,
      ip: req.ip
    });
    dToken.save(function(err, deletetoken) {
      if (err) {
        debug(err);
        cb(err)
      } else {
        cb(null, deletetoken)
      }
    });
  }
  async.parallel(tokenop, function(err, results) {
    cb(err, results)
  })
}


function logout(req, res, next) {
  var authorization = req.headers['authorization'];
  async.waterfall([
      findToken.bind(null, authorization),
      removeToken.bind(null, req)
    ],
    function(err, re) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send({
          message: "Successfully logout"
        })
      }
    })
}

function verify(req, res, next) {
  // res.send({
  //   "asd": "asd"
  // })
  var authorization = req.headers['authorization'] || req.query.access_token;
  auth.verifyToken(authorization, function(err, token) {
    if (err) {
      res.send(err)
    } else {
      if (token) {
        delete token.username
      }
      res.send(token)
    }
  })
}

function analytics(req, res, next) {

  res.send({
    message: "analytics"
  })
  // var authorization = req.headers['authorization'] || req.query.access_token;
  // auth.verifyToken(authorization, function(err, token) {
  //   if (err) {
  //     res.send(err)
  //   } else {
  //     if (token) {
  //       delete token.username
  //     }
  //     res.send(token)
  //   }
  // })
}




////////////////////////////////////////////

var self = {
  signup: signup,
  login: login,
  logout: logout,
  verify: verify,
  analytics: analytics
}
module.exports = self;