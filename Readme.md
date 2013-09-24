# object-merge
version 0.0.1

Merges JavaScript objects recursively without altering the objects merged.

## Installation

```
npm install object-merge
```

https://npmjs.org/package/object-merge
Source code available at: https://github.com/matthewkastor/object-merge/

## Usage

In node:

```
var objectMerge = require('object-merge');
var x = {
    a : 'a',
    b : 'b',
    c : {
        d : 'd',
        e : 'e',
        f : {
            g : 'g'
        }
    }
};
var y = {
    a : '`a',
    b : '`b',
    c : {
        d : '`d'
    }
};
var z = {
    a : {
        b : '``b'
    },
    fun : function foo () {
        return 'foo';
    },
    aps : Array.prototype.slice
};
var out = objectMerge(x, y, z);
// out.a will be {
//         b : '``b'
//     }
// out.b will be '`b'
// out.c will be {
//         d : '`d',
//         e : 'e',
//         f : {
//             g : 'g'
//         }
//     }
// out.fun will be a clone of z.fun
// out.aps will be equal to z.aps
```

In the browser, include `./browser/object-merge_web.js` in your page.
 `objectMerge` will be available in your page.

For full documentation see the docs folder. For examples see the example folder.

## Tests

Tests can be run from the root of this package with

```
npm test
```

## Hacking

There are several other scripts listed in package.json for development and
 hacking on this module. They can be run with `npm run-script` followed by the
 scripts property corresponding to the script you want to run. For example,
 given a script called `buildDocs`, it could be run from the package root by:

```
npm run-script buildDocs
```

## Author

Matthew Kastor
atropa

matthewkastor@gmail.com
https://plus.google.com/100898583798552211130

## License

gpl-3.0
http://www.gnu.org/licenses/gpl-3.0-standalone.html