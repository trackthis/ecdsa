var Key = require('./key');

var KeyPair = module.exports = function() {
  this.pub = new Key();
  this.pri = new Key();
};
