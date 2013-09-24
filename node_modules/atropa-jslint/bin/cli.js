#!/usr/bin/env node
/*jslint
    white: true,
    vars: true,
    node: true
*/

/**
 * cli functions
 * @namespace cli functions
 */
var cli = {
    /**
     * main function called when script is accessed through the command line.
     * @param {Object} opts Options object.
     * @param {String} [opts.infile=stdin] The name of the file to be read,
     *  also accepts from stdin.
     * @param {String} [opts.outfile=stdout] The name of the file to write
     *  results to
     */
    main : function main (opts) {
        "use strict";
        function lint (outfile, source, cb) {
            cb = cb || function () {
                return null;
            };
            function fWriteCb (cb, err, data) {
                if (err) {
                    throw err;
                }
                cb(data);
            }
            var JSLINT = require('../atropa-jslint.js').JSLINT;
            JSLINT(source);
            var out = JSLINT.data();
            out = {
                errors: out.errors,
                global: out.global
            };
            out = JSON.stringify(out, null, '    ');
            if(outfile) {
                require('fs').writeFile(
                    require('path').resolve(outfile),
                    out,
                    {encoding: 'utf8'},
                    fWriteCb.bind(null, cb)
                );
            } else {
                console.log(out);
            }
        }
        function fReadCb (outfile, err, source) {
            if (err) {
                throw err;
            } 
            lint(outfile, source);
        }
        var read = fReadCb.bind(null, opts.outfile);
        if(opts.infile) {
            require('fs').readFile(
                require('path').resolve(opts.infile),
                {encoding: 'utf8'},
                read
            );
        } else {
            var toLint = lint.bind(null, opts.outfile);
            cli.readin(toLint);
        }
    },
    /**
     * Reads from stdin and calls the callback on the data received.
     * @param {Function} cb The callback function to execute on the received
     *  data.
     * @private
     */
    readin : function readin(cb) {
        "use strict";
        var stdin = process.openStdin(),
        data = '';

        stdin.setEncoding('utf8');
        stdin.addListener('data', function (chunk) {
            data += chunk;
        });
        stdin.addListener('end', function () {
            cb(data);
        });
    }
};
if (require.main === module) {
    var opts = {
        infile : process.argv[2],
        outfile : process.argv[3]
    };
    cli.main(opts);
}

module.exports = cli;