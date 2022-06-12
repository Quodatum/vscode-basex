# BaseX Tools for Visual Studio Code
This project was originally a fork of https://github.com/DotJoshJohnson/vscode-xml

This extension adds features to support BaseX development on VSCode.
* XQuery 3.1, XQuery update, Full text syntax support 
* XQuery code format

## Features
* [XML Formatting](https://git.quodatum.duckdns.org/apb/vscode-basex/wiki/xml-formatting)
* [XML Tree View](https://git.quodatum.duckdns.org/apb/vscode-basex/wiki/xml-tree-view)
* [XPath Evaluation](https://git.quodatum.duckdns.org/apb/vscode-basex/wiki/xpath-evaluation)
* [XQuery Linting](https://git.quodatum.duckdns.org/apb/vscode-basex/wiki/xquery-linting)
* [XQuery Execution](https://git.quodatum.duckdns.org/apb/vscode-basex/wiki/xquery-script-execution)
* [XQuery Code Completion](https://git.quodatum.duckdns.org/apb/vscode-basex/wiki/xquery-code-completion)

## Requirements
* VS Code `1.63.0` or higher

## Release Notes
Detailed release notes are available [here](https://git.quodatum.duckdns.org/apb/vscode-basex/releases).

## Issues
Run into a bug? Report it [here](https://git.quodatum.duckdns.org/apb/vscode-basex/issues).
## build

```
npm install
npm install -g typescript #maybe
npm install --global vsce
#
npm run compile
vsce package
```
## Icon Credits
Icons used in the XML Tree View are used under the Creative Commons 3.0 BY license.
* "Code" icon by Dave Gandy from www.flaticon.com
* "At" icon by FreePik from www.flaticon.com

## Inspiration

This is built on a fork of [DotJoshJohnson/vscode-xml](https://github.com/DotJoshJohnson/vscode-xml). 