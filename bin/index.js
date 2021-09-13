#!/usr/bin/env node
const { cli, console: { printError } } = require('../dist');

console.log('@@@', process.argv);

cli(process.cwd(), process.argv)
  .catch(error => {
    printError(error.message);
    process.exit(1);
  })
  .finally(() => process.exit(0));
