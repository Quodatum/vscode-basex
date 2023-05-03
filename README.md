# BaseX Tools for Visual Studio Code

The vscode-basex extension adds features to support [BaseX](https://basex.org/) development on VSCode.
A key feature is a parser for XQuery sources that supports all BaseX features, including XQuery update and Full text search syntax.  

# Features
## XQuery
* [Linting](https://github.com/Quodatum/vscode-basex/wiki/xquery-linting)
* [Code Completion](https://github.com/Quodatum/vscode-basex/wiki/xquery-code-completion)
* [Execution](https://github.com/Quodatum/vscode-basex/wiki/xquery-script-execution)
* [source formating](https://github.com/Quodatum/vscode-basex/wiki/xquery-source-formating)
* [Symbols](https://github.com/Quodatum/vscode-basex/wiki/xquery-symbols)
* [Snippets](https://github.com/Quodatum/vscode-basex/wiki/xquery-snippets)
## XPath
* [XPath Evaluation](https://github.com/Quodatum/vscode-basex/wiki/xpath-evaluation)
## XML
* [XML Formatting](https://github.com/Quodatum/vscode-basex/wiki/xml-formatting)
* [XML Tree View](https://github.com/Quodatum/vscode-basex/wiki/xml-tree-view)



# Requirements
* VS Code `1.73.0` or higher

# Release Notes
Detailed release notes are available [here](https://github.com/Quodatum/vscode-basex/releases).

# Issues
Run into a bug? Report it [here](https://github.com/Quodatum/vscode-basex/issues).
# Development

## build

```
npm install
npm install -g typescript #maybe
npm install --global vsce
#
npm run compile
vsce package
```

# Inspiration
## VSCode
This project was created from a fork of [DotJoshJohnson/vscode-xml](https://github.com/DotJoshJohnson/vscode-xml). Some of `DotJoshJohnson/vscode-xml` code dealing with XML has been removed and additional XQuery features added. 
## XQuery parsing
The code parsing uses [quodatum/xqlint] which is based on [wcandillon/xqlint].
These both make use of tGunther Rademacher's [REx](https://www.bottlecaps.de/rex/) Parser Generator.

## Icon 
XQuery file type icon by Roberto Huertas https://icon-icons.com/icon/file-type-xquery/130059 

Icons used in the XML Tree View are used under the Creative Commons 3.0 BY license.
* "Code" icon by Dave Gandy from www.flaticon.com
* "At" icon by FreePik from www.flaticon.com


