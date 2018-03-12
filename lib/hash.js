var crypto = require('crypto'),
    hash   = module.exports = {};

hash.config = {
  'sha256': {
    'blocksize' : 64,
    'create'    : function() { return crypto.createHash('sha256'); }
  }
};

hash.hmac = function( algo, msg, key ) {
  /** global: Buffer */
  var C = hash.config[algo].create,
      s = hash.config[algo].blocksize,
      Z = new Buffer(s);
  Z.fill(0);

  if ( key.length > s ) {
    key = C().update(key).digest();
  } else {
    key = Buffer.concat([Buffer.from(key),Z],s);
  }
  var ipad = new Buffer(s),
      opad = new Buffer(s);
  for(var i=0;i<s;i++) {
    ipad[i] = key[i] ^ 0x36;
    opad[i] = key[i] ^ 0x5C;
  }
  var h = C().update(ipad).update(msg).digest();
  return C().update(opad).update(h).digest();
};

Object.keys(hash.config).forEach(function(algo) {
  hash[algo] = function(data) {
    return hash.config[algo].create().update(data).digest();
  };
});
