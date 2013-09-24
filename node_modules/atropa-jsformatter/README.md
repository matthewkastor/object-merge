Prettifies JavaScript on nodejs


It's as simple as:

```
var formatter, fs, source, out;

formatter = require('atropa-jsformatter');
fs = require('fs');


source = fs.readFileSync('./example messy code.js', 'utf8');

out = formatter(source);

console.log(out);
```


Install it from npm

`npm install atropa-jsformatter`

Visual studio intellisense support is available in docs/vsdoc/OpenLayersAll.js
Full documentation may be found at [http://matthewkastor.github.com/atropa-jsformatter](http://matthewkastor.github.com/atropa-jsformatter)