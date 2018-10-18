<!--@'# ' + pkg.name-->
# node-red-contrib-filemaker
<!--/@-->

[![npm version](https://img.shields.io/npm/v/node-red-contrib-filemaker.svg)](https://www.npmjs.com/package/node-red-contrib-filemaker) [![Build Status](https://img.shields.io/travis/Luidog/node-red-contrib-filemaker/master.svg)](https://travis-ci.org/Luidog/node-red-contrib-filemaker) [![Coverage Status](https://img.shields.io/coveralls/Luidog/node-red-contrib-filemaker/master.svg)](https://coveralls.io/r/Luidog/node-red-contrib-filemaker?branch=master)

A node-red FileMaker module. It is uses [fms-api-client](https://github.com/Luidog/fms-api-client) to connect to the FileMaker Data API. These node expose fms-api-client's client methods and data transformation utility methods. Each node depend upon a configurable FileMaker Data API [client](https://github.com/Luidog/fms-api-client#client-creation). 

Nodes are configured with required default parameters that will be used in the event that required property parameters are not found in msg.payload or msg.parameters. Data intended for a FileMaker record should be the in msg.payload.data property.

[FMS API Client Documentation](https://luidog.github.io/fms-api-client/)

<!--@license()-->
## License

MIT © Lui de la Parra
<!--/@-->

<!--@installation()-->
## Installation

```sh
npm install --save node-red-contrib-filemaker
```
<!--/@-->

<!--@execute('npm run test',[])-->
```default
> node-red-contrib-filemaker@0.4.0 test /Users/luidelaparra/Documents/Development/node-red-contrib-filemaker
> nyc _mocha --recursive  "test/**/*_spec.js" --timeout=30000 --exit



  Client Node
    ✓ should be loaded

  Create Record Node
    ✓ should create a record (471ms)
    ✓ should throw an error with a message and a code (216ms)

  Delete Record Node
    ✓ should be loaded
    ✓ should delete a record (260ms)
    ✓ should throw an error with a message and a code (179ms)

  Edit Record Node
    ✓ should be loaded
    ✓ should edit a record (184ms)
    ✓ should throw an error with a message and a code (178ms)

  FieldData Utility Node
    ✓ should be loaded
    ✓ should transform an array of data
    ✓ should transform a single data object
    ✓ should preserve the contents of other payload properties

  Find Records Node
    ✓ should be loaded
    ✓ should perform a find (280ms)
    ✓ should throw an error with a message and a code (176ms)

  Get Record Node
    ✓ should be loaded

  List Records Node
    ✓ should be loaded

  Record Id Utility Node
    ✓ should be loaded
    ✓ should extract one record id from an array of data
    ✓ should extract one record id from a data object
    ✓ should extract many record ids from a data array
    ✓ should preserve the contents of other payload properties

  Perform Script Node
    ✓ should be loaded

  Utility Services
    merge utility
      ✓ should merge data to the payload object
    parse utility
      ✓ should parse stringified json
      ✓ should parse an object's property
      ✓ should not parse an an object's property if it is a string
    compact utility
      ✓ should accept an array of objects
      ✓ should remove null properties
      ✓ should remove null properties
      ✓ should remove empty strings
      ✓ should not remove false values
      ✓ should discard non json values
      ✓ should discard non json values
    isJson Utility
      ✓ it should return true for an object
      ✓ it should return true for an empty object
      ✓ it should return true for a stringified object
      ✓ it should return false for a number
      ✓ it should return false for undefined
      ✓ it should return false for a string
      ✓ it should return false for null

  Transform Utility Node
    ✓ should be loaded
    ✓ should transform an array of data
    ✓ should transform a single data object
    ✓ should preserve the contents of other payload properties

  Perform Script Node
    ✓ should be loaded


  47 passing (2s)

---------------|----------|----------|----------|----------|-------------------|
File           |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
---------------|----------|----------|----------|----------|-------------------|
All files      |    73.01 |      100 |     74.6 |     72.5 |                   |
 client        |      100 |      100 |      100 |      100 |                   |
  client.js    |      100 |      100 |      100 |      100 |                   |
 nodes         |    65.89 |      100 |    67.35 |    65.89 |                   |
  create.js    |      100 |      100 |      100 |      100 |                   |
  delete.js    |      100 |      100 |      100 |      100 |                   |
  edit.js      |      100 |      100 |      100 |      100 |                   |
  fieldData.js |      100 |      100 |      100 |      100 |                   |
  find.js      |      100 |      100 |      100 |      100 |                   |
  get.js       |    15.38 |      100 |       20 |    15.38 |... 14,19,20,22,23 |
  list.js      |    15.38 |      100 |       20 |    15.38 |... 14,27,28,31,33 |
  recordId.js  |      100 |      100 |      100 |      100 |                   |
  script.js    |    15.38 |      100 |       20 |    15.38 |... ,9,14,15,17,18 |
  transform.js |      100 |      100 |      100 |      100 |                   |
  upload.js    |    15.38 |      100 |       20 |    15.38 |... ,9,14,15,17,18 |
 services      |      100 |      100 |      100 |      100 |                   |
  index.js     |      100 |      100 |      100 |      100 |                   |
---------------|----------|----------|----------|----------|-------------------|
```
<!--/@-->

<!--@dependencies()-->
## <a name="dependencies">Dependencies</a>

- [fms-api-client](https://github.com/Luidog/fms-api-client): A FileMaker Data API client designed to allow easier interaction with a FileMaker application from a web environment.
- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.
- [marpat](https://github.com/luidog/marpat): A class-based ES6 ODM for Mongo-like databases.

<!--/@-->

<!--@devDependencies()-->
## <a name="dev-dependencies">Dev Dependencies</a>

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [coveralls](https://github.com/nickmerwin/node-coveralls): takes json-cov output into stdin and POSTs to coveralls.io
- [dotenv](https://github.com/motdotla/dotenv): Loads environment variables from .env file
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-google](https://github.com/google/eslint-config-google): ESLint shareable config for the Google style
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier): Turns off all rules that are unnecessary or might conflict with Prettier.
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier): Runs prettier as an eslint rule
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mocha-lcov-reporter](https://github.com/StevenLooman/mocha-lcov-reporter): LCOV reporter for Mocha
- [mos](https://github.com/mosjs/mos): A pluggable module that injects content into your markdown files via hidden JavaScript snippets
- [mos-plugin-dependencies](https://github.com/mosjs/mos/tree/master/packages/mos-plugin-dependencies): A mos plugin that creates dependencies sections
- [mos-plugin-execute](https://github.com/team-767/mos-plugin-execute): Mos plugin to inline a process output
- [mos-plugin-installation](https://github.com/mosjs/mos/tree/master/packages/mos-plugin-installation): A mos plugin for creating installation section
- [mos-plugin-license](https://github.com/mosjs/mos-plugin-license): A mos plugin for generating a license section
- [node-red](https://github.com/node-red/node-red): A visual tool for wiring the Internet of Things
- [node-red-node-test-helper](https://github.com/node-red/node-red-node-test-helper): A test framework for Node-RED nodes
- [nyc](https://github.com/istanbuljs/nyc): the Istanbul command line interface
- [pm2](https://github.com/Unitech/pm2): Production process manager for Node.JS applications with a built-in load balancer.
- [prettier](https://github.com/prettier/prettier): Prettier is an opinionated code formatter
- [varium](https://npmjs.org/package/varium): A strict parser and validator of environment config variables

<!--/@-->