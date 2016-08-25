/*
* odata-array-filter - https://github.com/jasongardnerlv/odata-array-filter
*
* Copyright (c) 2016 Jason Gardner
* Licensed under the MIT license.
*/

/* global ODataArrayFilter:true */
/* global ODataParser */
ODataArrayFilter = (function() {
  "use strict";

  /* istanbul ignore next */
  Object.toType = (function toType(global) {
    return function(obj) {
      if (obj === global) {
        return "global";
      }
      return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
  })(this);

  function _parseFilter(filterString) {
    if (filterString.charAt(0) !== '$') {
      filterString = '$filter=' + filterString;
    }
    return ODataParser.parse(filterString);
  }

  function _simpleCompare(val1, val2, comparator) {
    if (Object.toType(val2) === 'date') {
      return comparator(new Date(val1).getTime(), val2.getTime());
    }
    return comparator(val1, val2);
  }

  var evaluators = {
    eqEvaluator: function(val1, val2) {
      if (val1 === null) {
        if (typeof val2 === 'string' && val2.toLowerCase() === 'null') {
          return true;
        } else {
          return false;
        }
      }
      return _simpleCompare(val1,val2,function(v1,v2){return v1===v2;});
    },
    neEvaluator: function(val1, val2) {
      return evaluators.eqEvaluator(val1, val2) === false;
    },
    ltEvaluator: function(val1, val2) {
      if (val1 === null){return false;}
      return _simpleCompare(val1,val2,function(v1,v2){return v1<v2;});
    },
    leEvaluator: function(val1, val2) {
      if (val1 === null){return false;}
      return _simpleCompare(val1,val2,function(v1,v2){return v1<=v2;});
    },
    gtEvaluator: function(val1, val2) {
      if (val1 === null){return false;}
      return _simpleCompare(val1,val2,function(v1,v2){return v1>v2;});
    },
    geEvaluator: function(val1, val2) {
      if (val1 === null){return false;}
      return _simpleCompare(val1,val2,function(v1,v2){return v1>=v2;});
    }
  };

  function _getFieldName(obj) {
    if (obj.name) {
      return obj.name;
    } else if (obj.type) {
      if (obj.type === 'functioncall') {
        return obj.args[0].name; //TODO nested functions
      } else {
        throw new Error('unrecognized type: ' + obj.type);
      }
    } else {
      throw new Error('could not find the field name');
    }
  }

  function _getFieldValue(obj, val) {
    if (val !== null && obj.type && obj.type === 'functioncall') {
      switch (obj.func) {
        case 'tolower':
          return val.toLowerCase();
        case 'toupper':
          return val.toUpperCase();
      }
    }
    return val;
  }

  function _processLeftRight(filter, arr) {
    switch (filter.type) {
      case 'eq':
      case 'ne':
      case 'lt':
      case 'le':
      case 'gt':
      case 'ge':
        var prop = _getFieldName(filter.left);
        var value = (Array.isArray(filter.right.value)) ? filter.right.value[0]  : filter.right.value; //not sure what the array is all about yet
        return arr.filter(function(obj) {
          var propVal = _getFieldValue(filter.left, obj[prop]);
          return evaluators[filter.type + 'Evaluator'](propVal, value);
        });
    }
  }

  function _filterArray(filters, arr) {
    /* global JSON */
    // console.dir(JSON.stringify(filters.$filter));
    if (filters.$filter) {
      arr = _processLeftRight(filters.$filter, arr);
    }
    return arr;
  }

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
