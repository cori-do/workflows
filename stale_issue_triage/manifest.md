---
id: stale_issue_triage
name: Stale Issue Triage
description: Find inactive GitHub issues and optionally create a triage report issue for maintainers.
created: 2026-05-28
version: 1
parameters:
  - name: repo
    type: string
    default: cori-do/cori
    description: GitHub repository in owner/name form
  - name: stale_days
    type: number
    default: 60
    description: Minimum days since last issue update
  - name: issue_limit
    type: number
    default: 100
    description: Maximum open issues to inspect
  - name: dry_run
    type: boolean
    default: true
    description: If true, do not create a triage report issue
tools_required: [gh]
mcp_servers: []
tags: [github, triage, maintenance]
schedule: "0 9 * * 1"
schedule_tz: UTC
---

# Stale Issue Triage

## Goal
Help maintainers spot open issues that have not moved recently. The workflow produces a deterministic report and, when `dry_run` is false, creates a single GitHub issue containing the triage queue.

## Preconditions
- The worker has the GitHub CLI (`gh`) installed and authenticated
- The authenticated account can read issues in `repo`
- To create the report issue, the authenticated account must have write access

## Steps
1. **list_open_issues** (cli) - Read recent open issues from GitHub
2. **find_stale_issues** (code) - Select issues older than `stale_days` without an existing `stale` label
3. **create_triage_report** (cli) - Create a report issue unless `dry_run` is true or no stale issues exist
4. **summarize_result** (code) - Return the report body and created issue URL

## Verification
- `cori check stale_issue_triage` validates the manifest and all four steps
- `cori run stale_issue_triage repo=OWNER/REPO dry_run=true` returns the report without mutating GitHub
- With `dry_run=false`, the final output includes the created report issue URL

## Notes
- This workflow intentionally creates one report issue instead of editing many issues. That keeps the example runnable without builtin fan-out support.
- The selection step excludes issues already labeled `stale`.