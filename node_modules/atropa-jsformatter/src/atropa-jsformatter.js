"use strict";
/*jslint
    white: true,
    node: true
*/

/**
 * Pretty prints javaScript using esprima and escodegen. Line endings
 *  will be converted to the value stored in os.EOL
 * @param {String} source The source code to prettify.
 * @param {Object} escodegenOptions Optional. Use different settings for
 *  escodegen.
 * @param {Object} esprimaOptions Optional. Use different settings for
 *  esprima.
 * @requires <a href="http://esprima.org/doc/">esprima</a>
 * @requires <a href="https://github.com/Constellation/escodegen/wiki/API">
 *  escodegen</a>
 * @requires <a href="http://nodejs.org/api/os.html">os</a>
 * @example
 *  var formatter = require('atropa-jsformatter');
 *  var out = formatter('function wobble() { return "flam"; }');
 *  console.log(out);
 */
function formatJs(source, escodegenOptions, esprimaOptions) {
    
    var esprima, escodegen, os, tree;
    
    esprima = require('esprima');
    escodegen = require('escodegen');
    os = require('../core wrappers/os.js');
    
    esprimaOptions = esprimaOptions || {
        "loc"      : false,
        "range"    : true,
        "raw"      : false,
        "tokens"   : true,
        "comment"  : true,
        "tolerant" : false
    };
    
    escodegenOptions = escodegenOptions || {
        "format" : {
            "indent" : {
                "style" : "    ",
                "base"  : 0,
                "adjustMultilineComment" : true
            },
            "json"       : false,
            "renumber"   : false,
            "hexadecimal": false,
            "quotes"     : "single",
            "escapeless" : false,
            "compact"    : false,
            "parentheses": true,
            "semicolons" : true
        },
        "parse"    : null,
        "comment"  : true,
        "sourceMap": undefined
    };
    
    tree = esprima.parse(source, esprimaOptions);
    tree = escodegen.attachComments(tree, tree.comments, tree.tokens);
    
    return escodegen.generate(
        tree, escodegenOptions).replace(/(\r\n|\r|\n)/g, os.EOL);
};


module.exports = formatJs;