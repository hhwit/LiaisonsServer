var redis = require("redis");
var client = redis.createClient(6379, 'localhost');

client.on("error", function (err) {
    console.log("Error " + err);
});

function get(key) {
  return new Promise((resovle, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      //console.log("get:" + reply);
      resovle(reply);
    });
  });
}

function set(key, value, expire) {
  return new Promise((resovle, reject) => {
    client.set(key, value, 'EX', expire, (err, reply) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resovle(reply);
    })
  });
}

module.exports = {
    get: get,
    set: set
};
