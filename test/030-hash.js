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
var suite = Suite.create(mocha.suite, 'Verifying hashes are correct');

suite.timeout(60000);

// Generate the file list
co(function* () {
  var scope = {
    EC : require('../lib/ecdsa'),
  };

  var tests = [
    {
      algo : 'sha256',
      data : [
        {
          input  : '',
          output : 'e3b0c44298fc1c149afbf4c8996fb924' +
                   '27ae41e4649b934ca495991b7852b855'
        }
      ],
      hmac : [
        {
          key : (new Buffer(20)).fill(0x0b),
          msg : 'Hi There',
          exp : 'b0344c61d8db38535ca8afceaf0bf12b' +
                '881dc200c9833da726e9376c2e32cff7'
        }, {
          key : 'Jefe',
          msg : 'what do ya want for nothing?',
          exp : '5bdcc146bf60754e6a042426089575c7' +
                '5a003f089d2739839dec58b964ec3843'
        }, {
          key : (new Buffer(20)).fill(0xaa),
          msg : (new Buffer(50)).fill(0xdd),
          exp : '773ea91e36800e46854db8ebd09181a7' +
                '2959098b3ef8c122d9635514ced565fe'
        }, {
          key : Buffer.from('0102030405060708090a0b0c0d0e0f10111213141516171819', 'hex'),
          msg : (new Buffer(50)).fill(0xcd),
          exp : '82558a389a443c0ea4cc819899f2083a' +
                '85f0faa3e578f8077a2e3ff46729665b'
        }, {
          key : (new Buffer(131)).fill(0xaa),
          msg : 'Test Using Larger Than Block-Siz' +
                'e Key - Hash Key First',
          exp : '60e431591ee0b67f0d8a26aacbf5b77f' +
                '8e0bc6213728c5140546040f0ee37f54'
        }, {
          key : (new Buffer(131)).fill(0xaa),
          msg : 'This is a test using a larger th' +
                'an block-size key and a larger t' +
                'han block-size data. The key nee' +
                'ds to be hashed before being use' +
                'd by the HMAC algorithm.',
          exp : '9b09ffa71b942fcb27635fbcd5b0e944' +
                'bfdc63644f0713938a7f51535c3a35e2'
        },
      ]
    }, {
      algo : 'sha384',
      data : [
        {
          input  : '',
          output : '38b060a751ac96384cd9327eb1b1e36a' +
                   '21fdb71114be07434c0cc7bf63f6e1da' +
                   '274edebfe76f65fbd51ad2f14898b95b'
        }
      ],
      hmac : [
        {
          key : (new Buffer(20)).fill(0x0b),
          msg : 'Hi There',
          exp : 'afd03944d84895626b0825f4ab46907f' +
                '15f9dadbe4101ec682aa034c7cebc59c' +
                'faea9ea9076ede7f4af152e8b2fa9cb6'
        }, {
          key : 'Jefe',
          msg : 'what do ya want for nothing?',
          exp : 'af45d2e376484031617f78d2b58a6b1b' +
                '9c7ef464f5a01b47e42ec3736322445e' +
                '8e2240ca5e69e2c78b3239ecfab21649'
        }, {
          key : (new Buffer(20)).fill(0xaa),
          msg : (new Buffer(50)).fill(0xdd),
          exp : '88062608d3e6ad8a0aa2ace014c8a86f' +
                '0aa635d947ac9febe83ef4e55966144b' +
                '2a5ab39dc13814b94e3ab6e101a34f27'
        }, {
          key : Buffer.from('0102030405060708090a0b0c0d0e0f10111213141516171819', 'hex'),
          msg : (new Buffer(50)).fill(0xcd),
          exp : '3e8a69b7783c25851933ab6290af6ca7' +
                '7a9981480850009cc5577c6e1f573b4e' +
                '6801dd23c4a7d679ccf8a386c674cffb'
        }, {
          key : (new Buffer(131)).fill(0xaa),
          msg : 'Test Using Larger Than Block-Siz' +
                'e Key - Hash Key First',
          exp : '4ece084485813e9088d2c63a041bc5b4' +
                '4f9ef1012a2b588f3cd11f05033ac4c6' +
                '0c2ef6ab4030fe8296248df163f44952'
        }, {
          key : (new Buffer(131)).fill(0xaa),
          msg : 'This is a test using a larger th' +
                'an block-size key and a larger t' +
                'han block-size data. The key nee' +
                'ds to be hashed before being use' +
                'd by the HMAC algorithm.',
          exp : '6617178e941f020d351e2f254e8fd32c' +
                '602420feb0b8fb9adccebb82461e99c5' +
                'a678cc31e799176d3860e6110c46523e'
        },
      ]
    }, {
      algo : 'sha512',
      data : [
        {
          input  : '',
          output : 'cf83e1357eefb8bdf1542850d66d8007' +
                   'd620e4050b5715dc83f4a921d36ce9ce' +
                   '47d0d13c5d85f2b0ff8318d2877eec2f' +
                   '63b931bd47417a81a538327af927da3e'
        }
      ],
      hmac : [
        {
          key : (new Buffer(20)).fill(0x0b),
          msg : 'Hi There',
          exp : '87aa7cdea5ef619d4ff0b4241a1d6cb0' +
                '2379f4e2ce4ec2787ad0b30545e17cde' +
                'daa833b7d6b8a702038b274eaea3f4e4' +
                'be9d914eeb61f1702e696c203a126854'
        }, {
          key : 'Jefe',
          msg : 'what do ya want for nothing?',
          exp : '164b7a7bfcf819e2e395fbe73b56e0a3' +
                '87bd64222e831fd610270cd7ea250554' +
                '9758bf75c05a994a6d034f65f8f0e6fd' +
                'caeab1a34d4a6b4b636e070a38bce737'
        }, {
          key : (new Buffer(20)).fill(0xaa),
          msg : (new Buffer(50)).fill(0xdd),
          exp : 'fa73b0089d56a284efb0f0756c890be9' +
                'b1b5dbdd8ee81a3655f83e33b2279d39' +
                'bf3e848279a722c806b485a47e67c807' +
                'b946a337bee8942674278859e13292fb'
        }, {
          key : Buffer.from('0102030405060708090a0b0c0d0e0f10111213141516171819', 'hex'),
          msg : (new Buffer(50)).fill(0xcd),
          exp : 'b0ba465637458c6990e5a8c5f61d4af7' +
                'e576d97ff94b872de76f8050361ee3db' +
                'a91ca5c11aa25eb4d679275cc5788063' +
                'a5f19741120c4f2de2adebeb10a298dd'
        }, {
          key : (new Buffer(131)).fill(0xaa),
          msg : 'Test Using Larger Than Block-Siz' +
                'e Key - Hash Key First',
          exp : '80b24263c7c1a3ebb71493c1dd7be8b4' +
                '9b46d1f41b4aeec1121b013783f8f352' +
                '6b56d037e05f2598bd0fd2215d6a1e52' +
                '95e64f73f63f0aec8b915a985d786598'
        }, {
          key : (new Buffer(131)).fill(0xaa),
          msg : 'This is a test using a larger th' +
                'an block-size key and a larger t' +
                'han block-size data. The key nee' +
                'ds to be hashed before being use' +
                'd by the HMAC algorithm.',
          exp : 'e37b6a775dc87dbaa4dfa9f96e5e3ffd' +
                'debd71f8867289865df5a32d20cdc944' +
                'b6022cac3c4982b10d5eeb55c3e4de15' +
                '134676fb6de0446065c97440fa8c6a58'
        },
      ]
    }
  ];

  // Test known values
  tests.forEach(function (current) {
    suite.addTest(new Test(current.algo.toUpperCase() + ' known values', function (done) {
      current.data.forEach(function (known) {
        assert.equal(scope.EC.hash[current.algo](known.input).toString('hex'), known.output);
      });
      done();
    }));
  });

  // Test known HMAC values
  tests.forEach(function (current) {
    suite.addTest(new Test(current.algo.toUpperCase() + ' known HMAC values', function (done) {
      current.hmac.forEach(function (known) {
        assert.equal(scope.EC.hash.hmac(current.algo, known.msg, known.key).toString('hex'), known.exp);
      });
      done();
    }));
  });

  mocha.run();
});
