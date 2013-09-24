
/* vsdoc for cli */

(function (window) {
    

    window.cli = {
        /// <summary></summary>
        /// <returns type="cli"/>
                
        main: function(opts, opts.infile, opts.outfile) {
            /// <summary>main function called when script is accessed through the command line.</summary>
            /// <param name="opts" type="Object">Options object.</param>
            /// <param name="opts.infile" type="String">The name of the file to be read,
            ///  also accepts from stdin.</param>
            /// <param name="opts.outfile" type="String">The name of the file to write
            ///  results to</param>
        }, 
        
        readin: function(cb) {
            /// <summary>Reads from stdin and calls the callback on the data received.</summary>
            /// <param name="cb" type="Function">The callback function to execute on the received
            ///  data.</param>
        }
        
    };

    var $x = window.cli;
    $x.__namespace = "true";
    $x.__typeName = "cli";
})(this);
