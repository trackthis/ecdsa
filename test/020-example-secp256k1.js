var path   = require('path'),
    assert = require('assert'),
    fs     = require('fs-extra');

// Defining globals
global.approot = path.dirname(__dirname);
global.co      = require('co');
global.Promise = require('bluebird');

// Load helpers
require('./helpers');

var Mocha = global.Mocha || require('mocha');
var Test  = Mocha.Test;
var Suite = Mocha.Suite;
var mocha = global.mocha || new Mocha();
var suite = Suite.create(mocha.suite,'Running the example');

suite.timeout(60000);

// Generate the file list
co(function* () {
  var scope = {};

  suite.addTest(new Test('EC module is loading - secp256k1', function(done) {
    scope.EC = require('../lib/ecdsa');
    assert.equal(typeof scope.EC,'function');
    done();
  }));

  suite.addTest(new Test('Loading parties', function(done) {
    scope.alice   = new scope.EC('secp256k1');
    scope.bob     = new scope.EC('secp256k1');
    scope.charlie = new scope.EC('secp256k1');
    assert.equal(typeof scope.alice  ,'object');
    assert.equal(typeof scope.bob    ,'object');
    assert.equal(typeof scope.charlie,'object');
    done();
  }));

  suite.addTest(new Test('Key generation', function(done) {
    scope.alice.kp.generate();
    scope.bob.kp.generate();
    scope.charlie.kp.generate();
    assert.equal(scope.alice.kp.pri.data.length,32);
    assert.equal(scope.bob.kp.pri.data.length,32);
    assert.equal(scope.charlie.kp.pri.data.length,32);
    done();
  }));

  suite.addTest(new Test('Key exchange', function(done) {
    try {
      scope.alice.kp.setPublic(scope.bob.kp.getPublic(scope.bob.kp.getPrivate()));
      scope.bob.kp.setPublic(scope.alice.kp.getPublic(scope.alice.kp.getPrivate()));
      assert.equal(true,true);
    } catch(e) {
      assert.equal(e,undefined);
    }
    done();
  }));

  suite.addTest(new Test('Signing messages', function(done) {
    try {
      scope.messageFromAlice     = "Hello Bob, this is Alice";
      scope.messageFromBob       = "Hello Alice, this is Bob";
      scope.messageFromCharlie   = "Hello Alice, this is Bob";
      scope.signatureFromAlice   = scope.alice.sign(scope.messageFromAlice);
      scope.signatureFromBob     = scope.bob.sign(scope.messageFromBob);
      scope.signatureFromCharlie = scope.charlie.sign(scope.messageFromCharlie);
      assert.equal(true,true);
    } catch(e) {
      assert.equal(e,undefined);
    }
    done();
  }));

  suite.addTest(new Test('Verifying signatures (and all previous steps)', function(done) {
    try {
      assert.equal(scope.bob.verify(   scope.messageFromAlice  , scope.signatureFromAlice   ), true , 'Alice\'s signature was bad');
      assert.equal(scope.alice.verify( scope.messageFromBob    , scope.signatureFromBob     ), true , 'Bob\'s signature was bad');
      assert.equal(scope.alice.verify( scope.messageFromCharlie, scope.signatureFromCharlie ), false, 'Charlie\'s signature was good');
    } catch(e) {
      assert.equal(e,undefined);
    }
    done();
  }));

  mocha.run();
});
