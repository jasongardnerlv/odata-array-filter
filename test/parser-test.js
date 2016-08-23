"use strict";

var chai = require('../node_modules/chai/chai.js');
var parser = require('../coverage/instrument/lib/odata-array-filter.js');

describe('OdataFilterParser', function() {
  beforeEach(function() {
  });

  afterEach(function() {
  });

  it('should return the foobar', function() {
    chai.expect(parser.getFoobar()).to.equal('foobar');
  });
});