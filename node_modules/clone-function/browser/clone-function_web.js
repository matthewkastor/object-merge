;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
cloneFunction = require('../src/clone-function.js');

},{"../src/clone-function.js":2}],2:[function(require,module,exports){
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
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGthc3RvclxcRG9jdW1lbnRzXFxHaXRIdWJcXGF0cm9wYS1wYWNrYWdlLWdlbmVyYXRvclxcbm9kZV9tb2R1bGVzXFxvYmplY3QtbWVyZ2VcXG5vZGVfbW9kdWxlc1xcY2xvbmUtZnVuY3Rpb25cXGRldlxcYnJvd3Nlck1haW4uanMiLCJDOlxcVXNlcnNcXGthc3RvclxcRG9jdW1lbnRzXFxHaXRIdWJcXGF0cm9wYS1wYWNrYWdlLWdlbmVyYXRvclxcbm9kZV9tb2R1bGVzXFxvYmplY3QtbWVyZ2VcXG5vZGVfbW9kdWxlc1xcY2xvbmUtZnVuY3Rpb25cXHNyY1xcY2xvbmUtZnVuY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiY2xvbmVGdW5jdGlvbiA9IHJlcXVpcmUoJy4uL3NyYy9jbG9uZS1mdW5jdGlvbi5qcycpO1xyXG4iLCIvKlxyXG5MaWNlbnNlIGdwbC0zLjAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXHJcbiovXHJcbi8qanNsaW50XHJcbiAgICBldmlsOiB0cnVlLFxyXG4gICAgbm9kZTogdHJ1ZVxyXG4qL1xyXG4ndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBDbG9uZXMgbm9uIG5hdGl2ZSBKYXZhU2NyaXB0IGZ1bmN0aW9ucywgb3IgcmVmZXJlbmNlcyBuYXRpdmUgZnVuY3Rpb25zLlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZS5cclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGEgY2xvbmUgb2YgdGhlIG5vbiBuYXRpdmUgZnVuY3Rpb24sIG9yIGFcclxuICogIHJlZmVyZW5jZSB0byB0aGUgbmF0aXZlIGZ1bmN0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gY2xvbmVGdW5jdGlvbihmdW5jKSB7XHJcbiAgICB2YXIgb3V0O1xyXG4gICAgaWYgKC9cXFtuYXRpdmUgY29kZVxcXS8udGVzdChmdW5jLnRvU3RyaW5nKCkpKSB7XHJcbiAgICAgICAgb3V0ID0gZnVuYztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ID0gZXZhbCgnKGZ1bmN0aW9uKCl7cmV0dXJuICcgKyBmdW5jLnRvU3RyaW5nKCkgKyAnfSgpKTsnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUZ1bmN0aW9uOyJdfQ==
;