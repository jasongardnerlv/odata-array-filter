/*! odata-array-filter - v0.0.1 - https://github.com/jasongardnerlv/odata-array-filter - (c) 2016 Jason Gardner - licensed MIT */
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

  function _arrayUniqueConcat(a1, a2) {
    for (var i = a2.length - 1; i >= 0; i--) {
      if (a1.indexOf(a2[i]) === -1) {
        a1.push(a2[i]);
      }
    }
    return a1;
  }

  function _parseFilter(filterString) {
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

  function _getFieldName(filter) {
    if (filter.type) {
      if (filter.type === 'property') {
        return filter.name;
      } else if (filter.type === 'functioncall') {
        switch (filter.func) {
          case 'tolower':
          case 'toupper':
            return _getFieldName(filter.args[0]);
          case 'substringof':
            return _getFieldName(filter.args[1]);
        }
      }
    }
  }

  function _getFieldValue(filter, val) {
    if (val !== null && filter.type && filter.type === 'functioncall') {
      switch (filter.func) {
        case 'tolower':
          return val.toLowerCase();
        case 'toupper':
          return val.toUpperCase();
        case 'substringof':
          val = _getFieldValue(filter.args[1], val);
          return val.indexOf(filter.args[0].value) >= 0;
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
      case 'or':
        return _arrayUniqueConcat(_processLeftRight(filter.left, arr), _processLeftRight(filter.right, arr));
      case 'and':
        return _processLeftRight(filter.right, _processLeftRight(filter.left, arr));
    }
  }

  function _filterArray(filters, arr) {
    if (filters.$filter) {
      arr = _processLeftRight(filters.$filter, arr);
    }
    if (filters.$orderby) {
      //only expecting one so far
      var orderby = filters.$orderby[0];
      var orderField, orderDir;
      for (var prop in orderby) {
        orderField = prop;
        orderDir = orderby[prop];
      }
      arr.sort(function(a, b) {
        if (a[orderField] === undefined || a[orderField] === null ||
          b[orderField] === undefined || b[orderField] === null) {
          return -1;
        }
        if (orderDir === 'asc') {
          return a[orderField].toString().toLowerCase() <= b[orderField].toString().toLowerCase() ? -1 : 1;
        } else {
          return a[orderField].toString().toLowerCase() >= b[orderField].toString().toLowerCase() ? -1 : 1;
        }
      });
    }
    var top = filters.$top || -1;
    var skip = filters.$skip || 0;
    if (top > -1) {
      arr = arr.slice(skip, top + skip);
    } else if (skip > 0) {
      arr = arr.slice(skip);
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
