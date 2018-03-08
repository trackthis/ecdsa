var template = require('./template');

var Key = module.exports = function( initialData ) {
  this.comment = false;
  this.data    = Buffer.isBuffer(initialData) ? initialData : new Buffer(0);
};

// Supports PEM & SSH formats
Key.from = function( encodedData ) {
  if ( encodedData.data ) {
    encodedData = encodedData.data;
  }
  if (Buffer.isBuffer(encodedData)) {
    return new Key(encodedData);
  }
  if ( 'string' !== typeof encodedData ) {
    return new Key();
  }
  encodedData = encodedData.split('\r\n').join('\n');
  encodedData = encodedData.split('\r').join('\n');
  var re         = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
      key        = new Key(),
      tokens     = encodedData.split('\n').filter(function (line) {
    return line.substr(0, 1) !== '-';
  }).join('').split(' ');
  if ( tokens.length >= 3 ) {
    key.comment = tokens[2];
  }
  if (tokens.length === 1 && re.test(tokens[0])) {
    key.data = Buffer.from(tokens[0],'base64');
    return key;
  }
  if (tokens.length < 2) {
    return false;
  }
  if (re.test(tokens[1])) {
    key.data = Buffer.from(tokens[1],'base64');
    return key;
  }
  return false;
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
