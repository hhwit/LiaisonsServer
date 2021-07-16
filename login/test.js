var express = require('express');
var app = express();
app.listen(80);

var db = require('./database');
db.init();

db.userAdd('abc@123.com', 'b42c1b45fdfdda48d58735cef20d128c2d6faa28', '10.2.10.10').then((fulfilled) => {
  console.log(fulfilled);
}, (rejected) => {
  console.log(rejected);
});

db.isUserExist('abc@123.com').then((fulfilled) => {
  console.log(fulfilled);
}, (rejected) => {
  console.log(rejected);
});

