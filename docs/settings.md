---
title: Extension settings
summary: Describes settings of the vscode-basex extension
authors:
    - Andy Bunce
date: 2023-07-23

---
# Settings (15)

## xquery.processor	
The XQuery processor. Determines syntax and core module libraries.	basex-9

## xquery.showHovers
Show hovers in XQuery source. Currently these show just Diagnostic info	false

## xquery.suppressErrors
Lint Error messages including these strings are marked as info rather than error. 
TEMP HACK!	[XQST0059],[XPST0008]

## xquery.executionArguments
Arguments to be passed to the XQuery execution engine.

## xquery.executionEngine
The path to the executable to run when standalone BaseX. e.g ... \basex.bat	

xpath.ignoreDefaultNamespace	
Ignore default xmlns attributes when evaluating XPath.	true


xpath.persistXPathQuery	
Remember the last XPath query used.	true

xml.enforcePrettySelfClosingTagOnFormat
Enforces a space before the forward slash at the end of a self-closing XML tag.	
false

xml.removeCommentsOnMinify	
Remove XML comments during minification.	false

xml.splitAttributesOnFormat	
Put each attribute on a new line when formatting XML. Overrides `splitXmlnsOnFormat` if set to `true`.	false

xml.splitXmlnsOnFormat	
Put each xmlns attribute on a new line when formatting XML.	true

xml.FormatterImplementation	
Supported XML Formatters: classic	v2

xmlTree.enableTreeView	
Enables the XML Document view in the explorer for XML documents.	false

xmlTree.enableViewMetadata
Enables attribute and child element counts in the XML Document view.	true

xmlTree.enableViewCursorSync
Enables auto-reveal of elements in the XML Document view when a start tag is clicked in the editor.	false