"use strict";

var chai = require('../node_modules/chai/chai.js');
var expect = chai.expect;

var _parse = function(str) {
  delete require.cache[require.resolve('../test/test-data.json')];
  var testArray = require('../test/test-data.json');
  return ODataArrayFilter.parseAndFilter(str, testArray).data;
};

/* global ODataArrayFilter */
describe('ODataFilterParser', function() {

  it('should handle no filter', function() {
    var arr = _parse("$filter='");
    expect(arr.length).to.equal(5);
  });

  it('should handle simple string field filters', function() {
    var arr = _parse("$filter=eyeColor eq 'blue'");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(2);
    expect(arr[1].index).to.equal(4);

    arr = _parse("$filter=eyeColor eq null");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(3);

    arr = _parse("$filter=eyeColor ne 'blue'");
    expect(arr.length).to.equal(3);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(1);
    expect(arr[2].index).to.equal(3);

    arr = _parse("$filter=eyeColor ne null");
    expect(arr.length).to.equal(4);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(1);
    expect(arr[2].index).to.equal(2);
    expect(arr[3].index).to.equal(4);
  });

  it('should handle simple numeric field filters', function() {
    var arr = _parse("$filter=age eq 33");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(0);

    arr = _parse("$filter=age ne 33");
    expect(arr.length).to.equal(4);
    expect(arr[0].index).to.equal(1);
    expect(arr[1].index).to.equal(2);
    expect(arr[2].index).to.equal(3);
    expect(arr[3].index).to.equal(4);

    arr = _parse("$filter=age lt 35");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(3);

    arr = _parse("$filter=age le 33");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(3);

    arr = _parse("$filter=age gt 35");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(2);
    expect(arr[1].index).to.equal(4);

    arr = _parse("$filter=age ge 33");
    expect(arr.length).to.equal(3);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(2);
    expect(arr[2].index).to.equal(4);
  });

  it('should handle simple date field filters', function() {
    var arr = _parse("$filter=registered eq datetime'2016-08-08T07:18:17'");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(3);

    arr = _parse("$filter=registered ne datetime'2016-08-08T07:18:17'");
    expect(arr.length).to.equal(4);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(1);
    expect(arr[2].index).to.equal(2);
    expect(arr[3].index).to.equal(4);

    arr = _parse("$filter=registered lt datetime'2015-12-15T00:00:00'");
    expect(arr.length).to.equal(3);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(1);
    expect(arr[2].index).to.equal(2);

    arr = _parse("$filter=registered le datetime'2014-11-22T09:59:23'");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(1);
    expect(arr[1].index).to.equal(2);

    arr = _parse("$filter=registered gt datetime'2015-12-15T00:00:00'");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(3);
    expect(arr[1].index).to.equal(4);

    arr = _parse("$filter=registered ge datetime'2014-11-22T09:59:23'");
    expect(arr.length).to.equal(4);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(2);
    expect(arr[2].index).to.equal(3);
    expect(arr[3].index).to.equal(4);
  });

  it('should handle tolower and toupper', function() {
    var arr = _parse("$filter=tolower(company) eq 'bleeko'");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(0);

    arr = _parse("$filter=toupper(eyeColor) eq 'BLUE'");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(2);
    expect(arr[1].index).to.equal(4);
  });

  it('should handle substringof', function() {
    var arr = _parse("$filter=substringof('zwit', email) eq true");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(4);
  });

  it('should handle the combination of tolower and substringof', function() {
    var arr = _parse("$filter=substringof('entu', tolower(company)) eq true");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(3);
  });

  it('should handle ORed expressions', function() {
    var arr = _parse("$filter=age lt 30 or age eq null");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(3);
    expect(arr[1].index).to.equal(1);
  });

  it('should handle ANDed expressions', function() {
    var arr = _parse("$filter=registered lt datetime'2016-08-10T00:00:00' and registered gt datetime'2016-08-04T00:00:00'");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(3);
  });

  it('should handle a really complicated expression', function() {
    var arr = _parse("$filter=((eyeColor ne null) and " +
      "((substringof('shawna',tolower(name)) eq true) or " +
      "(substringof('shawna',tolower(email)) eq true) or " +
      "(substringof('shawna',tolower(greeting)) eq true))) and " +
      "(favoriteFruit eq 'apple' or favoriteFruit eq null)");
    expect(arr.length).to.equal(1);
    expect(arr[0].index).to.equal(2);
  });

  it('should handle orderby', function() {
    var arr = _parse("$orderby=name desc");
    expect(arr.length).to.equal(5);
    expect(arr[0].index).to.equal(4);
    expect(arr[1].index).to.equal(1);
    expect(arr[2].index).to.equal(2);
    expect(arr[3].index).to.equal(0);
    expect(arr[4].index).to.equal(3);
  });

  it('should handle top', function() {
    var arr = _parse("$top=3");
    expect(arr.length).to.equal(3);
    expect(arr[0].index).to.equal(0);
    expect(arr[1].index).to.equal(1);
    expect(arr[2].index).to.equal(2);
  });

  it('should handle skip', function() {
    var arr = _parse("$skip=3");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(3);
    expect(arr[1].index).to.equal(4);
  });

  it('should handle filter, top, skip, and orderby', function() {
    var arr = _parse("$top=2&$skip=1&$filter=age ne null&$orderby=company desc");
    expect(arr.length).to.equal(2);
    expect(arr[0].index).to.equal(2);
    expect(arr[1].index).to.equal(4);
  });

});
