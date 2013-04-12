/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('assert');

describe('Mobileapp generator test', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.mobileapp = helpers.createGenerator('mobileapp:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      done();
    }.bind(this));
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of the generators yet
    this.app = require('../app');
  });

  it('creates expected files', function (done) {
    var expected = [
      ["component.json", /"name": "temp"/],
      ["package.json", /"name": "temp"/],
      'Gruntfile.js',
      // 'app/404.html',
      // 'app/favicon.ico',
      'app/index.html',
      'app/scripts/hello.coffee',
      'app/scripts/main.js',
      'app/styles/main.scss'
    ];

    this.mobileapp.options['skip-install'] = true;
    this.mobileapp.run({}, function() {
      helpers.assertFiles(expected);
      done();
    });
  });
});
