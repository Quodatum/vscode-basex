---
title: Commands
summary: The commands of the vscode-basex extension
authors:
    - Andy Bunce
date: 2023-07-23
---

# Commands 
Commands can be invoked from the `command palette` using `F1` or `Ctrl+Shift+P`.
The command title are all prefixed with 'BaseX Tools'.


## basexTools.xqParse
	BaseX Tools: Parse of XQuery source (xml)		editor/title
## basexTools.xqDoc
	BaseX Tools: XQdoc of XQuery source (json)		editor/title
## basexTools.evaluateXPath
	BaseX Tools: Evaluate XPath long title	Ctrl+Shift+Alt+X commandPalette
## basexTools.executeXQuery

	BaseX Tools: Execute XQuery using standalone BaseX		commandPalette
see [Run XQuery code](xquery/xquery-script-execution.md)

## basexTools.formatAsXml
	BaseX Tools: Format as XML	Ctrl+Shift+Alt+B
## basexTools.textToXml
	BaseX Tools: Convert text to XML (&lt;&gt; -> <>)		
##basexTools.xmlToText
	BaseX Tools: Convert XML to text (<> -> &lt;&gt;)		
## basexTools.getCurrentXPath
	BaseX Tools: Get Current XPath		commandPalette
## basexTools.minifyXml
	BaseX Tools: Minify XML		commandPaletteeditor/context
## basexTools.xqLintReport
	BaseX Tools: Analysis of current location in Xquery source		commandPalette
## basexTools.clearDiagnostics
	BaseX Tools: Clear the XQuery Diagnostics collection
