---
id: changelog_draft
name: Draft Release Changelog from Git History
description: Draft a user-facing changelog section from local git history, commit messages, and diff stats.
created: 2026-06-01
version: 1
parameters:
  - name: base_tag
    type: string
    required: true
    description: Last shipped tag to diff against
  - name: target_ref
    type: string
    default: HEAD
    description: Ref being released
  - name: release_version
    type: string
    required: true
    description: Version heading to write
tools_required: [git]
mcp_servers: []
tags: [release, changelog, git]
---

# Draft Release Changelog from Git History

## Goal
Turn a release range into a user-facing changelog draft by pulling first-parent history, PR-linked commits, and diff stats, then reshaping them into `Highlights`, `Changes`, and `Fixes`.

## Preconditions
- The repo has the release range you want to summarize
- `git` is available
- `base_tag` points at the last shipped release tag you want to compare against
- OpenAI credentials are configured for the LLM step

## Steps
1. **audit_workspace** (cli) — Capture branch and workspace state before summarizing the release
2. **collect_primary_history** (cli) — Gather first-parent commit history from `base_tag` to `target_ref`
3. **collect_pr_linked_commits** (cli) — Gather commit subjects that already carry PR refs so those refs and thanks can be preserved
4. **collect_diff_stat** (cli) — Capture the file-level delta so the draft can be ordered by user impact
5. **draft_changelog_sections** (llm) — Rewrite the raw history into release-note sections sorted by user interest
6. **render_changelog_markdown** (code) — Format the sections into a stable markdown release draft

## Verification
- The output has one `## <release_version>` heading
- Bullets stay grouped under `### Highlights`, `### Changes`, and `### Fixes`
- PR refs and `Thanks @...` survive any grouping
- Direct commits are reflected when they affect user-facing behavior

## Notes
- This workflow drafts text only; it does not write the changelog file.
- When a commit has no PR ref, inspect the subject, body, touched files, and nearby commits before classifying it.
- Keep release-process noise out of the final notes unless it affects user-facing release safety.
