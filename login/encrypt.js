const NodeRSA = require('node-rsa');

function newKey() {
  const key = new NodeRSA({b: 512});
  const publicKey = key.exportKey('pkcs8-public');
  //console.log('publicKey:', publicKey);
  const privateKey = key.exportKey('pkcs8-private');
  //console.log('privateKey:', privateKey);
  return [publicKey, privateKey];
}

function decrypt(content, key) {
  //console.log('hhw' + content);
  //console.log('hhw' + key);
  var key = NodeRSA(key,'pkcs8-private');
  return key.decrypt(content, 'utf8');
}

module.exports = {
    newKey: newKey,
    decrypt: decrypt
};
