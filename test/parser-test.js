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

  it('should handle simple string field filters', function() {
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

  it('should handle simple numeric field filters', function() {
    var arr = _parse("age eq 33");
    expect(arr.length).to.equal(1);
    expect(arr[0]).to.equal(testArray[0]);

    arr = _parse("age ne 33");
    expect(arr.length).to.equal(4);
    expect(arr[0]).to.equal(testArray[1]);
    expect(arr[1]).to.equal(testArray[2]);
    expect(arr[2]).to.equal(testArray[3]);
    expect(arr[3]).to.equal(testArray[4]);

    arr = _parse("age lt 35");
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

  it('should handle simple date field filters', function() {
    var arr = _parse("registered eq datetime'2016-08-08T07:18:17'");
    expect(arr.length).to.equal(1);
    expect(arr[0]).to.equal(testArray[3]);

    arr = _parse("registered ne datetime'2016-08-08T07:18:17'");
    expect(arr.length).to.equal(4);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[1]);
    expect(arr[2]).to.equal(testArray[2]);
    expect(arr[3]).to.equal(testArray[4]);

    arr = _parse("registered lt datetime'2015-12-15T00:00:00'");
    expect(arr.length).to.equal(3);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[1]);
    expect(arr[2]).to.equal(testArray[2]);

    arr = _parse("registered le datetime'2014-11-22T09:59:23'");
    expect(arr.length).to.equal(2);
    expect(arr[0]).to.equal(testArray[1]);
    expect(arr[1]).to.equal(testArray[2]);

    arr = _parse("registered gt datetime'2015-12-15T00:00:00'");
    expect(arr.length).to.equal(2);
    expect(arr[0]).to.equal(testArray[3]);
    expect(arr[1]).to.equal(testArray[4]);

    arr = _parse("registered ge datetime'2014-11-22T09:59:23'");
    expect(arr.length).to.equal(4);
    expect(arr[0]).to.equal(testArray[0]);
    expect(arr[1]).to.equal(testArray[2]);
    expect(arr[2]).to.equal(testArray[3]);
    expect(arr[3]).to.equal(testArray[4]);
  });

  it('should handle tolower and toupper', function() {
    var arr = _parse("tolower(company) eq 'bleeko'");
    expect(arr.length).to.equal(1);
    expect(arr[0]).to.equal(testArray[0]);

    arr = _parse("toupper(eyeColor) eq 'BLUE'");
    expect(arr.length).to.equal(2);
    expect(arr[0]).to.equal(testArray[2]);
    expect(arr[1]).to.equal(testArray[4]);
  });

  it('should handle substringof', function() {
    var arr = _parse("substringof('zwit', email) eq true");
    expect(arr.length).to.equal(1);
    expect(arr[0]).to.equal(testArray[4]);
  });

  it('should handle the combination of tolower and substringof', function() {
    var arr = _parse("substringof('entu', tolower(company)) eq true");
    expect(arr.length).to.equal(1);
    expect(arr[0]).to.equal(testArray[3]);
  });

});


/*
field2 eq 51228161576219231295215871M
field1 lt 100 or field1 eq null
(field2 eq 51228161576219231295215871M) and (field1 lt 100 or field1 eq null)
substringof('foobar',tolower(field2))
(MachineGroupId eq 51228161576219231295215871M) and (substringof('foobar',tolower(field3)))
(substringof('foobar',tolower(field2)) or substringof('foobar',tolower(field3)) or substringof('foobar',tolower(field4))) and (field1 lt 100 or field1 eq null)
((field2 eq 51228161576219231295215871M) and (substringof('foobar',tolower(field3)) or substringof('foobar',tolower(field4)) or substringof('foobar',tolower(field5)))) and (field1 lt 100 or field1 eq null)
datefield1 ge datetime'2012-08-01T00:00:00' and datefield1 lt datetime'2014-12-02T00:00:00'
*/