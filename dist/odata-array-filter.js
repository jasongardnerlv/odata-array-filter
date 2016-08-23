/*! odata-array-filter - v0.0.1 - https://github.com/jasongardnerlv/odata-array-filter - (c) 2016 Jason Gardner - licensed MIT */
(function (root, definition) {
  "use strict";
  if (typeof module === 'object' && module.exports && typeof require === 'function') {
    module.exports = definition();
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    define(definition);
  } else {
    root.odataArrayFilter = definition();
  }
}(this, function () {
  "use strict";

  function myInternalFunction() {
    return 'foobar';
  }

  function ODataParser() {
    var self = this;

    self.getLevel = function () {
      return myInternalFunction();
    };

  }

  return new ODataParser();
}));
