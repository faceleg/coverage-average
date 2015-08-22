'use strict';

var exec = require('child-process-promise').exec;
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

describe('coverage-average', function() {
  it('should fail if called with no arguments', function(done) {
    exec('node index.js')
      .fail(function(error) {
        expect(error.stderr).to.equal('File must be provided\n');
        done();
      });
  });

  it('should fail if the file does not exist', function(done) {
    var testPath = path.join(__dirname, 'test/files/does-not-exist.txt');
    exec('node index.js ' + testPath)
      .fail(function(error) {
        expect(error.stderr).to.equal(testPath + ' does not exist\n');
        done();
      });
  });

  it('should output correct average if no --limit is provided', function(done) {
    exec('node index.js test/files/text-summary.txt')
      .then(function(result) {
        expect(result.stdout).to.equal('Coverage average is 9.20%\n');
        done();
      });
  });

  it('should fail if a --limit flag is provided with no value', function(done) {
    exec('node index.js test/files/text-summary.txt -l')
      .fail(function(error) {
        expect(error.stderr).to.equal('\n  error: option `-l, --limit <limit>\' argument missing\n\n');
        done();
      });
  });

  it('should PASS if the average is below the --limit', function(done) {
    exec('node index.js test/files/text-summary.txt --limit 5')
      .then(function(result) {
        expect(result.stdout).to.equal('PASS Coverage average of 9.20% is above limit of 5.00%\n');
        done();
      });
  });

  it('should FAIL if the average is above the --limit', function(done) {
    exec('node index.js test/files/text-summary.txt --limit 95')
    .fail(function(error) {
      expect(error.stderr).to.equal('FAIL Coverage average of 9.20% is below limit of 95.00%\n');
      done();
    });
  });
});
