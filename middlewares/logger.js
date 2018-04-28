var debug = require("debug")("google:logger");
var fs = require("fs")

var fileName = function() {
  var d = new Date();
  d.setMinutes(0)
  d.setSeconds(0)
  return (new Date(d)).toString().replace(/\s/gi, "_")
}
module.exports = {
  log: function(req, res, next) {
    const start = Date.now();
    req.time = start;
    res.once('finish', () => {
      var elapsedMS = Date.now() - start
      var data = {
        "status": res.statusCode,
        "message": res.statusMessage,
        "content-length": res._headers["content-length"],
        "host": res.req.headers["host"],
        "ip": res.req.ip,
        "method": res.req.method,
        "url": res.req.url,
        "user-agent": res.req.headers["user-agent"],
        "request-time": res.req.time,
        "respond-time": start + elapsedMS,
        "elapse-time": elapsedMS
      }
      var file = './log/' + fileName() + '.log';
      var text = JSON.stringify(data) + ',\r\n';
      fs.appendFile(file, text, function(err) {
        // if (err) return console.log(err);
        // console.log('successfully appended "' + text + '"');
      });

    });
    next();
  }
}