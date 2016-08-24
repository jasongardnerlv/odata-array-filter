/*! odata-array-filter - v0.0.1 - https://github.com/jasongardnerlv/odata-array-filter - (c) 2016 Jason Gardner - licensed MIT */
/* global ODataArrayFilter:true */
ODataArrayFilter = (function() {
  "use strict";

  function _parseFilter(filterString) {
    if (filterString.charAt(0) !== '$') {
      filterString = '$filter=' + filterString;
    }
    return ODataParser.parse(filterString);
  }

  function _isNullValue(obj, prop) {
    return obj[prop] === null;
  }

  var evaluators = {
    eqEvaluator: function(obj, prop, value) {
      if (_isNullValue(obj, prop)) {
        if (value.toLowerCase() === 'null') {
          return true;
        } else {
          return false;
        }
      }
      return obj[prop] === value;
    },
    neEvaluator: function(obj, prop, value) {
      if (_isNullValue(obj, prop)) {
        if (value.toLowerCase() !== 'null') {
          return true;
        } else {
          return false;
        }
      }
      return obj[prop] !== value;
    },
    ltEvaluator: function(obj, prop, value) {
      if (_isNullValue(obj,prop)){return false;}
      return obj[prop] < value;
    },
    leEvaluator: function(obj, prop, value) {
      if (_isNullValue(obj,prop)){return false;}
      return obj[prop] <= value;
    },
    gtEvaluator: function(obj, prop, value) {
      if (_isNullValue(obj,prop)){return false;}
      return obj[prop] > value;
    },
    geEvaluator: function(obj, prop, value) {
      if (_isNullValue(obj,prop)){return false;}
      return obj[prop] >= value;
    }
  };

  function _evalExpression(arr, filter, evaluator) {
    var prop = filter.left.name;
    var value = (Array.isArray(filter.right.value)) ? filter.right.value[0]  : filter.right.value; //not sure what the array is all about yet
    return arr.filter(function(obj){return evaluator(obj,prop,value);});
  }

  function _filterArray(filters, arr) {
    /* global JSON */
    // console.dir(JSON.stringify(filters.$filter));
    if (filters.$filter) {
      var filter = filters.$filter;
      switch (filter.type) {
        case 'eq':
        case 'ne':
        case 'lt':
        case 'le':
        case 'gt':
        case 'ge':
          arr = _evalExpression(arr, filter, evaluators[filter.type + 'Evaluator']);
          break;
      }
    }
    return arr;
  }

  /* global ODataParser */
  function ODataArrayFilter() {
    var self = this;

    self.parse = function(filterString) {
      return _parseFilter(filterString);
    };

    self.filter = function(filters, arr) {
      return _filterArray(filters, arr);
    };

    self.parseAndFilter = function(filterString, arr) {
      return self.filter(self.parse(filterString), arr);
    };

  }

  return new ODataArrayFilter();
})();
