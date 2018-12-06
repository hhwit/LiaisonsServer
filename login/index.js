var express = require('express');
var app = express();
var parseurl = require('parseurl');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var cache = require('./cache');
var db = require('./database');
var rsa = require('./encrypt');
var captcha = require('./captcha');

const REGISTER = '/cd2d';
const LOGIN = '/phn7';
const CAPTCHA = '/u9s0';

db.init();

app.get(REGISTER+'/:id', function(req, res) {
  db.isUserExist(req.params.id).then((fulfilled) => {
    console.log(fulfilled);
    if (fulfilled) {
      res.json({ 'r': 'id existed' });
    } else {
      var key = rsa.newKey();
      var cap = true;
      var obj = {};
      obj.key = key[1];
      cache.set('register:' + req.params.id, JSON.stringify(obj) , 10).then((fulfilled) => {
        res.json({ 'r': 'success', 'k': key[0] });
      }, (rejected) => {
        console.log('rejected ', rejected);
        res.json({ 'r': 'rejected' });
      });
    }
  }, (rejected) => {
    console.log(rejected);
    res.json({ 'r': 'rejected' });
  });
});

app.get(CAPTCHA+'/:id', function(req, res) {
  cache.get('register:' + req.params.id).then((fulfilled) => {
    if (!fulfilled) {
      res.json({ 'r': 'rejected' });
      return;
    }
    var obj = JSON.parse(fulfilled);
    var cap = captcha.newCaptcha();
    obj.captcha = cap.text;
    cache.set('register:' + req.params.id, JSON.stringify(obj) , 60).then((fulfilled) => {
      res.type('svg');
      res.status(200).send(cap.data);
    }, (rejected) => {
      console.log('rejected ', rejected);
      res.json({ 'r': 'rejected' });
    });
  }, (rejected) => {
    console.log('rejected ', rejected)
    res.json({ 'r': 'rejected' });
  });
});

app.use(REGISTER, bodyParser.json());
app.use(REGISTER, bodyParser.urlencoded({ extended: true }));
 
app.post(REGISTER, function(req, res) {
  console.log('post:' + req.body.id);
  console.log('post:' + req.body.c);
  if (!req.body.id || !req.body.c) {
    res.json({ 'r': 'incorrect post' });
    return;
  }
  cache.get('register:' + req.body.id).then((fulfilled) => {
    if (!fulfilled) {
      res.json({ 'r': 'rejected' });
      return;
    }
    var obj = JSON.parse(fulfilled);
    var mykey = rsa.decrypt(req.body.c, obj.key);
    //console.log('==============' + mykey);
    var mycontent = JSON.parse(mykey);
    if (mycontent.id != req.body.id) {
      res.json({ 'r': 'incorrect id' });
      return;
    }
    if (!mycontent.key) {
      res.json({ 'r': 'incorrect password' });
      return;
    }
    if (!mycontent.cap) {
      res.json({ 'r': 'incorrect captcha' });
      return;
    }
    db.userAdd(mycontent.id, mycontent.key, req.ip).then((fulfilled) => {
      console.log(fulfilled);
      if (fulfilled.serverStatus == 2) {
        res.json({ 'r': 'success' });
        return;
      } else {
        res.json({ 'r': 'saved failed' });
      }
    }, (rejected) => {
      console.log('saved rejected ', rejected);
      res.json({ 'r': 'saved rejected' });
    });
  }, (rejected) => {
    console.log('post rejected ', rejected);
    res.json({ 'r': 'rejected' });
  });
  
});

/* express session test */
/*
var options = {
     "host": "127.0.0.1",
     "port": "6379",
     "prefix": "E7eAc",
     "ttl": 60
};

app.use(session({
  store: new RedisStore(options),
  secret: 'A219e4C2b801c',
  resave: false,
  saveUninitialized: false
}));

app.use(REGISTER, function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }
  req.session.views[REGISTER] = (req.session.views[REGISTER] || 0) + 1;
  next();
});

app.get('/foo', function (req, res, next) {
  console.log('session.id:' + req.session.id);
  console.log('headers.cookie:' + req.headers.cookie);
  console.log(req.session);
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
});
*/

/* listen http */
app.listen(80);
