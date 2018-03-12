var template = require('./template');

var Key = module.exports = function( initialData ) {
  this.template = '{base64}';
  this.comment  = '';
  this.data     = Buffer.isBuffer(initialData) ? initialData : new Buffer(0);
};

// Supports PEM & SSH formats
Key.from = function( encodedData ) {
  if ( encodedData && encodedData.data ) {
    encodedData = encodedData.data;
  }
  if (Buffer.isBuffer(encodedData)) {
    return new Key(encodedData);
  }
  if ( 'string' !== typeof encodedData ) {
    return new Key();
  }
  if ( !encodedData ) {
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

Key.prototype.format = function( format ) {
  return template( format || this.template || '{base64}' )({
    'comment'      : this.comment,
    'hex'          : this.data.toString('hex'),
    'hex-limit'    : this.data.toString('hex').match(/(.|[\r\n]){1,64}/g).join('\n'),
    'base64'       : this.data.toString('base64'),
    'base64-limit' : this.data.toString('base64').match(/(.|[\r\n]){1,64}/g).join('\n'),
  });
};
