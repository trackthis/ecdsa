var crypto = require('crypto'),
    hash   = module.exports = {};

hash.hmac = function( algo, msg, key ) {
  var H = hash[algo],
      s = H(msg),
      Z = new Buffer(s.length);
  zbuf.fill(0);
  if ( key.length > s.length ) {
    key = H(key);
  } else {
    Buffer.concat([key,Z],s.length);
  }
  var ipad = new Buffer(s.length),
      opad = new Buffer(s.length);
  for(var i=0;i<s.length;i++) {
    ipad[i] = key[i] ^ 0x36;
    opad[i] = key[i] ^ 0x5C;
  }
  return H(opad.concat(H(ipad.concat(msg))));
};

hash.sha256 = function( data ) {
  return crypto.createHash('sha256').update(data).digest();
};
