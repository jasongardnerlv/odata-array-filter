"use strict";

var chai = require('../node_modules/chai/chai.js');
var expect = chai.expect;
var testArray = require('../test/test-data.json');

var _parse = function(str) {
  return ODataArrayFilter.parseAndFilter(str, testArray);
};

/* global ODataArrayFilter */
describe('ODataFilterParser', function() {
  it('should handle no filter', function() {
    var arr = _parse("$filter='");
    expect(arr.length).to.equal(5);
  });
  it('should handle eq/ne', function() {
    var arr = _parse("eyeColor eq 'blue'");
    expect(arr.length).to.equal(2);
    expect(arr[0]).to.equal(testArray[2]);
    expect(arr[1]).to.equal(testArray[4]);

    arr = _parse("eyeColor eq null");
    expect(arr.length).to.equal(1);
    expect(arr[0]).to.equal(testArray[3]);

    arr = _parse("eyeColor ne 'blue'");
    expect(arr.length).to.equal(3);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[1]);
    expect(arr[2]).to.equal(testArray[3]);

    arr = _parse("eyeColor ne null");
    expect(arr.length).to.equal(4);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[1]);
    expect(arr[2]).to.equal(testArray[2]);
    expect(arr[3]).to.equal(testArray[4]);
  });
  it('should handle lt/gt/le/ge for numeric fields', function() {
    var arr = _parse("age lt 35");
    expect(arr.length).to.equal(2);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[3]);

    arr = _parse("age le 33");
    expect(arr.length).to.equal(2);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[3]);

    arr = _parse("age gt 35");
    expect(arr.length).to.equal(2);
    expect(arr[0]).to.equal(testArray[2]);
    expect(arr[1]).to.equal(testArray[4]);

    arr = _parse("age ge 33");
    expect(arr.length).to.equal(3);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[2]);
    expect(arr[2]).to.equal(testArray[4]);
  });
});



/*
field2 eq 51228161576219231295215871M
field1 lt 100 or field1 eq null
(field2 eq 51228161576219231295215871M) and (field1 lt 100 or field1 eq null)
substringof(tolower('foobar'),tolower(field2))
(MachineGroupId eq 51228161576219231295215871M) and (substringof(tolower('foobar'),tolower(field3)))
(substringof(tolower('foobar'),tolower(field2)) or substringof(tolower('foobar'),tolower(field3)) or substringof(tolower('foobar'),tolower(field4))) and (field1 lt 100 or field1 eq null)
((field2 eq 51228161576219231295215871M) and (substringof(tolower('foobar'),tolower(field3)) or substringof(tolower('foobar'),tolower(field4)) or substringof(tolower('foobar'),tolower(field5)))) and (field1 lt 100 or field1 eq null)
datefield1 ge datetime'2012-08-01T00:00:00' and datefield1 lt datetime'2014-12-02T00:00:00'
*/