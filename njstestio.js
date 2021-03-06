var modulo = function(zl) {
  "use strict";
  zl.io = zl.io || {};
  zl.test = zl.test || {};
  zl.test.output = [];
  zl.test.input = [];

  zl.io.outWrite = function(msg) {
    zl.test.output.push(msg);
  }

  zl.io.inRead = function(callback) {
    if (zl.test.input.length)
      callback(null, zl.test.input.shift());
    else
      callback(null, "");
  }

  zl.io.abortRead = function() {
    //TODO: Stub
  }

  zl.io.limpiar = function() {
    zl.test.output = [];
    //zl.test.input = [];
  }

  return zl;
}

if (typeof module !== "undefined")
  module.exports = modulo;
else {
  this.zl = modulo(this.zl || {});
}
