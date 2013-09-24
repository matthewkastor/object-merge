;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
objectMerge = require('../src/object-merge.js');

},{"../src/object-merge.js":4}],2:[function(require,module,exports){
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
/**
 * Executes a function on each of an objects own enumerable properties. The
 *  callback function will receive three arguments: the value of the current
 *  property, the name of the property, and the object being processed. This is
 *  roughly equivalent to the signature for callbacks to
 *  Array.prototype.forEach.
 * @param {Object} obj The object to act on.
 * @param {Function} callback The function to execute.
 * @returns {Object} Returns the given object.
 */
function objectForeach(obj, callback) {
    "use strict";
    Object.keys(obj).forEach(function (prop) {
        callback(obj[prop], prop, obj);
    });
    return obj;
};
module.exports = objectForeach;
},{}],4:[function(require,module,exports){
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
    var objectForeach = require('object-foreach');
    var cloneFunction = require('clone-function');
    shadows = Array.prototype.slice.call(arguments, 0);
    // gets the sequential trailing objects from array.
    function getShadowObjects(shadows) {
        var out = shadows.reduce(function (collector, shadow) {
                if (shadow instanceof Object) {
                    collector.push(shadow);
                } else {
                    collector = [];
                }
                return collector;
            }, []);
        return out;
    }
    // gets either a new object of the proper type or the last primitive value
    function getOutputObject(shadows) {
        var out;
        var lastShadow = shadows[shadows.length - 1];
        if (lastShadow instanceof Array) {
            out = [];
        } else if (lastShadow instanceof Function) {
            out = cloneFunction(lastShadow);
        } else if (lastShadow instanceof Object) {
            out = {};
        } else {
            // lastShadow is a primitive value;
            out = lastShadow;
        }
        return out;
    }
    function main(shadows) {
        var out = getOutputObject(shadows);
        function shadowHandler(val, prop, shadow) {
            /*jslint unparam:true */
            if (out[prop]) {
                out[prop] = objectMerge(out[prop], shadow[prop]);
            } else {
                out[prop] = objectMerge(shadow[prop]);
            }
        }
        function shadowMerger(shadow) {
            objectForeach(shadow, shadowHandler);
        }
        // short circuits case where output would be a primitive value anyway.
        if (out instanceof Object) {
            // only merges trailing objects since primitives would wipe out previous
            // objects, as in merging {a:'a'}, 'a', and {b:'b'} would result in
            // {b:'b'} so the first two arguments can be ignored completely.
            var relevantShadows = getShadowObjects(shadows);
            relevantShadows.forEach(shadowMerger);
        }
        return out;
    }
    return main(shadows);
}
module.exports = objectMerge;
},{"clone-function":2,"object-foreach":3}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGthc3RvclxcRG9jdW1lbnRzXFxHaXRIdWJcXG9iamVjdC1tZXJnZVxcZGV2XFxicm93c2VyTWFpbi5qcyIsIkM6XFxVc2Vyc1xca2FzdG9yXFxEb2N1bWVudHNcXEdpdEh1Ylxcb2JqZWN0LW1lcmdlXFxub2RlX21vZHVsZXNcXGNsb25lLWZ1bmN0aW9uXFxzcmNcXGNsb25lLWZ1bmN0aW9uLmpzIiwiQzpcXFVzZXJzXFxrYXN0b3JcXERvY3VtZW50c1xcR2l0SHViXFxvYmplY3QtbWVyZ2VcXG5vZGVfbW9kdWxlc1xcb2JqZWN0LWZvcmVhY2hcXHNyY1xcb2JqZWN0LWZvcmVhY2guanMiLCJDOlxcVXNlcnNcXGthc3RvclxcRG9jdW1lbnRzXFxHaXRIdWJcXG9iamVjdC1tZXJnZVxcc3JjXFxvYmplY3QtbWVyZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIm9iamVjdE1lcmdlID0gcmVxdWlyZSgnLi4vc3JjL29iamVjdC1tZXJnZS5qcycpO1xyXG4iLCIvKlxyXG5MaWNlbnNlIGdwbC0zLjAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXHJcbiovXHJcbi8qanNsaW50XHJcbiAgICBldmlsOiB0cnVlLFxyXG4gICAgbm9kZTogdHJ1ZVxyXG4qL1xyXG4ndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBDbG9uZXMgbm9uIG5hdGl2ZSBKYXZhU2NyaXB0IGZ1bmN0aW9ucywgb3IgcmVmZXJlbmNlcyBuYXRpdmUgZnVuY3Rpb25zLlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZS5cclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGEgY2xvbmUgb2YgdGhlIG5vbiBuYXRpdmUgZnVuY3Rpb24sIG9yIGFcclxuICogIHJlZmVyZW5jZSB0byB0aGUgbmF0aXZlIGZ1bmN0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gY2xvbmVGdW5jdGlvbihmdW5jKSB7XHJcbiAgICB2YXIgb3V0O1xyXG4gICAgaWYgKC9cXFtuYXRpdmUgY29kZVxcXS8udGVzdChmdW5jLnRvU3RyaW5nKCkpKSB7XHJcbiAgICAgICAgb3V0ID0gZnVuYztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ID0gZXZhbCgnKGZ1bmN0aW9uKCl7cmV0dXJuICcgKyBmdW5jLnRvU3RyaW5nKCkgKyAnfSgpKTsnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUZ1bmN0aW9uOyIsIi8qKlxyXG4gKiBFeGVjdXRlcyBhIGZ1bmN0aW9uIG9uIGVhY2ggb2YgYW4gb2JqZWN0cyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBUaGVcclxuICogIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aHJlZSBhcmd1bWVudHM6IHRoZSB2YWx1ZSBvZiB0aGUgY3VycmVudFxyXG4gKiAgcHJvcGVydHksIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSwgYW5kIHRoZSBvYmplY3QgYmVpbmcgcHJvY2Vzc2VkLiBUaGlzIGlzXHJcbiAqICByb3VnaGx5IGVxdWl2YWxlbnQgdG8gdGhlIHNpZ25hdHVyZSBmb3IgY2FsbGJhY2tzIHRvXHJcbiAqICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5cclxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGFjdCBvbi5cclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUuXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGdpdmVuIG9iamVjdC5cclxuICovXHJcbmZ1bmN0aW9uIG9iamVjdEZvcmVhY2gob2JqLCBjYWxsYmFjaykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgICBjYWxsYmFjayhvYmpbcHJvcF0sIHByb3AsIG9iaik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBvYmo7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0Rm9yZWFjaDsiLCIvKlxyXG5MaWNlbnNlIGdwbC0zLjAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXHJcbiovXHJcbi8qanNsaW50XHJcbiAgICB3aGl0ZTogdHJ1ZSxcclxuICAgIHZhcnM6IHRydWUsXHJcbiAgICBub2RlOiB0cnVlXHJcbiovXHJcbi8qKlxyXG4gKiBNZXJnZXMgSmF2YVNjcmlwdCBvYmplY3RzIHJlY3Vyc2l2ZWx5IHdpdGhvdXQgYWx0ZXJpbmcgdGhlIG9iamVjdHMgbWVyZ2VkLlxyXG4gKiBAYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86bWF0dGhld2thc3RvckBnbWFpbC5jb21cIj5NYXR0aGV3IEthc3RvcjwvYT5cclxuICogQHBhcmFtIHtPYmplY3R9IHNoYWRvd3MgW1tzaGFkb3dzXS4uLl0gT25lIG9yIG1vcmUgb2JqZWN0cyB0byBtZXJnZS4gRWFjaFxyXG4gKiAgYXJndW1lbnQgZ2l2ZW4gd2lsbCBiZSB0cmVhdGVkIGFzIGFuIG9iamVjdCB0byBtZXJnZS4gRWFjaCBvYmplY3Qgb3ZlcndyaXRlc1xyXG4gKiAgdGhlIHByZXZpb3VzIG9iamVjdHMgZGVzY2VuZGFudCBwcm9wZXJ0aWVzIGlmIHRoZSBwcm9wZXJ0eSBuYW1lIG1hdGNoZXMuIElmXHJcbiAqICBvYmplY3RzIHByb3BlcnRpZXMgYXJlIG9iamVjdHMgdGhleSB3aWxsIGJlIG1lcmdlZCByZWN1cnNpdmVseSBhcyB3ZWxsLlxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgc2luZ2xlIG1lcmdlZCBvYmplY3QgY29tcG9zZWQgZnJvbSBjbG9uZXMgb2YgdGhlXHJcbiAqICBpbnB1dCBvYmplY3RzLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiAgdmFyIG9iamVjdE1lcmdlID0gcmVxdWlyZSgnb2JqZWN0LW1lcmdlJyk7XHJcbiAqICB2YXIgeCA9IHtcclxuICogICAgICBhIDogJ2EnLFxyXG4gKiAgICAgIGIgOiAnYicsXHJcbiAqICAgICAgYyA6IHtcclxuICogICAgICAgICAgZCA6ICdkJyxcclxuICogICAgICAgICAgZSA6ICdlJyxcclxuICogICAgICAgICAgZiA6IHtcclxuICogICAgICAgICAgICAgIGcgOiAnZydcclxuICogICAgICAgICAgfVxyXG4gKiAgICAgIH1cclxuICogIH07XHJcbiAqICB2YXIgeSA9IHtcclxuICogICAgICBhIDogJ2BhJyxcclxuICogICAgICBiIDogJ2BiJyxcclxuICogICAgICBjIDoge1xyXG4gKiAgICAgICAgICBkIDogJ2BkJ1xyXG4gKiAgICAgIH1cclxuICogIH07XHJcbiAqICB2YXIgeiA9IHtcclxuICogICAgICBhIDoge1xyXG4gKiAgICAgICAgICBiIDogJ2BgYidcclxuICogICAgICB9LFxyXG4gKiAgICAgIGZ1biA6IGZ1bmN0aW9uIGZvbyAoKSB7XHJcbiAqICAgICAgICAgIHJldHVybiAnZm9vJztcclxuICogICAgICB9LFxyXG4gKiAgICAgIGFwcyA6IEFycmF5LnByb3RvdHlwZS5zbGljZVxyXG4gKiAgfTtcclxuICogIHZhciBvdXQgPSBvYmplY3RNZXJnZSh4LCB5LCB6KTtcclxuICogIC8vIG91dC5hIHdpbGwgYmUge1xyXG4gKiAgLy8gICAgICAgICBiIDogJ2BgYidcclxuICogIC8vICAgICB9XHJcbiAqICAvLyBvdXQuYiB3aWxsIGJlICdgYidcclxuICogIC8vIG91dC5jIHdpbGwgYmUge1xyXG4gKiAgLy8gICAgICAgICBkIDogJ2BkJyxcclxuICogIC8vICAgICAgICAgZSA6ICdlJyxcclxuICogIC8vICAgICAgICAgZiA6IHtcclxuICogIC8vICAgICAgICAgICAgIGcgOiAnZydcclxuICogIC8vICAgICAgICAgfVxyXG4gKiAgLy8gICAgIH1cclxuICogIC8vIG91dC5mdW4gd2lsbCBiZSBhIGNsb25lIG9mIHouZnVuXHJcbiAqICAvLyBvdXQuYXBzIHdpbGwgYmUgZXF1YWwgdG8gei5hcHNcclxuICovXHJcbmZ1bmN0aW9uIG9iamVjdE1lcmdlKHNoYWRvd3MpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBvYmplY3RGb3JlYWNoID0gcmVxdWlyZSgnb2JqZWN0LWZvcmVhY2gnKTtcclxuICAgIHZhciBjbG9uZUZ1bmN0aW9uID0gcmVxdWlyZSgnY2xvbmUtZnVuY3Rpb24nKTtcclxuICAgIHNoYWRvd3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xyXG4gICAgLy8gZ2V0cyB0aGUgc2VxdWVudGlhbCB0cmFpbGluZyBvYmplY3RzIGZyb20gYXJyYXkuXHJcbiAgICBmdW5jdGlvbiBnZXRTaGFkb3dPYmplY3RzKHNoYWRvd3MpIHtcclxuICAgICAgICB2YXIgb3V0ID0gc2hhZG93cy5yZWR1Y2UoZnVuY3Rpb24gKGNvbGxlY3Rvciwgc2hhZG93KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hhZG93IGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdG9yLnB1c2goc2hhZG93KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdG9yID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdG9yO1xyXG4gICAgICAgICAgICB9LCBbXSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8vIGdldHMgZWl0aGVyIGEgbmV3IG9iamVjdCBvZiB0aGUgcHJvcGVyIHR5cGUgb3IgdGhlIGxhc3QgcHJpbWl0aXZlIHZhbHVlXHJcbiAgICBmdW5jdGlvbiBnZXRPdXRwdXRPYmplY3Qoc2hhZG93cykge1xyXG4gICAgICAgIHZhciBvdXQ7XHJcbiAgICAgICAgdmFyIGxhc3RTaGFkb3cgPSBzaGFkb3dzW3NoYWRvd3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgaWYgKGxhc3RTaGFkb3cgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBvdXQgPSBbXTtcclxuICAgICAgICB9IGVsc2UgaWYgKGxhc3RTaGFkb3cgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBvdXQgPSBjbG9uZUZ1bmN0aW9uKGxhc3RTaGFkb3cpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobGFzdFNoYWRvdyBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICBvdXQgPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBsYXN0U2hhZG93IGlzIGEgcHJpbWl0aXZlIHZhbHVlO1xyXG4gICAgICAgICAgICBvdXQgPSBsYXN0U2hhZG93O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbWFpbihzaGFkb3dzKSB7XHJcbiAgICAgICAgdmFyIG91dCA9IGdldE91dHB1dE9iamVjdChzaGFkb3dzKTtcclxuICAgICAgICBmdW5jdGlvbiBzaGFkb3dIYW5kbGVyKHZhbCwgcHJvcCwgc2hhZG93KSB7XHJcbiAgICAgICAgICAgIC8qanNsaW50IHVucGFyYW06dHJ1ZSAqL1xyXG4gICAgICAgICAgICBpZiAob3V0W3Byb3BdKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbcHJvcF0gPSBvYmplY3RNZXJnZShvdXRbcHJvcF0sIHNoYWRvd1twcm9wXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbcHJvcF0gPSBvYmplY3RNZXJnZShzaGFkb3dbcHJvcF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNoYWRvd01lcmdlcihzaGFkb3cpIHtcclxuICAgICAgICAgICAgb2JqZWN0Rm9yZWFjaChzaGFkb3csIHNoYWRvd0hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzaG9ydCBjaXJjdWl0cyBjYXNlIHdoZXJlIG91dHB1dCB3b3VsZCBiZSBhIHByaW1pdGl2ZSB2YWx1ZSBhbnl3YXkuXHJcbiAgICAgICAgaWYgKG91dCBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IG1lcmdlcyB0cmFpbGluZyBvYmplY3RzIHNpbmNlIHByaW1pdGl2ZXMgd291bGQgd2lwZSBvdXQgcHJldmlvdXNcclxuICAgICAgICAgICAgLy8gb2JqZWN0cywgYXMgaW4gbWVyZ2luZyB7YTonYSd9LCAnYScsIGFuZCB7YjonYid9IHdvdWxkIHJlc3VsdCBpblxyXG4gICAgICAgICAgICAvLyB7YjonYid9IHNvIHRoZSBmaXJzdCB0d28gYXJndW1lbnRzIGNhbiBiZSBpZ25vcmVkIGNvbXBsZXRlbHkuXHJcbiAgICAgICAgICAgIHZhciByZWxldmFudFNoYWRvd3MgPSBnZXRTaGFkb3dPYmplY3RzKHNoYWRvd3MpO1xyXG4gICAgICAgICAgICByZWxldmFudFNoYWRvd3MuZm9yRWFjaChzaGFkb3dNZXJnZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1haW4oc2hhZG93cyk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RNZXJnZTsiXX0=
;