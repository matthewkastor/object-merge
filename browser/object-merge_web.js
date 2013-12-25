(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @param {Function} func The function to clone.
 * @returns {Function} Returns a clone of the non native function, or a
 *  reference to the native function.
 */
function cloneFunction(func) {
    var out, str;
    try {
        str = func.toString();
        if (/\[native code\]/.test(str)) {
            out = func;
        } else {
            out = eval('(function(){return ' + str + '}());');
        }
    } catch (e) {
        throw new Error(e.message + '\r\n\r\n' + str);
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
function ObjectMergeOptions(opts) {
    'use strict';
    opts = opts || {};
    this.depth = opts.depth || false;
    // circular ref check is true unless explicitly set to false
    // ignore the jslint warning here, it's pointless.
    this.throwOnCircularRef = 'throwOnCircularRef' in opts && opts.throwOnCircularRef === false ? false : true;
}
/*jslint unparam:true*/
/**
 * Creates a new options object suitable for use with objectMerge.
 * @param {Object} [opts] An object specifying the options.
 * @returns {ObjectMergeOptions} Returns an instance of ObjectMergeOptions
 *  to be used with objectMerge.
 */
function createOptions(opts) {
    'use strict';
    var argz = Array.prototype.slice.call(arguments, 0);
    argz.unshift(null);
    var F = ObjectMergeOptions.bind.apply(ObjectMergeOptions, argz);
    return new F();
}
/*jslint unparam:false*/
/**
 * Merges JavaScript objects recursively without altering the objects merged.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 * @param {ObjectMergeOptions} [opts] An options object created by 
 *  objectMerge.createOptions. Options must be specified as the first argument
 *  and must be an object created with createOptions or else the object will
 *  not be recognized as an options object and will be merged instead.
 * @param {Object} shadows [[shadows]...] One or more objects to merge. Each
 *  argument given will be treated as an object to merge. Each object
 *  overwrites the previous objects descendant properties if the property name
 *  matches. If objects properties are objects they will be merged recursively
 *  as well.
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
    // this is the queue of visited objects / properties.
    var visited = [];
    // various merge options
    var options = {};
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
            try {
                out = cloneFunction(lastShadow);
            } catch (e) {
                throw new Error(e.message);
            }
        } else if (lastShadow instanceof Object) {
            out = {};
        } else {
            // lastShadow is a primitive value;
            out = lastShadow;
        }
        return out;
    }
    // checks for circular references
    function circularReferenceCheck(shadows) {
        // if any of the current objects to process exist in the queue
        // then throw an error.
        shadows.forEach(function (item) {
            if (item instanceof Object && visited.indexOf(item) > -1) {
                throw new Error('Circular reference error');
            }
        });
        // if none of the current objects were in the queue
        // then add references to the queue.
        visited = visited.concat(shadows);
    }
    function main(shadows) {
        var out = getOutputObject(shadows);
        /*jslint unparam: true */
        // recursor defined below. Dougie removed the intelligent suppression of
        // this warning, probably because of functions that reference each other.
        // So, you're stuck with making sure this isn't a mistake every time you
        // use his linter.
        function shadowHandler(val, prop, shadow) {
            if (out[prop]) {
                out[prop] = objectMergeRecursor([
                    out[prop],
                    shadow[prop]
                ]);
            } else {
                out[prop] = objectMergeRecursor([shadow[prop]]);
            }
        }
        /*jslint unparam:false */
        function shadowMerger(shadow) {
            objectForeach(shadow, shadowHandler);
        }
        // short circuits case where output would be a primitive value
        // anyway.
        if (out instanceof Object) {
            // only merges trailing objects since primitives would wipe out
            // previous objects, as in merging {a:'a'}, 'a', and {b:'b'}
            // would result in {b:'b'} so the first two arguments
            // can be ignored completely.
            var relevantShadows = getShadowObjects(shadows);
            relevantShadows.forEach(shadowMerger);
        }
        return out;
    }
    function objectMergeRecursor(shadows) {
        if (options.throwOnCircularRef === true) {
            circularReferenceCheck(shadows);
        }
        return main(shadows);
    }
    // determines whether an options object was passed in and
    // uses it if present
    // ignore the jslint warning here too.
    if (arguments[0] instanceof ObjectMergeOptions) {
        options = arguments[0];
        shadows = Array.prototype.slice.call(arguments, 1);
    } else {
        options = createOptions();
        shadows = Array.prototype.slice.call(arguments, 0);
    }
    return objectMergeRecursor(shadows);
}
objectMerge.createOptions = createOptions;
module.exports = objectMerge;
},{"clone-function":2,"object-foreach":3}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9rYXN0b3IvRG9jdW1lbnRzL0dpdEh1Yi9vYmplY3QtbWVyZ2UvZGV2L2Jyb3dzZXJNYWluLmpzIiwiQzovVXNlcnMva2FzdG9yL0RvY3VtZW50cy9HaXRIdWIvb2JqZWN0LW1lcmdlL25vZGVfbW9kdWxlcy9jbG9uZS1mdW5jdGlvbi9zcmMvY2xvbmUtZnVuY3Rpb24uanMiLCJDOi9Vc2Vycy9rYXN0b3IvRG9jdW1lbnRzL0dpdEh1Yi9vYmplY3QtbWVyZ2Uvbm9kZV9tb2R1bGVzL29iamVjdC1mb3JlYWNoL3NyYy9vYmplY3QtZm9yZWFjaC5qcyIsIkM6L1VzZXJzL2thc3Rvci9Eb2N1bWVudHMvR2l0SHViL29iamVjdC1tZXJnZS9zcmMvb2JqZWN0LW1lcmdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJvYmplY3RNZXJnZSA9IHJlcXVpcmUoJy4uL3NyYy9vYmplY3QtbWVyZ2UuanMnKTtcclxuIiwiLypcclxuTGljZW5zZSBncGwtMy4wIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLXN0YW5kYWxvbmUuaHRtbFxyXG4qL1xyXG4vKmpzbGludFxyXG4gICAgZXZpbDogdHJ1ZSxcclxuICAgIG5vZGU6IHRydWVcclxuKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogQ2xvbmVzIG5vbiBuYXRpdmUgSmF2YVNjcmlwdCBmdW5jdGlvbnMsIG9yIHJlZmVyZW5jZXMgbmF0aXZlIGZ1bmN0aW9ucy5cclxuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOm1hdHRoZXdrYXN0b3JAZ21haWwuY29tXCI+TWF0dGhldyBLYXN0b3I8L2E+XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lLlxyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYSBjbG9uZSBvZiB0aGUgbm9uIG5hdGl2ZSBmdW5jdGlvbiwgb3IgYVxyXG4gKiAgcmVmZXJlbmNlIHRvIHRoZSBuYXRpdmUgZnVuY3Rpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9uZUZ1bmN0aW9uKGZ1bmMpIHtcclxuICAgIHZhciBvdXQsIHN0cjtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgc3RyID0gZnVuYy50b1N0cmluZygpO1xyXG4gICAgICAgIGlmICgvXFxbbmF0aXZlIGNvZGVcXF0vLnRlc3Qoc3RyKSkge1xyXG4gICAgICAgICAgICBvdXQgPSBmdW5jO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dCA9IGV2YWwoJyhmdW5jdGlvbigpe3JldHVybiAnICsgc3RyICsgJ30oKSk7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlLm1lc3NhZ2UgKyAnXFxyXFxuXFxyXFxuJyArIHN0cik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gY2xvbmVGdW5jdGlvbjsiLCIvKipcclxuICogRXhlY3V0ZXMgYSBmdW5jdGlvbiBvbiBlYWNoIG9mIGFuIG9iamVjdHMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcy4gVGhlXHJcbiAqICBjYWxsYmFjayBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhyZWUgYXJndW1lbnRzOiB0aGUgdmFsdWUgb2YgdGhlIGN1cnJlbnRcclxuICogIHByb3BlcnR5LCB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHksIGFuZCB0aGUgb2JqZWN0IGJlaW5nIHByb2Nlc3NlZC4gVGhpcyBpc1xyXG4gKiAgcm91Z2hseSBlcXVpdmFsZW50IHRvIHRoZSBzaWduYXR1cmUgZm9yIGNhbGxiYWNrcyB0b1xyXG4gKiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBhY3Qgb24uXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlLlxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBnaXZlbiBvYmplY3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBvYmplY3RGb3JlYWNoKG9iaiwgY2FsbGJhY2spIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgICAgY2FsbGJhY2sob2JqW3Byb3BdLCBwcm9wLCBvYmopO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdEZvcmVhY2g7IiwiLypcclxuTGljZW5zZSBncGwtMy4wIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLXN0YW5kYWxvbmUuaHRtbFxyXG4qL1xyXG4vKmpzbGludFxyXG4gICAgd2hpdGU6IHRydWUsXHJcbiAgICB2YXJzOiB0cnVlLFxyXG4gICAgbm9kZTogdHJ1ZVxyXG4qL1xyXG5mdW5jdGlvbiBPYmplY3RNZXJnZU9wdGlvbnMob3B0cykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgb3B0cyA9IG9wdHMgfHwge307XHJcbiAgICB0aGlzLmRlcHRoID0gb3B0cy5kZXB0aCB8fCBmYWxzZTtcclxuICAgIC8vIGNpcmN1bGFyIHJlZiBjaGVjayBpcyB0cnVlIHVubGVzcyBleHBsaWNpdGx5IHNldCB0byBmYWxzZVxyXG4gICAgLy8gaWdub3JlIHRoZSBqc2xpbnQgd2FybmluZyBoZXJlLCBpdCdzIHBvaW50bGVzcy5cclxuICAgIHRoaXMudGhyb3dPbkNpcmN1bGFyUmVmID0gJ3Rocm93T25DaXJjdWxhclJlZicgaW4gb3B0cyAmJiBvcHRzLnRocm93T25DaXJjdWxhclJlZiA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7XHJcbn1cclxuLypqc2xpbnQgdW5wYXJhbTp0cnVlKi9cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgb3B0aW9ucyBvYmplY3Qgc3VpdGFibGUgZm9yIHVzZSB3aXRoIG9iamVjdE1lcmdlLlxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIEFuIG9iamVjdCBzcGVjaWZ5aW5nIHRoZSBvcHRpb25zLlxyXG4gKiBAcmV0dXJucyB7T2JqZWN0TWVyZ2VPcHRpb25zfSBSZXR1cm5zIGFuIGluc3RhbmNlIG9mIE9iamVjdE1lcmdlT3B0aW9uc1xyXG4gKiAgdG8gYmUgdXNlZCB3aXRoIG9iamVjdE1lcmdlLlxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlT3B0aW9ucyhvcHRzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgYXJneiA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcbiAgICBhcmd6LnVuc2hpZnQobnVsbCk7XHJcbiAgICB2YXIgRiA9IE9iamVjdE1lcmdlT3B0aW9ucy5iaW5kLmFwcGx5KE9iamVjdE1lcmdlT3B0aW9ucywgYXJneik7XHJcbiAgICByZXR1cm4gbmV3IEYoKTtcclxufVxyXG4vKmpzbGludCB1bnBhcmFtOmZhbHNlKi9cclxuLyoqXHJcbiAqIE1lcmdlcyBKYXZhU2NyaXB0IG9iamVjdHMgcmVjdXJzaXZlbHkgd2l0aG91dCBhbHRlcmluZyB0aGUgb2JqZWN0cyBtZXJnZWQuXHJcbiAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzptYXR0aGV3a2FzdG9yQGdtYWlsLmNvbVwiPk1hdHRoZXcgS2FzdG9yPC9hPlxyXG4gKiBAcGFyYW0ge09iamVjdE1lcmdlT3B0aW9uc30gW29wdHNdIEFuIG9wdGlvbnMgb2JqZWN0IGNyZWF0ZWQgYnkgXHJcbiAqICBvYmplY3RNZXJnZS5jcmVhdGVPcHRpb25zLiBPcHRpb25zIG11c3QgYmUgc3BlY2lmaWVkIGFzIHRoZSBmaXJzdCBhcmd1bWVudFxyXG4gKiAgYW5kIG11c3QgYmUgYW4gb2JqZWN0IGNyZWF0ZWQgd2l0aCBjcmVhdGVPcHRpb25zIG9yIGVsc2UgdGhlIG9iamVjdCB3aWxsXHJcbiAqICBub3QgYmUgcmVjb2duaXplZCBhcyBhbiBvcHRpb25zIG9iamVjdCBhbmQgd2lsbCBiZSBtZXJnZWQgaW5zdGVhZC5cclxuICogQHBhcmFtIHtPYmplY3R9IHNoYWRvd3MgW1tzaGFkb3dzXS4uLl0gT25lIG9yIG1vcmUgb2JqZWN0cyB0byBtZXJnZS4gRWFjaFxyXG4gKiAgYXJndW1lbnQgZ2l2ZW4gd2lsbCBiZSB0cmVhdGVkIGFzIGFuIG9iamVjdCB0byBtZXJnZS4gRWFjaCBvYmplY3RcclxuICogIG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIG9iamVjdHMgZGVzY2VuZGFudCBwcm9wZXJ0aWVzIGlmIHRoZSBwcm9wZXJ0eSBuYW1lXHJcbiAqICBtYXRjaGVzLiBJZiBvYmplY3RzIHByb3BlcnRpZXMgYXJlIG9iamVjdHMgdGhleSB3aWxsIGJlIG1lcmdlZCByZWN1cnNpdmVseVxyXG4gKiAgYXMgd2VsbC5cclxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIHNpbmdsZSBtZXJnZWQgb2JqZWN0IGNvbXBvc2VkIGZyb20gY2xvbmVzIG9mIHRoZVxyXG4gKiAgaW5wdXQgb2JqZWN0cy5cclxuICogQGV4YW1wbGVcclxuICogIHZhciBvYmplY3RNZXJnZSA9IHJlcXVpcmUoJ29iamVjdC1tZXJnZScpO1xyXG4gKiAgdmFyIHggPSB7XHJcbiAqICAgICAgYSA6ICdhJyxcclxuICogICAgICBiIDogJ2InLFxyXG4gKiAgICAgIGMgOiB7XHJcbiAqICAgICAgICAgIGQgOiAnZCcsXHJcbiAqICAgICAgICAgIGUgOiAnZScsXHJcbiAqICAgICAgICAgIGYgOiB7XHJcbiAqICAgICAgICAgICAgICBnIDogJ2cnXHJcbiAqICAgICAgICAgIH1cclxuICogICAgICB9XHJcbiAqICB9O1xyXG4gKiAgdmFyIHkgPSB7XHJcbiAqICAgICAgYSA6ICdgYScsXHJcbiAqICAgICAgYiA6ICdgYicsXHJcbiAqICAgICAgYyA6IHtcclxuICogICAgICAgICAgZCA6ICdgZCdcclxuICogICAgICB9XHJcbiAqICB9O1xyXG4gKiAgdmFyIHogPSB7XHJcbiAqICAgICAgYSA6IHtcclxuICogICAgICAgICAgYiA6ICdgYGInXHJcbiAqICAgICAgfSxcclxuICogICAgICBmdW4gOiBmdW5jdGlvbiBmb28gKCkge1xyXG4gKiAgICAgICAgICByZXR1cm4gJ2Zvbyc7XHJcbiAqICAgICAgfSxcclxuICogICAgICBhcHMgOiBBcnJheS5wcm90b3R5cGUuc2xpY2VcclxuICogIH07XHJcbiAqICB2YXIgb3V0ID0gb2JqZWN0TWVyZ2UoeCwgeSwgeik7XHJcbiAqICAvLyBvdXQuYSB3aWxsIGJlIHtcclxuICogIC8vICAgICAgICAgYiA6ICdgYGInXHJcbiAqICAvLyAgICAgfVxyXG4gKiAgLy8gb3V0LmIgd2lsbCBiZSAnYGInXHJcbiAqICAvLyBvdXQuYyB3aWxsIGJlIHtcclxuICogIC8vICAgICAgICAgZCA6ICdgZCcsXHJcbiAqICAvLyAgICAgICAgIGUgOiAnZScsXHJcbiAqICAvLyAgICAgICAgIGYgOiB7XHJcbiAqICAvLyAgICAgICAgICAgICBnIDogJ2cnXHJcbiAqICAvLyAgICAgICAgIH1cclxuICogIC8vICAgICB9XHJcbiAqICAvLyBvdXQuZnVuIHdpbGwgYmUgYSBjbG9uZSBvZiB6LmZ1blxyXG4gKiAgLy8gb3V0LmFwcyB3aWxsIGJlIGVxdWFsIHRvIHouYXBzXHJcbiAqL1xyXG5mdW5jdGlvbiBvYmplY3RNZXJnZShzaGFkb3dzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgb2JqZWN0Rm9yZWFjaCA9IHJlcXVpcmUoJ29iamVjdC1mb3JlYWNoJyk7XHJcbiAgICB2YXIgY2xvbmVGdW5jdGlvbiA9IHJlcXVpcmUoJ2Nsb25lLWZ1bmN0aW9uJyk7XHJcbiAgICAvLyB0aGlzIGlzIHRoZSBxdWV1ZSBvZiB2aXNpdGVkIG9iamVjdHMgLyBwcm9wZXJ0aWVzLlxyXG4gICAgdmFyIHZpc2l0ZWQgPSBbXTtcclxuICAgIC8vIHZhcmlvdXMgbWVyZ2Ugb3B0aW9uc1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcclxuICAgIC8vIGdldHMgdGhlIHNlcXVlbnRpYWwgdHJhaWxpbmcgb2JqZWN0cyBmcm9tIGFycmF5LlxyXG4gICAgZnVuY3Rpb24gZ2V0U2hhZG93T2JqZWN0cyhzaGFkb3dzKSB7XHJcbiAgICAgICAgdmFyIG91dCA9IHNoYWRvd3MucmVkdWNlKGZ1bmN0aW9uIChjb2xsZWN0b3IsIHNoYWRvdykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNoYWRvdyBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rvci5wdXNoKHNoYWRvdyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3RvciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3RvcjtcclxuICAgICAgICAgICAgfSwgW10pO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvLyBnZXRzIGVpdGhlciBhIG5ldyBvYmplY3Qgb2YgdGhlIHByb3BlciB0eXBlIG9yIHRoZSBsYXN0IHByaW1pdGl2ZSB2YWx1ZVxyXG4gICAgZnVuY3Rpb24gZ2V0T3V0cHV0T2JqZWN0KHNoYWRvd3MpIHtcclxuICAgICAgICB2YXIgb3V0O1xyXG4gICAgICAgIHZhciBsYXN0U2hhZG93ID0gc2hhZG93c1tzaGFkb3dzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmIChsYXN0U2hhZG93IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgb3V0ID0gW107XHJcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0U2hhZG93IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIG91dCA9IGNsb25lRnVuY3Rpb24obGFzdFNoYWRvdyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0U2hhZG93IGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IHt9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGxhc3RTaGFkb3cgaXMgYSBwcmltaXRpdmUgdmFsdWU7XHJcbiAgICAgICAgICAgIG91dCA9IGxhc3RTaGFkb3c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvLyBjaGVja3MgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXNcclxuICAgIGZ1bmN0aW9uIGNpcmN1bGFyUmVmZXJlbmNlQ2hlY2soc2hhZG93cykge1xyXG4gICAgICAgIC8vIGlmIGFueSBvZiB0aGUgY3VycmVudCBvYmplY3RzIHRvIHByb2Nlc3MgZXhpc3QgaW4gdGhlIHF1ZXVlXHJcbiAgICAgICAgLy8gdGhlbiB0aHJvdyBhbiBlcnJvci5cclxuICAgICAgICBzaGFkb3dzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBPYmplY3QgJiYgdmlzaXRlZC5pbmRleE9mKGl0ZW0pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2lyY3VsYXIgcmVmZXJlbmNlIGVycm9yJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBpZiBub25lIG9mIHRoZSBjdXJyZW50IG9iamVjdHMgd2VyZSBpbiB0aGUgcXVldWVcclxuICAgICAgICAvLyB0aGVuIGFkZCByZWZlcmVuY2VzIHRvIHRoZSBxdWV1ZS5cclxuICAgICAgICB2aXNpdGVkID0gdmlzaXRlZC5jb25jYXQoc2hhZG93cyk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBtYWluKHNoYWRvd3MpIHtcclxuICAgICAgICB2YXIgb3V0ID0gZ2V0T3V0cHV0T2JqZWN0KHNoYWRvd3MpO1xyXG4gICAgICAgIC8qanNsaW50IHVucGFyYW06IHRydWUgKi9cclxuICAgICAgICAvLyByZWN1cnNvciBkZWZpbmVkIGJlbG93LiBEb3VnaWUgcmVtb3ZlZCB0aGUgaW50ZWxsaWdlbnQgc3VwcHJlc3Npb24gb2ZcclxuICAgICAgICAvLyB0aGlzIHdhcm5pbmcsIHByb2JhYmx5IGJlY2F1c2Ugb2YgZnVuY3Rpb25zIHRoYXQgcmVmZXJlbmNlIGVhY2ggb3RoZXIuXHJcbiAgICAgICAgLy8gU28sIHlvdSdyZSBzdHVjayB3aXRoIG1ha2luZyBzdXJlIHRoaXMgaXNuJ3QgYSBtaXN0YWtlIGV2ZXJ5IHRpbWUgeW91XHJcbiAgICAgICAgLy8gdXNlIGhpcyBsaW50ZXIuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hhZG93SGFuZGxlcih2YWwsIHByb3AsIHNoYWRvdykge1xyXG4gICAgICAgICAgICBpZiAob3V0W3Byb3BdKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbcHJvcF0gPSBvYmplY3RNZXJnZVJlY3Vyc29yKFtcclxuICAgICAgICAgICAgICAgICAgICBvdXRbcHJvcF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhZG93W3Byb3BdXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dFtwcm9wXSA9IG9iamVjdE1lcmdlUmVjdXJzb3IoW3NoYWRvd1twcm9wXV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qanNsaW50IHVucGFyYW06ZmFsc2UgKi9cclxuICAgICAgICBmdW5jdGlvbiBzaGFkb3dNZXJnZXIoc2hhZG93KSB7XHJcbiAgICAgICAgICAgIG9iamVjdEZvcmVhY2goc2hhZG93LCBzaGFkb3dIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2hvcnQgY2lyY3VpdHMgY2FzZSB3aGVyZSBvdXRwdXQgd291bGQgYmUgYSBwcmltaXRpdmUgdmFsdWVcclxuICAgICAgICAvLyBhbnl3YXkuXHJcbiAgICAgICAgaWYgKG91dCBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IG1lcmdlcyB0cmFpbGluZyBvYmplY3RzIHNpbmNlIHByaW1pdGl2ZXMgd291bGQgd2lwZSBvdXRcclxuICAgICAgICAgICAgLy8gcHJldmlvdXMgb2JqZWN0cywgYXMgaW4gbWVyZ2luZyB7YTonYSd9LCAnYScsIGFuZCB7YjonYid9XHJcbiAgICAgICAgICAgIC8vIHdvdWxkIHJlc3VsdCBpbiB7YjonYid9IHNvIHRoZSBmaXJzdCB0d28gYXJndW1lbnRzXHJcbiAgICAgICAgICAgIC8vIGNhbiBiZSBpZ25vcmVkIGNvbXBsZXRlbHkuXHJcbiAgICAgICAgICAgIHZhciByZWxldmFudFNoYWRvd3MgPSBnZXRTaGFkb3dPYmplY3RzKHNoYWRvd3MpO1xyXG4gICAgICAgICAgICByZWxldmFudFNoYWRvd3MuZm9yRWFjaChzaGFkb3dNZXJnZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb2JqZWN0TWVyZ2VSZWN1cnNvcihzaGFkb3dzKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudGhyb3dPbkNpcmN1bGFyUmVmID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNpcmN1bGFyUmVmZXJlbmNlQ2hlY2soc2hhZG93cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYWluKHNoYWRvd3MpO1xyXG4gICAgfVxyXG4gICAgLy8gZGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IHdhcyBwYXNzZWQgaW4gYW5kXHJcbiAgICAvLyB1c2VzIGl0IGlmIHByZXNlbnRcclxuICAgIC8vIGlnbm9yZSB0aGUganNsaW50IHdhcm5pbmcgaGVyZSB0b28uXHJcbiAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgT2JqZWN0TWVyZ2VPcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBzaGFkb3dzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnMoKTtcclxuICAgICAgICBzaGFkb3dzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmplY3RNZXJnZVJlY3Vyc29yKHNoYWRvd3MpO1xyXG59XHJcbm9iamVjdE1lcmdlLmNyZWF0ZU9wdGlvbnMgPSBjcmVhdGVPcHRpb25zO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdE1lcmdlOyJdfQ==
