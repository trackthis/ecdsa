var template = require('./template');

var Key = function() {
  this.comment = false;
  this.data    = new Buffer(0);
};

Key.prototype.pem = function( newData ) {
  var key = this;
  if ( ( 'string' === typeof newData ) && newData.length ) {
    var tokens = newData.split('\n').filter(function(token) {
      return ( token.trim().length > 0 ) && ( token.substr(0,1) !== '-' );
    });
    if ( tokens.length === 1 ) {
      key.data = Buffer.from(tokens[0],'base64');
    }
  }
  return template('-----BEGIN EC PRIVATE KEY-----\n{data}\n-----END EC PRIVATE KEY-----\n')({
    comment : key.comment || '',
    data    : key.data.toString('base64'),
  });
};

Key.prototype.ssh = function( newData ) {
  var key = this;
  if ( ( 'string' === typeof newData ) && newData.length ) {
    var tokens = newData.split(' ').filter(function(token) {
      return ( token.trim().length > 0 );
    });
    if ( tokens.length >= 3 ) key.comment = tokens[2];
    if ( tokens.length >= 2 ) key.data    = Buffer.from(tokens[1],'base64');
  }
  return template('ecdsa-sha2-secp256k1 {data} {comment}')({
    comment : key.comment || '',
    data    : key.data.toString('base64'),
  });
};
