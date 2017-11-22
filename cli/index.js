#!/usr/bin/env node --harmony
var game = require('../src/GameState');
var program = require('commander');
var co = require('co');
var prompt = require('co-prompt');
var chalk = require('chalk');

var figlet = require('figlet');

// figlet('Lightning Spade Host', function(err, data) {
//     if (err) {
//         console.log('Something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.log(data);
// });


program
  .version('0.1.0')
  .option('-ns, --nextstate', 'Next state')
  .parse(process.argv);

if (program.peppers) console.log('  - peppers');
