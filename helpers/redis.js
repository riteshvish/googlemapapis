var redis = require("redis"),
  client = redis.createClient();
var debug = require("debug")("google:redis");


client.on('connect', () => {
  debug(`connected to redis`);
});
client.on('error', err => {
  debug(`Error: ${err}`);
});

module.exports = client;