# GIT_WORKFLOW.md

# GuideOS Git Workflow

Version: **1.0**

Status: **Frozen**

---

# Purpose

Define the official Git workflow for the GuideOS project.

Every commit, branch, tag and release shall follow this document.

The objective is to maintain a clean, predictable and recoverable project history.

---

# Branch Strategy

The project shall use a simplified Git Flow.

Permanent branches

```text
main
develop
```

Temporary branches

```text
feature/*
bugfix/*
hotfix/*
release/*
experiment/*
```

---

# Branch Purpose

## main

Contains only production-ready code.

Every commit shall be deployable.

Never commit experimental code.

---

## develop

Primary development branch.

Completed Sprint work is merged here after review.

---

## feature

Implements one feature.

Example

```text
feature/viewer-theme-engine

feature/admin-project-manager

feature/compiler-validation
```

One feature per branch.

---

## bugfix

Fixes non-critical issues.

Example

```text
bugfix/mobile-sidebar

bugfix/entity-rendering
```

---

## hotfix

Fixes production issues.

Branch directly from

```text
main
```
