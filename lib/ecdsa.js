var elliptic = require('elliptic'),
    hash     = require('./hash'),
    KeyPair  = require('./keypair');

var curves = {
  'secp256k1' : {
    'prilen' : 32,
    'H'      : 'sha256',
    'format' : {
      'pub' : 'ecdsa-sha2-secp256k1 {base64} {comment}',
      'pri' : '-----BEGIN EC PRIVATE KEY-----\n{base64}\n-----END EC PRIVATE KEY-----'
    },
  },
  'p256' : {
    'prilen' : 32,
    'H'      : 'sha256',
    'format' : {
      'pub' : 'ecdsa-sha2-p256 {base64} {comment}',
      'pri' : '-----BEGIN EC PRIVATE KEY-----\n{base64}\n-----END EC PRIVATE KEY-----'
    },
  },
  'p384' : {
    'prilen' : 48,
    'H'      : 'sha384',
    'format' : {
      'pub' : 'ecdsa-sha2-p384 {base64} {comment}',
      'pri' : '-----BEGIN EC PRIVATE KEY-----\n{base64}\n-----END EC PRIVATE KEY-----'
    },
  },
  'p521' : {
    'prilen' : 65,
    'H'      : 'sha512',
    'format' : {
      'pub' : 'ecdsa-sha2-p521 {base64} {comment}',
      'pri' : '-----BEGIN EC PRIVATE KEY-----\n{base64}\n-----END EC PRIVATE KEY-----'
    },
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
  return Buffer.concat([sig.r.toArrayLike(Buffer,'be'),sig.s.toArrayLike(Buffer,'be')]);
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
  return this.ec.verify(msg,{r:sig.slice(0,sig.length/2),s:sig.slice(sig.length/2,sig.length)},pub);
};

/**
 * Return the formatted public key
 *
 * @param {string} [format]
 *
 * @returns {*|string}
 */
EC.prototype.publicFormatted = function( format ) {
  this.kp.getPublic();
  return this.kp.pub.format( format || this.format.pub );
};

/**
 * Return the formatted private key
 *
 * @param {string} [format]
 *
 * @returns {*|string}
 */
EC.prototype.privateFormatted = function( format ) {
  this.kp.getPrivate();
  return this.kp.pri.format( format || this.format.pri );
};

// Some extra exports
EC.KeyPair = KeyPair;
EC.Key     = require('./key');
EC.hash    = require('./hash');
