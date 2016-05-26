"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pick = pick;
exports.noop = noop;
function pick(props, wl) {
  var ret = {};
  wl.forEach(function (w) {
    if (w in props) {
      ret[w] = props[w];
    }
  });
  return ret;
}

function noop() {}