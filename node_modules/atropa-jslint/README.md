# atropa-jslint

A [node](http://nodejs.org/) module wrapper for jslint.

All this does is export the jslint function, and allow you to update the jslint version easily, it's simple.

## Installation
```
npm install atropa-jslint
```

## General use

See `lib/jslint.js` for full documentation on jslint.

Give it a file called `mySource.js` on the command line and see results in the
 console.

```
node_modules/.bin/atropa-jslint mySource.js
```

Add an output file to the command to have the results written there

```
node_modules/.bin/atropa-jslint mySource.js myResults.txt
```

fun with pipes

```
echo x = 2 | node_modules/.bin/atropa-jslint "" myResults.txt
```

do it from scripts

```
var os = require('os');
var fs = require('fs');
var jslint = require('atropa-jslint');
var result = jslint.JSLINT(fs.readFileSync('somefile.js'));
if(result) {
    console.log('no errors found!');
} else {
    jslint.JSLINT.errors.forEach(function (error) {
        console.error(
            '* Error:' + os.EOL +
            '    Reason: ' + error.reason + os.EOL +
            '    Evidence: ' + error.evidence + os.EOL +
            '    Line: ' + error.line + os.EOL +
            '    Char: ' + error.character + os.EOL + os.EOL
        );
    });
}
```


## Update to the latest JsLint version.

```
var jslint = require('atropa-jslint');
jslint.update();
```


## Rollback to the previous JsLint version.

```
var jslint = require('atropa-jslint');
jslint.rollbackUpdate();
```

## Update atropa-jslint
```
npm update atropa-jslint
```