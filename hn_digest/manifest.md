---
id: hn_digest
name: Hacker News Digest
description: Build a compact markdown digest from the current Hacker News top stories using only public HTTP APIs.
created: 2026-05-28
version: 1
parameters:
  - name: story_count
    type: number
    default: 10
    description: Number of top stories to include
tools_required: [curl]
mcp_servers: []
tags: [demo, digest, http]
schedule: "0 8 * * *"
schedule_tz: UTC
---

# Hacker News Digest

## Goal
Produce a short, readable markdown digest from the Hacker News top stories feed. This is a good first workflow for new Cori users because it uses a public API, has no credentials, and shows how `cli` and `code` steps compose.

## Preconditions
- The worker has `curl` installed
- The worker can reach `https://hacker-news.firebaseio.com`

## Steps
1. **fetch_top_ids** (cli) - Fetch the ordered list of top story IDs from the Hacker News API
2. **fetch_stories** (cli) - Fetch details for the first `story_count` stories
3. **format_digest** (code) - Format the fetched stories as a compact markdown digest

## Verification
- `cori check hn_digest` validates the manifest and all three steps
- `cori run hn_digest story_count=5` returns a markdown digest with five ranked stories
- The trace shows two `cli` activities and one `code` activity, with total LLM cost EUR 0.00

## Notes
- This workflow deliberately avoids authentication and LLM calls so it can be used as a smoke test for a fresh Cori worker.
- The Hacker News API returns story IDs already ranked by the site, so the formatter preserves that order instead of re-sorting by score.