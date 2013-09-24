var fs, path;
fs = require('fs');
path = require('path');

try {
    eval(fs.readFileSync(path.normalize(__dirname + '/lib/jslint.js'), 'utf8'));
    exports.JSLINT = JSLINT;
} catch (e) {
    console.error('Could not load jslint.js or file is missing.');
}

exports.rollbackUpdate = function() {
    if(fs.existsSync(__dirname + '/lib/jslint.old.js')) {
        fs.renameSync(__dirname + '/lib/jslint.old.js',
            __dirname + '/lib/jslint.js'
        );
        console.log('JsLint update rolled back.');
    } else {
        console.error('No previous copy of JsLint to rollback to.');
    }
};

exports.update = function() {
    var https, options, JsLintLocation;
	https = require('https');
	options = {
		host: 'raw.github.com',
		path: '/douglascrockford/JSLint/master/jslint.js'
	};
    
    JsLintLocation = 'https://'+ options.host + options.path;
    
    https.get(options, function(response) {
        var body = [];
        
        if(response.statusCode !== 200) {
            console.error(
                'failed to retrieve JSLint file at ' + JsLintLocation);
        }
        
        response.setEncoding("utf8");
        
        response.on("data", function(chunk) {
            body.push(chunk);
        });
        
        response.on("end", function() {
            if(fs.existsSync(__dirname + '/lib/jslint.js')) {
                fs.renameSync(__dirname + '/lib/jslint.js',
                    __dirname + '/lib/jslint.old.js'
                );
                console.log('The previous version of jslint has been ' +
                    'saved as jslint.old.js');
            }
            fs.writeFileSync(
                __dirname + '/lib/jslint.js',
                body.join(""),
                'utf8'
            );
            console.log('JsLint updated.');
        });
    }).on('error', function (e) {
        console.error('failed to retrieve JSLint file at ' + JsLintLocation +
                    ' or you are not online');
        console.error(e);
        process.exit(1);
    });
};
