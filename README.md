# Cori Workflows

This repository contains runnable example workflows for [Cori](https://github.com/cori-do/cori). The examples are meant to be useful starting points: small enough to read, but realistic enough to adapt.

## Quick Start

From this repository, validate a workflow before running it:

```sh
cori check ./hn_digest
```

Run a workflow by passing parameters as `name=value` pairs:

```sh
cori run ./hn_digest story_count=5
```

Authenticated workflows may require one-time login first:

```sh
cori login gh
cori login gws
cori login openai
```

## Workflow Catalog

| Workflow | Level | Capabilities | Cost | What it shows |
|---|---:|---|---|---|
| `hello_world` | Beginner | `curl`, `code` | Free | End-to-end demo: fetch, transform, format |
| `code_only` | Beginner | `code` | Free | Pure TypeScript step chaining |
| `hn_digest` | Beginner | `curl`, `code` | Free | Public HTTP APIs and formatting |
| `github_release_notes` | Beginner/intermediate | `gh`, `llm` | LLM tokens | GitHub API reads plus a focused LLM drafting step |
| `gcal_daily_brief` | Intermediate | `gws`, `llm` | LLM tokens | Calendar read, Gmail send, and typed email assembly |
| `stale_issue_triage` | Intermediate/advanced | `gh`, `code` | Free | GitHub maintenance with deterministic filtering and dry-run behavior |
| `drive_doc_summarizer` | Advanced | `gws`, `llm` | LLM tokens | Drive export, Docs creation, Docs update, and Gmail delivery |

## Repository Layout

Each workflow is a folder with:

```text
<workflow>/
  manifest.md
  types.ts              # optional shared zod schemas
  steps/
    01_first_step.ts
    02_second_step.ts
  README.md             # workflow-specific setup and run notes
```

The numbered files in `steps/` are the execution order. Every step exports exactly one `step.code`, `step.cli`, or `step.llm` definition from `@cori-do/sdk`.

## Choosing an Example

Start with `hello_world` if you want the fastest no-auth smoke test that proves everything works.

Use `github_release_notes` when you want to see a practical LLM step that turns structured API data into publishable text.

Use `gcal_daily_brief` or `drive_doc_summarizer` when you want to adapt Google Workspace automation.

Use `stale_issue_triage` when you want a deterministic maintenance workflow that is safe to run in `dry_run=true` mode.