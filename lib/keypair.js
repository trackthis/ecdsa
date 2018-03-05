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
  /** global: Buffer */
  this.pub = new Key();
  this.pri = Key.from(new Buffer(rand(this.prilen)));
};

KeyPair.prototype.setPublic = function(data) {
  if ( ( data instanceof KeyPair ) ) {
    this.pub = Key.from(data.getPublic());
  } else if ( data.pub ) {
    this.pub = Key.from(data.pub);
  } else {
    this.pub = Key.from(data);
  }
};

KeyPair.prototype.getPublic = function( private_key ) {
  /** global: Buffer */
  if ( !this.pub.data.length || private_key ) {
    if ( !this.curve ) { return false; }
    var ec = EC(this.curve);
    if ( private_key ) {
      var pri = Key.from(private_key);
      return Buffer.from(ec.keyFromPrivate(pri.data).getPublic(false,true));
    } else {
      this.pub = Key.from(Buffer.from(ec.keyFromPrivate(this.pri.data).getPublic(false,true)));
    }
  }
  return this.pub.data;
};

KeyPair.prototype.setPrivate = function(data) {
  if ( data instanceof KeyPair ) {
    this.pri = Key.from(data.getPrivate());
  } else if ( data.pri ) {
    this.pri = Key.from(data.pri);
  } else {
    this.pri = Key.from(data);
  }
};

KeyPair.prototype.getPrivate = function() {
  if ( !this.pri.data.length ) { return false; }
  return this.pri.data;
};
