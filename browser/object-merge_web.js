;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
objectMerge = require('../src/object-merge.js');

},{"../src/object-merge.js":3}],2:[function(require,module,exports){
/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
/*jslint
    evil: true,
    node: true
*/
'use strict';
/**
 * Clones non native JavaScript functions, or references native functions.
 * @param {Function} func The function to clone.
 * @returns {Function} Returns a clone of the non native function, or a
 *  reference to the native function.
 */
function cloneFunction(func) {
    var out;
    if (/\[native code\]/.test(func.toString())) {
        out = func;
    } else {
        out = eval('(function(){return ' + func.toString() + '}());');
    }
    return out;
}
module.exports = cloneFunction;
},{}],3:[function(require,module,exports){
/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
/*jslint
    white: true,
    vars: true,
    node: true
*/
/**
 * Merges JavaScript objects recursively without altering the objects merged.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @param {Object} shadows [[shadows]...] One or more objects to merge. Each
 *  argument given will be treated as an object to merge. Each object overwrites
 *  the previous objects descendant properties if the property name matches. If
 *  objects properties are objects they will be merged recursively as well.
 * @returns {Object} Returns a single merged object composed from clones of the
 *  input objects.
 * @example
 *  var objectMerge = require('object-merge');
 *  var x = {
 *      a : 'a',
 *      b : 'b',
 *      c : {
 *          d : 'd',
 *          e : 'e',
 *          f : {
 *              g : 'g'
 *          }
 *      }
 *  };
 *  var y = {
 *      a : '`a',
 *      b : '`b',
 *      c : {
 *          d : '`d'
 *      }
 *  };
 *  var z = {
 *      a : {
 *          b : '``b'
 *      },
 *      fun : function foo () {
 *          return 'foo';
 *      },
 *      aps : Array.prototype.slice
 *  };
 *  var out = objectMerge(x, y, z);
 *  // out.a will be {
 *  //         b : '``b'
 *  //     }
 *  // out.b will be '`b'
 *  // out.c will be {
 *  //         d : '`d',
 *  //         e : 'e',
 *  //         f : {
 *  //             g : 'g'
 *  //         }
 *  //     }
 *  // out.fun will be a clone of z.fun
 *  // out.aps will be equal to z.aps
 */
function objectMerge(shadows) {
    'use strict';
    var cloneFunction = require('clone-function');
    var out = Object.create(null);
    shadows = Array.prototype.slice.call(arguments, 0);
    shadows.forEach(function (shadow) {
        Object.keys(shadow).forEach(function (prop) {
            var tmp = Object.create(null);
            var pBase = out[prop] || tmp;
            if (shadow[prop] instanceof Function) {
                tmp = cloneFunction(shadow[prop]);
            } else if (typeof shadow[prop] === 'object') {
                pBase = typeof out[prop] === 'object' ? pBase : tmp;
                tmp = objectMerge(pBase, shadow[prop]);
            } else {
                tmp = shadow[prop];
            }
            out[prop] = tmp;
        });
    });
    return out;
}
module.exports = objectMerge;
},{"clone-function":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGthc3RvclxcRG9jdW1lbnRzXFxHaXRIdWJcXG9iamVjdC1tZXJnZVxcZGV2XFxicm93c2VyTWFpbi5qcyIsIkM6XFxVc2Vyc1xca2FzdG9yXFxEb2N1bWVudHNcXEdpdEh1Ylxcb2JqZWN0LW1lcmdlXFxub2RlX21vZHVsZXNcXGNsb25lLWZ1bmN0aW9uXFxzcmNcXGNsb25lLWZ1bmN0aW9uLmpzIiwiQzpcXFVzZXJzXFxrYXN0b3JcXERvY3VtZW50c1xcR2l0SHViXFxvYmplY3QtbWVyZ2VcXHNyY1xcb2JqZWN0LW1lcmdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsib2JqZWN0TWVyZ2UgPSByZXF1aXJlKCcuLi9zcmMvb2JqZWN0LW1lcmdlLmpzJyk7XHJcbiIsIi8qXHJcbkxpY2Vuc2UgZ3BsLTMuMCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTMuMC1zdGFuZGFsb25lLmh0bWxcclxuKi9cclxuLypqc2xpbnRcclxuICAgIGV2aWw6IHRydWUsXHJcbiAgICBub2RlOiB0cnVlXHJcbiovXHJcbid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIENsb25lcyBub24gbmF0aXZlIEphdmFTY3JpcHQgZnVuY3Rpb25zLCBvciByZWZlcmVuY2VzIG5hdGl2ZSBmdW5jdGlvbnMuXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lLlxyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYSBjbG9uZSBvZiB0aGUgbm9uIG5hdGl2ZSBmdW5jdGlvbiwgb3IgYVxyXG4gKiAgcmVmZXJlbmNlIHRvIHRoZSBuYXRpdmUgZnVuY3Rpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9uZUZ1bmN0aW9uKGZ1bmMpIHtcclxuICAgIHZhciBvdXQ7XHJcbiAgICBpZiAoL1xcW25hdGl2ZSBjb2RlXFxdLy50ZXN0KGZ1bmMudG9TdHJpbmcoKSkpIHtcclxuICAgICAgICBvdXQgPSBmdW5jO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgPSBldmFsKCcoZnVuY3Rpb24oKXtyZXR1cm4gJyArIGZ1bmMudG9TdHJpbmcoKSArICd9KCkpOycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dDtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRnVuY3Rpb247IiwiLypcclxuTGljZW5zZSBncGwtMy4wIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLXN0YW5kYWxvbmUuaHRtbFxyXG4qL1xyXG4vKmpzbGludFxyXG4gICAgd2hpdGU6IHRydWUsXHJcbiAgICB2YXJzOiB0cnVlLFxyXG4gICAgbm9kZTogdHJ1ZVxyXG4qL1xyXG4vKipcclxuICogTWVyZ2VzIEphdmFTY3JpcHQgb2JqZWN0cyByZWN1cnNpdmVseSB3aXRob3V0IGFsdGVyaW5nIHRoZSBvYmplY3RzIG1lcmdlZC5cclxuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOm1hdHRoZXdrYXN0b3JAZ21haWwuY29tXCI+TWF0dGhldyBLYXN0b3I8L2E+XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzaGFkb3dzIFtbc2hhZG93c10uLi5dIE9uZSBvciBtb3JlIG9iamVjdHMgdG8gbWVyZ2UuIEVhY2hcclxuICogIGFyZ3VtZW50IGdpdmVuIHdpbGwgYmUgdHJlYXRlZCBhcyBhbiBvYmplY3QgdG8gbWVyZ2UuIEVhY2ggb2JqZWN0IG92ZXJ3cml0ZXNcclxuICogIHRoZSBwcmV2aW91cyBvYmplY3RzIGRlc2NlbmRhbnQgcHJvcGVydGllcyBpZiB0aGUgcHJvcGVydHkgbmFtZSBtYXRjaGVzLiBJZlxyXG4gKiAgb2JqZWN0cyBwcm9wZXJ0aWVzIGFyZSBvYmplY3RzIHRoZXkgd2lsbCBiZSBtZXJnZWQgcmVjdXJzaXZlbHkgYXMgd2VsbC5cclxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIHNpbmdsZSBtZXJnZWQgb2JqZWN0IGNvbXBvc2VkIGZyb20gY2xvbmVzIG9mIHRoZVxyXG4gKiAgaW5wdXQgb2JqZWN0cy5cclxuICogQGV4YW1wbGVcclxuICogIHZhciBvYmplY3RNZXJnZSA9IHJlcXVpcmUoJ29iamVjdC1tZXJnZScpO1xyXG4gKiAgdmFyIHggPSB7XHJcbiAqICAgICAgYSA6ICdhJyxcclxuICogICAgICBiIDogJ2InLFxyXG4gKiAgICAgIGMgOiB7XHJcbiAqICAgICAgICAgIGQgOiAnZCcsXHJcbiAqICAgICAgICAgIGUgOiAnZScsXHJcbiAqICAgICAgICAgIGYgOiB7XHJcbiAqICAgICAgICAgICAgICBnIDogJ2cnXHJcbiAqICAgICAgICAgIH1cclxuICogICAgICB9XHJcbiAqICB9O1xyXG4gKiAgdmFyIHkgPSB7XHJcbiAqICAgICAgYSA6ICdgYScsXHJcbiAqICAgICAgYiA6ICdgYicsXHJcbiAqICAgICAgYyA6IHtcclxuICogICAgICAgICAgZCA6ICdgZCdcclxuICogICAgICB9XHJcbiAqICB9O1xyXG4gKiAgdmFyIHogPSB7XHJcbiAqICAgICAgYSA6IHtcclxuICogICAgICAgICAgYiA6ICdgYGInXHJcbiAqICAgICAgfSxcclxuICogICAgICBmdW4gOiBmdW5jdGlvbiBmb28gKCkge1xyXG4gKiAgICAgICAgICByZXR1cm4gJ2Zvbyc7XHJcbiAqICAgICAgfSxcclxuICogICAgICBhcHMgOiBBcnJheS5wcm90b3R5cGUuc2xpY2VcclxuICogIH07XHJcbiAqICB2YXIgb3V0ID0gb2JqZWN0TWVyZ2UoeCwgeSwgeik7XHJcbiAqICAvLyBvdXQuYSB3aWxsIGJlIHtcclxuICogIC8vICAgICAgICAgYiA6ICdgYGInXHJcbiAqICAvLyAgICAgfVxyXG4gKiAgLy8gb3V0LmIgd2lsbCBiZSAnYGInXHJcbiAqICAvLyBvdXQuYyB3aWxsIGJlIHtcclxuICogIC8vICAgICAgICAgZCA6ICdgZCcsXHJcbiAqICAvLyAgICAgICAgIGUgOiAnZScsXHJcbiAqICAvLyAgICAgICAgIGYgOiB7XHJcbiAqICAvLyAgICAgICAgICAgICBnIDogJ2cnXHJcbiAqICAvLyAgICAgICAgIH1cclxuICogIC8vICAgICB9XHJcbiAqICAvLyBvdXQuZnVuIHdpbGwgYmUgYSBjbG9uZSBvZiB6LmZ1blxyXG4gKiAgLy8gb3V0LmFwcyB3aWxsIGJlIGVxdWFsIHRvIHouYXBzXHJcbiAqL1xyXG5mdW5jdGlvbiBvYmplY3RNZXJnZShzaGFkb3dzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgY2xvbmVGdW5jdGlvbiA9IHJlcXVpcmUoJ2Nsb25lLWZ1bmN0aW9uJyk7XHJcbiAgICB2YXIgb3V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIHNoYWRvd3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xyXG4gICAgc2hhZG93cy5mb3JFYWNoKGZ1bmN0aW9uIChzaGFkb3cpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhzaGFkb3cpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgICAgICAgdmFyIHRtcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgICAgICAgIHZhciBwQmFzZSA9IG91dFtwcm9wXSB8fCB0bXA7XHJcbiAgICAgICAgICAgIGlmIChzaGFkb3dbcHJvcF0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdG1wID0gY2xvbmVGdW5jdGlvbihzaGFkb3dbcHJvcF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzaGFkb3dbcHJvcF0gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBwQmFzZSA9IHR5cGVvZiBvdXRbcHJvcF0gPT09ICdvYmplY3QnID8gcEJhc2UgOiB0bXA7XHJcbiAgICAgICAgICAgICAgICB0bXAgPSBvYmplY3RNZXJnZShwQmFzZSwgc2hhZG93W3Byb3BdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRtcCA9IHNoYWRvd1twcm9wXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRbcHJvcF0gPSB0bXA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RNZXJnZTsiXX0=
;