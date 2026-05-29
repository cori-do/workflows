---
id: github_release_notes
name: GitHub Release Notes
description: Draft polished release notes from merged pull requests since the latest GitHub release or a chosen date.
created: 2026-05-28
version: 1
parameters:
  - name: repo
    type: string
    default: cori-do/cori
    description: GitHub repository in owner/name form
  - name: since_date
    type: string
    default: ""
    required: false
    description: Optional YYYY-MM-DD lower bound; latest release date is used when empty
  - name: pr_limit
    type: number
    default: 50
    description: Maximum merged pull requests to inspect
tools_required: [gh]
mcp_servers: []
tags: [github, release, changelog]
---

# GitHub Release Notes

## Goal
Turn merged pull requests into a concise release-notes draft that a maintainer can review, edit, and publish. The workflow keeps GitHub API access in `cli` steps and uses one `llm` step only for the editorial grouping and wording.

## Preconditions
- The worker has the GitHub CLI (`gh`) installed and authenticated
- The authenticated account can read pull requests and releases for `repo`
- Pull request titles are descriptive enough to produce useful release notes

## Steps
1. **get_latest_release** (cli) - Read the most recent GitHub release unless `since_date` is provided
2. **list_merged_prs** (cli) - List merged pull requests since the chosen date
3. **draft_release_notes** (llm) - Group the pull requests into publishable markdown release notes

## Verification
- `cori check github_release_notes` validates the manifest and all three steps
- `cori run github_release_notes repo=OWNER/REPO` returns markdown grouped by user-facing change type
- The final output includes the pull request count used for the draft

## Notes
- The workflow intentionally drafts notes only; it does not publish a release.
- Set `since_date` to make the run reproducible for a specific release window.