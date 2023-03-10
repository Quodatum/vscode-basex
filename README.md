# BaseX Tools for Visual Studio Code


The vscode-basex extension adds features to support [BaseX](https://basex.org/) development on VSCode.
For XQuery
* Grammar support for:XQuery 3.1, XQuery update, Full text syntax  
* code format
* code completion
* code snippets
* outline symbol view

## Features
* [XQuery Linting](https://github.com/Quodatum/vscode-basex/wiki/xquery-linting)
* [XQuery Code Completion](https://github.com/Quodatum/vscode-basex/wiki/xquery-code-completion)
* [XQuery Execution](https://github.com/Quodatum/vscode-basex/wiki/xquery-script-execution)
* [XQuery source formating](https://github.com/Quodatum/vscode-basex/wiki/xquery-source-formating)

* [XML Formatting](https://github.com/Quodatum/vscode-basex/wiki/xml-formatting)
* [XML Tree View](https://github.com/Quodatum/vscode-basex/wiki/xml-tree-view)
* [XPath Evaluation](https://github.com/Quodatum/vscode-basex/wiki/xpath-evaluation)


## Requirements
* VS Code `1.63.0` or higher

## Release Notes
Detailed release notes are available [here](https://github.com/Quodatum/vscode-basex/releases).

## Issues
Run into a bug? Report it [here](https://github.com/Quodatum/vscode-basex/issues).
## Development

## build

```
npm install
npm install -g typescript #maybe
npm install --global vsce
#
npm run compile
vsce package
```

## Inspiration

This project was created from a fork of [DotJoshJohnson/vscode-xml](https://github.com/DotJoshJohnson/vscode-xml). Much of `DotJoshJohnson/vscode-xml` code dealing with XML has been removed and additional XQuery features added. 

The code parsing uses [quodatum/xqlint] which is based on [wcandillon/xqlint]

## Icon Credits
Icons used in the XML Tree View are used under the Creative Commons 3.0 BY license.
* "Code" icon by Dave Gandy from www.flaticon.com
* "At" icon by FreePik from www.flaticon.com


