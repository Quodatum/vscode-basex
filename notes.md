# Debugging 2022-02-12...
## apb.js
```javascript
var XQLint = require('../lib/xqlint').XQLint;
var source = 'let $v1 := 1\nlet $foo := $v1\nreturn $v1 + $';
var linter = new XQLint(source);
var lines = source.split('\n');
var pos = { line: lines.length -1 , col: lines[lines.length - 1].length };
var proposals = linter.getCompletions(pos);
console.log(proposals);
```
------

## completer.js/getCompletions

### wcandillon /xqlint
 ```javascript
 ast.pos={sl: 0, sc: 0, el: 2, ec: 14}
 pos={col:14,line:2}
 
 node=TreeOps.findNode(ast, pos);
 // node{name: 'token', value: "$"}

sctx = TreeOps.findNode(rootSctx, pos);
```
### quodatum
 ```javascript
 pos={col:14,line:2}
 ast.pos={sl: 0, sc: 0, el: 2, ec: **10**}
 ast.name=XQuery
 ```
 Therefore error is in XQlint
 ## XQLint
```javascript
// save source,  ast=null
var h = new JSONParseTreeHandler(source);

// set source and handler
var parser = new XQueryParser(source, h);
try {
    // attempt to parse startNonterminal "XQuery" 
     parser.parse_XQuery();
}catch(e){
    syntaxError = true;
     h.closeParseTree();
}
 ast = h.getParseTree();
```

### wcandillon /xqlint
```javascript 
 ast.pos={sl: 0, sc: 0, el: 2, ec: 14}
 ```
### quodatum
 ```javascript
 pos={col:14,line:2}
 ```