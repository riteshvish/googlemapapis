var googlemap = require('./../helpers/googlemap');
var debug = require("debug")("google:commonController");

module.exports = {
  findAll: function(Models, options, cb) {
    Models.count({
      username: options.username
    }, function(err, count) {
      if (err) {
        return cb(err)
      } else {
        Models.find({
          username: options.username
        }, {
          __v: 0
        }, {
          limit: options.limit,
          skip: options.limit * options.page
        }, function(err, list) {
          if (err) {
            return cb(err)
          } else {
            var next = `http://localhost:3000/location/${options.type}/?limit=${options.limit}&page=${options.page+2}&access_token=${options.authorization}`;
            var pervious = `http://localhost:3000/location/${options.type}/?limit=${options.limit}&page=${(options.page)}&access_token=${options.authorization}`;
            let pagination = {};
            if (list && list.length == options.limit && (options.page * options.limit !== count)) {
              pagination.next = next;
            }
            if (options.page != 0) {
              pagination.pervious = pervious;
            }

            return cb(null, {
              page: options.page + 1,
              limit: options.limit,
              list: list,
              total: count,
              pagination: pagination,
              type: options.type
            })
          }
        })
      }
    })
  },
  findOne: function(Models, options, cb) {
    console.log(options);
    Models.findById(options.id, function(err, list) {
      if (err) {
        return cb(err);
      } else {
        if (!list) {
          return cb({
            message: `invalid ${options.type} id`
          })
        } else {
          if (list.placeid) {
            debug("this is my placeid ", list.placeid)
            googlemap.place({
              placeid: list.placeid
            }, function(err, location) {
              if (!err) {
                list["place"] = location;
                cb(null, list);
              } else {
                cb(err);
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
}