#!/usr/bin/env node
'use strict';

var program = require('commander');
var path = require('path');
var Promise = require('bluebird');
var readFile = Promise.promisify(require('fs').readFile);
var R = require('ramda');
var colors = require('colors'); // eslint-disable-line no-unused-vars

program
  .usage('[options] <file>')
  .version('0.0.1')
  .option('-l, --limit <limit>', 'Threshold below which the coverage average must not fall', parseFloat)
  .parse(process.argv);

if (program.args.length < 1) {
  console.error('File must be provided');
  process.exit(1);
}

var file = program.args[0];
if (!path.isAbsolute(file)) {
  file = path.join(process.cwd(), file);
}

readFile(file, 'utf-8').then(function(data) {
  var statements = /Statements\s+:\s+([0-9\.]+)%/.exec(data);
  if (!statements) {
    throw new Error('Statements line does not exist');
  }
  var branches = /Branches\s+:\s+([0-9\.]+)%/.exec(data);
  if (!branches) {
    throw new Error('Branches line does not exist');
  }
  var functions = /Functions\s+:\s+([0-9\.]+)%/.exec(data);
  if (!functions) {
    throw new Error('Functions line does not exist');
  }
  var lines = /Lines\s+:\s+([0-9\.]+)%/.exec(data);
  if (!lines) {
    throw new Error('Lines line does not exist');
  }

  return [
    parseFloat(statements[1]),
    parseFloat(branches[1]),
    parseFloat(functions[1]),
    parseFloat(lines[1])
  ];
})
.then(function(coverage) {
  return (R.reduce(R.add, 0, coverage) / coverage.length).toFixed(2);
})
.then(function(average) {
  if (program.limit) {
    if (average < program.limit) {
      var fail = 'FAIL'.red.bold + ' Coverage average of ' + '%s%'.red.bold + ' is below limit of ' + '%s%'.bold;
      console.error(fail, average, program.limit.toFixed(2));
      process.exit(1);
    }
    var pass = 'PASS'.green.bold + ' Coverage average of ' + '%s%'.green.bold + ' is above limit of ' + '%s%'.bold;
    console.log(pass, average, program.limit.toFixed(2));
    process.exit(0);
  } else {
    console.log('Coverage average is %s%', average);
    process.exit(0);
  }
})
.catch(function(error) {
  if (error.code === 'ENOENT') {
    console.error('%s does not exist', file);
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

