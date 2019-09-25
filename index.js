const isBuffer = require('is-buffer');
const EC       = require('elliptic').eddsa;
const ec       = new EC('ed25519');
const shajs    = require('sha.js');

function sha512(message) {
  return shajs('sha512').update(message).digest();
}

function randomBytes(length) {
  return Buffer.from(new Array(length).fill(0).map(()=>Math.floor(Math.random()*256)));
}

// Export helpers
exports._randomBytes    = randomBytes;

exports.createSeed = function(){
  return randomBytes(32);
};

exports.keyPairFrom = function(data) {
  if ('object' !== typeof data) return false;
  if (!data) return false;

  // Attempt fetching sources
  let secretKey = null;
  secretKey     = secretKey || data._secret;
  secretKey     = secretKey || data.pri;
  secretKey     = secretKey || data.priv;
  secretKey     = secretKey || data.private;
  secretKey     = secretKey || data.privatekey;
  secretKey     = secretKey || data.privateKey;
  secretKey     = secretKey || data.sk;
  secretKey     = secretKey || data.sec;
  secretKey     = secretKey || data.secret;
  secretKey     = secretKey || data.secretkey;
  secretKey     = secretKey || data.secretKey;
  let seed      = null;
  seed          = seed || data.seed;
  let publicKey = null;
  publicKey     = publicKey || data.pk;
  publicKey     = publicKey || data.pub;
  publicKey     = publicKey || data.public;
  publicKey     = publicKey || data.publickey;
  publicKey     = publicKey || data.publicKey;

  // Attempt from pre-built secret
  if ('string' === typeof secretKey) return ec.keyFromSecret(secretKey);
  if (isBuffer(secretKey)) return ec.keyFromSecret(secretKey);

  // Given seed = attempt another full keypair
  if ('string' === typeof seed) return exports.createKeyPair(seed);

  // Attempt public-only key
  if ('string' === typeof publicKey) return ec.keyFromPublic(publicKey);
  if (isBuffer(publicKey)) return ec.keyFromPublic(publicKey);

  // We failed
  return null;
};

exports.createKeyPair = async function(seed) {
  const secret = sha512(seed);
  secret[0]    = secret[0] & 248;
  secret[31]   = secret[0] & 63;
  secret[31]   = secret[0] | 64;
  return ec.keyFromSecret([...secret]);
};

exports.sign = async function(message, keypair){
  if ('string' === typeof message) message = Buffer.from(message);
  const signature = keypair.sign(message);
  return Buffer.from(signature.toHex(), 'hex');
};

exports.verify = async function(signature, message, keypair){
  if (!isBuffer(signature)) return false;
  signature = signature.toString('hex');
  return keypair.verify(message, signature);
};
