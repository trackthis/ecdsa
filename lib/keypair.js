var EC   = require('elliptic').ec,
    rand = require('secure-random'),
    Key  = require('./key');

var KeyPair = module.exports = function( data ) {
  this.curve  = null;
  this.prilen = null;
  this.pub    = new Key();
  this.pri    = new Key(data);
  if ( data instanceof KeyPair ) {
    this.curve = data.curve;
    this.pub = Key.from(data.pub.data);
    this.pri = Key.from(data.pri.data);
    this.pub.comment = data.pub.comment;
  }
};

KeyPair.prototype.generate = function() {
  this.pub = new Key();
  this.pri = Key.from(new Buffer(rand(this.prilen)));
};

KeyPair.prototype.setPublic = function(data) {
  this.pub = Key.from(data);
};

KeyPair.prototype.getPublic = function() {
  if ( !this.pub.data.length ) {
    if ( !this.curve ) return false;
    var ec = EC(this.curve);
    this.pub = Key.from(Buffer.from(this.ec.keyFromPrivate(this.kp.pri.data).getPublic(false,true)));
  }
  return this.pub.data;
};

KeyPair.prototype.setPrivate = function(data) {
  this.pri = Key.from(data);
};

KeyPair.prototype.getPrivate = function() {
  if ( !this.pri.data.length ) { return false; }
  return this.pri.data;
};
