// Load the module
var EC = require('./lib/ecdsa');

// Use a certain curve (for example secp256k1)
var alice   = new EC('secp256k1'),
    bob     = new EC('secp256k1'),
    charlie = new EC('secp256k1');

// Generate fresh keypairs
alice.kp.generate();
bob.kp.generate();
charlie.kp.generate();

// Display the keys
console.log('Alice private:', alice.kp.getPrivate().toString('base64'));
console.log('Alice public:', alice.kp.getPublic().toString('base64'));
console.log('Bob private:', bob.kp.getPrivate().toString('base64'));
console.log('Bob public:', bob.kp.getPublic().toString('base64'));
console.log('Charlie private:', charlie.kp.getPrivate().toString('base64'));
console.log('Charlie public:', charlie.kp.getPublic().toString('base64'));

// Exchange public keys between Bob and Alice
alice.kp.setPublic( bob.kp.getPublic(bob.kp.getPrivate()) );
bob.kp.setPublic( alice.kp.getPublic(alice.kp.getPrivate()) );

// Sign a message
var messageFromAlice     = "Hello Bob, this is Alice",
    messageFromBob       = "Hello Alice, this is Bob",
    messageFromCharlie   = "Hello Alice, this is Bob",
    signatureFromAlice   = alice.sign( messageFromAlice ),
    signatureFromBob     = bob.sign(messageFromBob),
    signatureFromCharlie = charlie.sign(messageFromCharlie);

// Verify a signature
console.log("Alice's signature is", bob.verify( messageFromAlice, signatureFromAlice ) ? 'good' : 'bad');
console.log("Bob's signature is", alice.verify( messageFromBob, signatureFromBob ) ? 'good' : 'bad');
console.log("Charlie's signature is", alice.verify( messageFromCharlie, signatureFromCharlie ) ? 'good' : 'bad');
