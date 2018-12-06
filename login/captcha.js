var svgCaptcha = require('svg-captcha');

var codeConfig = {
        size: 4,
        ignoreChars: '0o1i',
        noise: 2,
        height: 44 
};

function newCaptcha() {
  var captcha = svgCaptcha.create(codeConfig);
  //console.log(captcha);
  return captcha;
}

module.exports = {
    newCaptcha: newCaptcha
};
