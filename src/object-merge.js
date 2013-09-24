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