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