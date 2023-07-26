[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/quodatum.vscode-basex?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=quodatum.vscode-basex)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/quodatum.vscode-basex?style=for-the-badge&logo=microsoft)](https://marketplace.visualstudio.com/items?itemName=quodatum.vscode-basex)
[![Build Status](https://img.shields.io/github/actions/workflow/status/quodatum/vscode-basex/CI.yaml?branch=main&style=for-the-badge&logo=github)](https://github.com/quodatum/vscode-basex/actions?query=workflow:CI)
[![License](https://img.shields.io/github/license/quodatum/vscode-basex?style=for-the-badge)](https://github.com/quodatum/vscode-basex/blob/master/LICENSE)
[![OpenVSX Registry](https://img.shields.io/open-vsx/dt/quodatum/vscode-basex?color=purple&label=OpenVSX%20Downloads&style=for-the-badge)](https://open-vsx.org/extension/quodatum/vscode-basex)

# BaseX Tools for Visual Studio Code

The `vscode-basex` extension adds features to support [BaseX](https://basex.org/) development on VSCode.
A key feature is a parser for [XQuery](https://quodatum.github.io/basex-xqparse/) sources that supports all BaseX features, including XQuery Update and the Full text search syntax.  
# Status
__Work in progress. Errors and changes to be expected.__

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
npm install -g typescript #once
npm install --global @vscode/vsce
#
npm run compile
vsce package
```
## Documentation
Uses https://github.com/squidfunk/mkdocs-material 
# Inspiration
## VSCode
This project was created from a fork of [DotJoshJohnson/vscode-xml](https://github.com/DotJoshJohnson/vscode-xml). Some of the `DotJoshJohnson` code dealing with XML has been removed and additional XQuery features added. 
## XQuery parsing
The code parsing uses [quodatum/xqlint](https://github.com/Quodatum/xqlint) which a fork of [wcandillon/xqlint](https://github.com/wcandillon/xqlint).
These both make use of Gunther Rademacher's [REx](https://www.bottlecaps.de/rex/) Parser Generator.

## Icon 

Icons used in the XML Tree View are used under the Creative Commons 3.0 BY license.
* "Code" icon by Dave Gandy from www.flaticon.com
* "At" icon by FreePik from www.flaticon.com


