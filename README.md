# BaseX Tools for Visual Studio Code
This project was originally a fork of https://github.com/DotJoshJohnson/vscode-xml


## Features
* [XML Formatting](https://github.com/DotJoshJohnson/vscode-xml/wiki/xml-formatting)
* [XML Tree View](https://github.com/DotJoshJohnson/vscode-xml/wiki/xml-tree-view)
* [XPath Evaluation](https://github.com/DotJoshJohnson/vscode-xml/wiki/xpath-evaluation)
* [XQuery Linting](https://github.com/DotJoshJohnson/vscode-xml/wiki/xquery-linting)
* [XQuery Execution](https://github.com/DotJoshJohnson/vscode-xml/wiki/xquery-script-execution)
* [XQuery Code Completion](https://github.com/DotJoshJohnson/vscode-xml/wiki/xquery-code-completion)

## Requirements
* VS Code `1.22.2` or higher

## Extension Settings
* **`basexTools.enableXmlTreeView`:** Enables the XML Tree View for XML documents.
* **`basexTools.enableXmlTreeViewMetadata`:** Enables attribute and child element counts in the XML Document view.
* **`basexTools.enableXmlTreeViewCursorSync`:** Enables auto-reveal of elements in the XML Document view when a start tag is clicked in the editor.
* **`basexTools.enforcePrettySelfClosingTagOnFormat`:** Ensures a space is added before the forward slash at the end of a self-closing tag.
* **`basexTools.ignoreDefaultNamespace`:** Ignore default xmlns attributes when evaluating XPath.
* **`basexTools.persistXPathQuery`:** Remember the last XPath query used.
* **`basexTools.removeCommentsOnMinify`:** Remove XML comments during minification.
* **`basexTools.splitAttributesOnFormat`:** Put each attribute on a new line when formatting XML. Overrides `basexTools.splitXmlnsOnFormat` if set to `true`. (V2 Formatter Only)
* **`basexTools.splitXmlnsOnFormat`:** Put each xmlns attribute on a new line when formatting XML.
* **`basexTools.xmlFormatterImplementation`:** Supported XML Formatters: `classic`, `v2`.
* **`basexTools.xqueryExecutionArguments`:** Arguments to be passed to the XQuery execution engine.
* **`basexTools.xqueryExecutionEngine`:** The full path to the executable to run when executing XQuery scripts.

## Release Notes
Detailed release notes are available [here](https://github.com/DotJoshJohnson/vscode-xml/releases).

## Issues
Run into a bug? Report it [here](https://github.com/DotJoshJohnson/vscode-xml/issues).

## Icon Credits
Icons used in the XML Tree View are used under the Creative Commons 3.0 BY license.
* "Code" icon by Dave Gandy from www.flaticon.com
* "At" icon by FreePik from www.flaticon.com
