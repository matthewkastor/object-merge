
  
/* vsdoc for _global_ */

(function (window) {
    

    window._global_ = {
        /// <summary></summary>
        /// <returns type="_global_"/>
                
    };

    var $x = window._global_;
    $x.__namespace = "true";
    $x.__typeName = "_global_";
})(this);

  

  
/* vsdoc for objectMerge */

(function (window) {
    

    window.objectMerge = {
        /// <summary>Merges JavaScript objects recursively without altering the objects merged.</summary>
        /// <param name="opts" type="ObjectMergeOptions">An options object created by 
        ///  objectMerge.createOptions. Options must be specified as the first argument
        ///  and must be an object created with createOptions or else the object will
        ///  not be recognized as an options object and will be merged instead.</param>
        /// <param name="shadows" type="Object">[[shadows]...] One or more objects to merge. Each
        ///  argument given will be treated as an object to merge. Each object
        ///  overwrites the previous objects descendant properties if the property name
        ///  matches. If objects properties are objects they will be merged recursively
        ///  as well.</param>
        /// <returns type="objectMerge"/>
                
        createOptions: function(opts, opts.depth, opts.throwOnCircularRef) {
            /// <summary>Creates a new options object suitable for use with objectMerge.</summary>
            /// <param name="opts" type="Object">An object specifying the options.</param>
            /// <param name="opts.depth" type="Object">Specifies the depth to traverse objects
            ///  during merging. If this is set to false then there will be no depth limit.</param>
            /// <param name="opts.throwOnCircularRef" type="Object">Set to false to suppress
            ///  errors on circular references.</param>
            /// <returns type="ObjectMergeOptions">Returns an instance of ObjectMergeOptions
            ///  to be used with objectMerge.</returns>
        }
        
    };

    var $x = window.objectMerge;
    $x.__namespace = "true";
    $x.__typeName = "objectMerge";
})(this);

  

