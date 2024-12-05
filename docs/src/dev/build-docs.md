---
title: Building the documentation
summary: mkdocs-material, mike, docker
authors:
    - Andy Bunce
date: 2024-12-03
tags:
  - dev
---

Uses [mkdocs-material](https://github.com/squidfunk/mkdocs-material) with
[mike](https://github.com/jimporter/mike) for versioning. 
Docker is used to package the documentation tools.

```
mike deploy 0.2 --ignore-remote-status
```