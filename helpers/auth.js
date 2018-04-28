let async = require('async');
let moment = require('moment');
let Cryptr = require('cryptr');
let BCrypt = require('bcrypt');
var conf = require('./../config/configuration');
let cryptr = new Cryptr(conf.salt); // randrom secret key
let expiryAfterHour = 2;
module.exports = {
  generateToken: function(username, options, cb) {
    var optionParma = {};
    optionParma = options;
    if (!cb) {
      optionParma = {};
      cb = options;
    }
    let starttime = new Date().getTime();
    let ttl = optionParma.ttl ? (optionParma.ttl * 1000) : (expiryAfterHour * 60 * 60 * 1000);
    let expirytime = starttime + ttl;
    let refresh = Boolean(optionParma.refresh);
    var data = {
      username: username,
      stime: starttime,
      ttl,
      etime: expirytime,
      refresh: refresh
    }
    let access_token = cryptr.encrypt(JSON.stringify(data));
    cb(null, {
      access_token,
      ttl: parseInt(ttl / 1000)
    })
  },
  verifyToken: function(access_token, cb) {
    try {
      let decrypt_access_token = cryptr.decrypt(access_token);
      let ac_josn = JSON.parse(decrypt_access_token);
      let requestTime = new Date().getTime();

      let exTime = new Date(ac_josn.etime).toLocaleString();
      let rTime = new Date(requestTime).toLocaleString();
      if (!(requestTime <= ac_josn.etime && requestTime >= ac_josn.stime)) {
        let message = `Error validating access token: Session has expired on ${exTime}. The current time is ${rTime}.`;
        let error = new Error(message);
        error.status = 401;
        cb(error)
      } else {
        cb(null, {
          access_token: access_token,
          expiresIn: parseInt((ac_josn.etime - requestTime) / 1000),
          expiresAt: ac_josn.etime,
          username: ac_josn.username
        })
      }
    } catch (e) {
      console.log(e);
      e.message = "invalid token";
      // cb(new Error(e))
      cb({
        mesage: "invalid token"
      })
    }
  }
}