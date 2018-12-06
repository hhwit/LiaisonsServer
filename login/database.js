var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '887141',
  database : 'liaisons'
});

/* database initialization */
function init() {
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
    return;
  }
    console.log('connected as id ' + connection.threadId);
  });
  console.log('databaseInit end');
};

function deinit() {
  connection.end();
}

function userAdd(userid, password, ip) {
  return new Promise((resovle, reject) => {
    var cmd = 'insert into users(userid,password,created_time,last_login_ip,last_login_time) values(' +
              '\'' + userid + '\',' +
              '\'' + password + '\',' +
              new Date().getTime() / 1000 + ',' +
              '\'' + ip + '\',' +
              new Date().getTime() / 1000 +
              ')';
    //console.log(cmd);
    connection.query(cmd, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      //console.log(results);
      resovle(results);
    });
  });
}

async function userDel(userid) {
}

async function updateLoginInfo(loginip) {
}

function isUserExist(user) {
  return new Promise((resovle, reject) => {
    connection.query('select * from users where userid=\'' + user + '\'', function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(results);
        resovle(results.length==0?false:true);
      }
    });
  });
}

async function verifyPassword(userid, password) {
}

async function count() {
}

module.exports = {
    init: init,
    deinit: deinit,
    userAdd: userAdd,
    userDel: userDel,
    isUserExist: isUserExist,
};
