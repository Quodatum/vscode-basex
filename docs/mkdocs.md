---
title: About this documentation 
summary: MKdocs setup.
authors:
    - Andy Bunce
date: 2023-07-05
some_url: https://example.com
---
# General
!!! note

    currently this page is just used to test mkdocs features.
* Gif images are 960x540

# Highlighting samples
## Javascript
```javascript
/* eslint-disable @typescript-eslint/no-var-requires */

const XQLint =require("@quodatum/xqlint").XQLint;
const CodeFormatter=require( "@quodatum/xqlint").CodeFormatter;
console.log("....");
const xquery="2 +4 ";
const linter = new XQLint(xquery, { "styleCheck": false }) ;

//if(linter.hasSyntaxError()+linter.hasSyntaxError()) throw new Error("XQuery syntax error")
const ast=linter.getAST()
const formatter = new CodeFormatter(ast);
const formatted = formatter.format().trim();
console.log(formatted);
```

## XML
```xml
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>
```

# XQuery
```xquery
(:~
create xqdoc from parse tree 
 @Copyright (c) 2022 Quodatum Ltd
 @author Andy Bunce, Quodatum, License: Apache-2.0
 @TODO refs
:)
 module namespace xqdc = 'quodatum:xqdoca.model.xqdoc';

import module namespace xqcom = 'quodatum:xqdoca.model.comment' at "comment-to-xqdoc.xqm";
declare namespace xqdoc="http://www.xqdoc.org/1.0";

```


