# 0.2.6 (2023-12-14)
* Nested outline
* Improve hovers
* goto definition (current file only)
# 0.2.5 (2023-11-20)
* support otherwise/ ?:
* xqlint 0.5.0
* replace parseError decorator with standard error
# 0.2.4 (2023-10-28)
* Improve autocomplete (but not much)
* Improve XQuery snippets
* add statusbar
* create bxs (cmd) and bxs (xml) language ids and snippets
# 0.2.3 (2023-10-23)
* xsl extension conflict #18
* Use xqlint 0.4.5
# 0.1.19 (2023-10-06)
* Use xqlint 0.4.1
# 0.1.18 (2023-09-21)
* parseError decorator
* empty codeaction hint
# 0.1.16 (2023-09-10)
* virtual docs fixes
* add command basexTools.xqLibrary
# 0.1.15 (2023-09-09)
*  Add commands: set processor and selectDeclaration.
*  rework event handlers
# 0.1.14  (2023-08-26)
*  Use xqlint 0.3.3 
*  rewrite event subscriptions

# 0.1.8  (2023-05-26)
* extract namespace library data to `xq-catalogs` component
* update to `xqlint` [v0.2.6](https://github.com/Quodatum/xqlint/releases/tag/v0.2.6)
* rewrite XQuery execute to better fit running standalone BaseX query
* Add language type "bxs" for BaseX scripts,  minimal functionality currently.
* Documentation moved from wiki to gh-pages and mkdocs
* Add "command": "basexTools.clearDiagnostics"

# 0.1.7  (2023-05-15)

* Use xqlint 0.2.3 
* Add documentlinkprovider
* Change XQuery Icon

# 0.1.5 (2023-05-03)
* Use xqlint 0.2.2 
* Improve hover display
* Add XQuery icon

# 0.1.4 (2023-03-18)
* [fix] use xqlint 0.2.1, was using 0.2.0 in error

# 0.1.3 (2023-02-27)
* Rename setting `platform` to `processor`

# 0.1.2 (2023-02-26)
* update to xqlint 0.2.1
* add setting `platform`
* common XQlint configuration.

# 0.1.1 (2023-02-24)
* Add setting to control "Hover show"
* Add setting to filter out matching diagnostic messages

# 0.1.0 (2023-02-19)
* Update xqlint to 0.2.0

# 0.0.64 (2023-01-26)
* Add simple hover display
* Update `xqlint.d.ts` to support newer `tsc.exe`. This reduces size of vsix from 600kb to 300kb

# 0.0.58
* Use xqlint 0.0.14

# 0.0.48
* Fix xmlToText #6
* FIX outline all vars

