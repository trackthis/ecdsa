const isBuffer = require('is-buffer');
const test     = require('tape');
const Module   = require('./index');

test('Type checks', t => {
  t.plan(6);
  t.is((!!Module) && (typeof Module)   , 'object'  , 'Module is an object');
  t.is(typeof Module._randomBytes   , 'function', 'export helper: _randomBytes');
  t.is(typeof Module.createSeed     , 'function', 'export method: createSeed');
  t.is(typeof Module.createKeyPair  , 'function', 'export method: createKeyPair');
  t.is(typeof Module.sign           , 'function', 'export method: sign');
  t.is(typeof Module.verify         , 'function', 'export method: verify');
});

test('Random bytes generation',async t => {
  t.plan(4);

  const randomBytes32 = await Module._randomBytes(32);
  const randomBytes64 = await Module._randomBytes(64);

  t.is(isBuffer(randomBytes32), true, 'Random32 is a buffer');
  t.is(isBuffer(randomBytes64), true, 'Random64 is a buffer');
  t.is(randomBytes32.length   , 32  , 'Random32 is 32 bytes long');
  t.is(randomBytes64.length   , 64  , 'Random64 is 64 bytes long');
});

test('Key generation',async t => {
  t.plan(6);

  const seed = await Module.createSeed();

  t.is(isBuffer(seed), true, 'Seed is a buffer');
  t.is(seed.length   , 32  , 'Seed\'s length is 32');

  const kp = await Module.createKeyPair(seed);

  t.is(Array.isArray(kp.getPublic()), true, 'Public key is an array');
  t.is(kp.getPublic().length        , 32  , 'Public key\'s length is 32');
  t.is(Array.isArray(kp.getSecret()), true, 'Secret key is a buffer');
  t.is(kp.getSecret().length        , 64  , 'Secret key\'s length is 64');
});

test('Signatures',async t => {
  t.plan(2);

  const seed      = await Module.createSeed();
  const kp        = await Module.createKeyPair(seed);
  const signature = await Module.sign(Buffer.from('hello there m8'), kp);

  t.is(isBuffer(signature), true, 'Signature is a buffer');
  t.is(signature.length   , 64  , 'Signature\'s length is 64 bytes');
});

test('Verify',async t => {
  t.plan(4);

  const seed         = await Module.createSeed();
  const kp           = await Module.createKeyPair(seed);
  const messageBuf   = Buffer.from('hello there m8');
  const messageStr   =             'hello there m8';
  const wrongMessage = await Module._randomBytes(messageBuf.length);

  const signatureBuf = await Module.sign(messageBuf, kp);
  const signatureStr = await Module.sign(messageStr, kp);

  const wrongSeed = await Module.createSeed();
  const wrongKp   = await Module.createKeyPair(wrongSeed);

  t.is(await Module.verify(signatureBuf, messageBuf, kp)     , true , 'Signature verified message');
  t.is(await Module.verify(signatureStr, messageBuf, kp)     , true , 'Signature verified message');
  t.is(await Module.verify(signatureBuf, wrongMessage, kp)   , false, 'Different messaged does not verify');
  t.is(await Module.verify(signatureBuf, messageBuf, wrongKp), false, 'Different public key does not verify');
});
