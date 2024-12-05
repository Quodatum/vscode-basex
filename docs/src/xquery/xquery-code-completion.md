---
title: XQuery code completion
summary: Features to prompt with completions when editing XQuery source.
authors:
    - Andy Bunce
date: 2023-07-05
tags:
  - XQuery
  - completion
---
## Usage
Code completion suggestions can be triggered by `Ctl-space` 
![completion](xquery-code-completion.gif)

## Details
There are several types of completion. The context position is used to determine which to run.
### Type completions
If the previous token was `as` then type completions are displayed. Examples include:
* `let $a as `|
*  `declare variable  $a as `|
* `declare function local:f( $a as `|
* `declare function local:f( $a as item()) as `|

### Import completions
### Expression completions

