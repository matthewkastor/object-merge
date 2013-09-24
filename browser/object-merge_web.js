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
            var arr = [];
            if (shadow[prop] instanceof Array) {
                pBase = typeof out[prop] === 'object' ? pBase : tmp;
                tmp = objectMerge(pBase, shadow[prop]);
                Object.keys(tmp).forEach(function (key) {
                    arr[key] = tmp[key];
                });
                tmp = arr;
            } else if (shadow[prop] instanceof Function) {
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGthc3RvclxcRG9jdW1lbnRzXFxHaXRIdWJcXG9iamVjdC1tZXJnZVxcZGV2XFxicm93c2VyTWFpbi5qcyIsIkM6XFxVc2Vyc1xca2FzdG9yXFxEb2N1bWVudHNcXEdpdEh1Ylxcb2JqZWN0LW1lcmdlXFxub2RlX21vZHVsZXNcXGNsb25lLWZ1bmN0aW9uXFxzcmNcXGNsb25lLWZ1bmN0aW9uLmpzIiwiQzpcXFVzZXJzXFxrYXN0b3JcXERvY3VtZW50c1xcR2l0SHViXFxvYmplY3QtbWVyZ2VcXHNyY1xcb2JqZWN0LW1lcmdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIm9iamVjdE1lcmdlID0gcmVxdWlyZSgnLi4vc3JjL29iamVjdC1tZXJnZS5qcycpO1xyXG4iLCIvKlxyXG5MaWNlbnNlIGdwbC0zLjAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXHJcbiovXHJcbi8qanNsaW50XHJcbiAgICBldmlsOiB0cnVlLFxyXG4gICAgbm9kZTogdHJ1ZVxyXG4qL1xyXG4ndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBDbG9uZXMgbm9uIG5hdGl2ZSBKYXZhU2NyaXB0IGZ1bmN0aW9ucywgb3IgcmVmZXJlbmNlcyBuYXRpdmUgZnVuY3Rpb25zLlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZS5cclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGEgY2xvbmUgb2YgdGhlIG5vbiBuYXRpdmUgZnVuY3Rpb24sIG9yIGFcclxuICogIHJlZmVyZW5jZSB0byB0aGUgbmF0aXZlIGZ1bmN0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gY2xvbmVGdW5jdGlvbihmdW5jKSB7XHJcbiAgICB2YXIgb3V0O1xyXG4gICAgaWYgKC9cXFtuYXRpdmUgY29kZVxcXS8udGVzdChmdW5jLnRvU3RyaW5nKCkpKSB7XHJcbiAgICAgICAgb3V0ID0gZnVuYztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ID0gZXZhbCgnKGZ1bmN0aW9uKCl7cmV0dXJuICcgKyBmdW5jLnRvU3RyaW5nKCkgKyAnfSgpKTsnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUZ1bmN0aW9uOyIsIi8qXHJcbkxpY2Vuc2UgZ3BsLTMuMCBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTMuMC1zdGFuZGFsb25lLmh0bWxcclxuKi9cclxuLypqc2xpbnRcclxuICAgIHdoaXRlOiB0cnVlLFxyXG4gICAgdmFyczogdHJ1ZSxcclxuICAgIG5vZGU6IHRydWVcclxuKi9cclxuLyoqXHJcbiAqIE1lcmdlcyBKYXZhU2NyaXB0IG9iamVjdHMgcmVjdXJzaXZlbHkgd2l0aG91dCBhbHRlcmluZyB0aGUgb2JqZWN0cyBtZXJnZWQuXHJcbiAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzptYXR0aGV3a2FzdG9yQGdtYWlsLmNvbVwiPk1hdHRoZXcgS2FzdG9yPC9hPlxyXG4gKiBAcGFyYW0ge09iamVjdH0gc2hhZG93cyBbW3NoYWRvd3NdLi4uXSBPbmUgb3IgbW9yZSBvYmplY3RzIHRvIG1lcmdlLiBFYWNoXHJcbiAqICBhcmd1bWVudCBnaXZlbiB3aWxsIGJlIHRyZWF0ZWQgYXMgYW4gb2JqZWN0IHRvIG1lcmdlLiBFYWNoIG9iamVjdCBvdmVyd3JpdGVzXHJcbiAqICB0aGUgcHJldmlvdXMgb2JqZWN0cyBkZXNjZW5kYW50IHByb3BlcnRpZXMgaWYgdGhlIHByb3BlcnR5IG5hbWUgbWF0Y2hlcy4gSWZcclxuICogIG9iamVjdHMgcHJvcGVydGllcyBhcmUgb2JqZWN0cyB0aGV5IHdpbGwgYmUgbWVyZ2VkIHJlY3Vyc2l2ZWx5IGFzIHdlbGwuXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSBzaW5nbGUgbWVyZ2VkIG9iamVjdCBjb21wb3NlZCBmcm9tIGNsb25lcyBvZiB0aGVcclxuICogIGlucHV0IG9iamVjdHMuXHJcbiAqIEBleGFtcGxlXHJcbiAqICB2YXIgb2JqZWN0TWVyZ2UgPSByZXF1aXJlKCdvYmplY3QtbWVyZ2UnKTtcclxuICogIHZhciB4ID0ge1xyXG4gKiAgICAgIGEgOiAnYScsXHJcbiAqICAgICAgYiA6ICdiJyxcclxuICogICAgICBjIDoge1xyXG4gKiAgICAgICAgICBkIDogJ2QnLFxyXG4gKiAgICAgICAgICBlIDogJ2UnLFxyXG4gKiAgICAgICAgICBmIDoge1xyXG4gKiAgICAgICAgICAgICAgZyA6ICdnJ1xyXG4gKiAgICAgICAgICB9XHJcbiAqICAgICAgfVxyXG4gKiAgfTtcclxuICogIHZhciB5ID0ge1xyXG4gKiAgICAgIGEgOiAnYGEnLFxyXG4gKiAgICAgIGIgOiAnYGInLFxyXG4gKiAgICAgIGMgOiB7XHJcbiAqICAgICAgICAgIGQgOiAnYGQnXHJcbiAqICAgICAgfVxyXG4gKiAgfTtcclxuICogIHZhciB6ID0ge1xyXG4gKiAgICAgIGEgOiB7XHJcbiAqICAgICAgICAgIGIgOiAnYGBiJ1xyXG4gKiAgICAgIH0sXHJcbiAqICAgICAgZnVuIDogZnVuY3Rpb24gZm9vICgpIHtcclxuICogICAgICAgICAgcmV0dXJuICdmb28nO1xyXG4gKiAgICAgIH0sXHJcbiAqICAgICAgYXBzIDogQXJyYXkucHJvdG90eXBlLnNsaWNlXHJcbiAqICB9O1xyXG4gKiAgdmFyIG91dCA9IG9iamVjdE1lcmdlKHgsIHksIHopO1xyXG4gKiAgLy8gb3V0LmEgd2lsbCBiZSB7XHJcbiAqICAvLyAgICAgICAgIGIgOiAnYGBiJ1xyXG4gKiAgLy8gICAgIH1cclxuICogIC8vIG91dC5iIHdpbGwgYmUgJ2BiJ1xyXG4gKiAgLy8gb3V0LmMgd2lsbCBiZSB7XHJcbiAqICAvLyAgICAgICAgIGQgOiAnYGQnLFxyXG4gKiAgLy8gICAgICAgICBlIDogJ2UnLFxyXG4gKiAgLy8gICAgICAgICBmIDoge1xyXG4gKiAgLy8gICAgICAgICAgICAgZyA6ICdnJ1xyXG4gKiAgLy8gICAgICAgICB9XHJcbiAqICAvLyAgICAgfVxyXG4gKiAgLy8gb3V0LmZ1biB3aWxsIGJlIGEgY2xvbmUgb2Ygei5mdW5cclxuICogIC8vIG91dC5hcHMgd2lsbCBiZSBlcXVhbCB0byB6LmFwc1xyXG4gKi9cclxuZnVuY3Rpb24gb2JqZWN0TWVyZ2Uoc2hhZG93cykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGNsb25lRnVuY3Rpb24gPSByZXF1aXJlKCdjbG9uZS1mdW5jdGlvbicpO1xyXG4gICAgdmFyIG91dCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICBzaGFkb3dzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgIHNoYWRvd3MuZm9yRWFjaChmdW5jdGlvbiAoc2hhZG93KSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoc2hhZG93KS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgICAgICAgIHZhciB0bXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgICAgICB2YXIgcEJhc2UgPSBvdXRbcHJvcF0gfHwgdG1wO1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgICAgIGlmIChzaGFkb3dbcHJvcF0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcEJhc2UgPSB0eXBlb2Ygb3V0W3Byb3BdID09PSAnb2JqZWN0JyA/IHBCYXNlIDogdG1wO1xyXG4gICAgICAgICAgICAgICAgdG1wID0gb2JqZWN0TWVyZ2UocEJhc2UsIHNoYWRvd1twcm9wXSk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0bXApLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFycltrZXldID0gdG1wW2tleV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRtcCA9IGFycjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFkb3dbcHJvcF0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdG1wID0gY2xvbmVGdW5jdGlvbihzaGFkb3dbcHJvcF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzaGFkb3dbcHJvcF0gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBwQmFzZSA9IHR5cGVvZiBvdXRbcHJvcF0gPT09ICdvYmplY3QnID8gcEJhc2UgOiB0bXA7XHJcbiAgICAgICAgICAgICAgICB0bXAgPSBvYmplY3RNZXJnZShwQmFzZSwgc2hhZG93W3Byb3BdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRtcCA9IHNoYWRvd1twcm9wXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRbcHJvcF0gPSB0bXA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RNZXJnZTsiXX0=
;