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
var suite = Suite.create(mocha.suite,'Verifying hashes are correct');

suite.timeout(60000);

// Generate the file list
co(function* () {
  var scope = {
    EC: require('../lib/ecdsa'),
  };

  suite.addTest(new Test('SHA256', function(done) {
    assert.equal(scope.EC.hash.sha256('').toString('hex'),'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    done();
  }));

  suite.addTest(new Test('HMAC-SHA256', function(done) {
    assert.equal(scope.EC.hash.hmac('sha256',''                                           ,''   ).toString('hex'),'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');
    assert.equal(scope.EC.hash.hmac('sha256','The quick brown fox jumps over the lazy dog','key').toString('hex'),'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
    done();
  }));

  mocha.run();
});
