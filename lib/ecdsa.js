var elliptic = require('elliptic'),
    hash     = require('./hash'),
    KeyPair  = require('./keypair');

var curves = {
  'secp256k1': {
    'prilen' : 32,
    'H'      : 'sha256',
    'pub'    : 'ssh',
    'pri'    : 'pem'
  }
};

var EC = module.exports = function( curve ) {
  if (!curves[curve]) { throw "Curve '"+curve+"' not supported"; }
  Object.assign(this,curves[curve]);
  this.H         = hash[this.H];
  this.ec        = new elliptic.ec(curve);
  this.kp        = new KeyPair();
  this.kp.curve  = curve;
  this.kp.prilen = this.prilen;
};

/**
 * Generate a signature for the message with a given or known key
 *
 * @param data
 * @param {KeyPair|Buffer|Object|String} [key]
 *
 * @return {Buffer}
 */
EC.prototype.sign = function( data, key ) {
  /** global: Buffer */
  var pri = false;
  key = key || this.kp;
  if ( key instanceof KeyPair ) { pri = key.getPrivate(); }
  if ( Buffer.isBuffer(key) ) { pri = key; }
  if ( 'string' === typeof key ) { pri = Buffer.from(key,'base64'); }
  if ( !pri ) { return false; }
  if ( ('string' !== typeof data) && !Buffer.isBuffer(data)) { data = JSON.stringify(data); }
  var msg = this.H(data),
      sig = this.ec.sign(msg,pri);
  return Buffer.concat([sig.r.toArrayLike(Buffer,'be',32),sig.s.toArrayLike(Buffer,'be',32)]);
};

/**
 * Verify the signature for the message with a given or known key
 *
 * @param data
 * @param signature
 * @param key
 *
 * @returns {Buffer}
 */
EC.prototype.verify = function( data, signature, key ) {
  /** global: Buffer */
  var pub = false;
  key = key || this.kp;
  if ( key instanceof KeyPair ) { pub = key.getPublic(); }
  if ( Buffer.isBuffer(key) ) { pub = key; }
  if ( 'string' === typeof key ) { pub = Buffer.from(key,'base64'); }
  if ( ('string' !== typeof data) && !Buffer.isBuffer(data)) { data = JSON.stringify(data); }
  var msg = this.H(data),
      sig = ('string' === typeof signature) ? Buffer.from(signature,'base64') : signature;
  return this.ec.verify(msg,{r:sig.slice(0,32),s:sig.slice(32,64)},pub);
};

// Some extra exports
EC.KeyPair = KeyPair;
EC.Key     = require('./key');
EC.hash    = require('./hash');
