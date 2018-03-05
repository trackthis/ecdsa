var crypto = require('crypto'),
    hash   = module.exports = {};

hash.hmac = function( algo, msg, key ) {
  /** global: Buffer */
  var H = hash[algo],
      s = H(msg),
      Z = new Buffer(s.length);
  Z.fill(0);
  if ( key.length > s.length ) {
    key = H(key);
  } else {
    Buffer.concat([Buffer.from(key),Z],s.length);
  }
  var ipad = new Buffer(s.length),
      opad = new Buffer(s.length);
  for(var i=0;i<s.length;i++) {
    ipad[i] = key[i] ^ 0x36;
    opad[i] = key[i] ^ 0x5C;
  }
  return H(Buffer.concat([opad,H(Buffer.concat([ipad,Buffer.from(msg)]))]));
};

hash.sha256 = function( data ) {
  return crypto.createHash('sha256').update(data).digest();
};
