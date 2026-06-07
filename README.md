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
| `changelog_draft` | Intermediate | `git`, `llm`, `code` | LLM tokens | Local git history, diff stats, and stable changelog markdown rendering |
| `gcal_daily_brief` | Intermediate | `gws`, `llm` | LLM tokens | Calendar read, Gmail send, and typed email assembly |
| `stale_issue_triage` | Intermediate/advanced | `gh`, `code` | Free | GitHub maintenance with deterministic filtering and dry-run behavior |
| `security_ownership_map` | Advanced | `python3`, `git` | Free | Security-oriented ownership analysis, orphaned sensitive code, and bus-factor hotspots |
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

Use `changelog_draft` when you want to turn a local git release range into `Highlights`, `Changes`, and `Fixes` markdown for a changelog draft.

Use `gcal_daily_brief` or `drive_doc_summarizer` when you want to adapt Google Workspace automation.

Use `stale_issue_triage` when you want a deterministic maintenance workflow that is safe to run in `dry_run=true` mode.

Use `security_ownership_map` when you want to analyze a repository's security-sensitive ownership, uncover hidden owners, and surface low-bus-factor hotspots from git history.

## Source References

`security_ownership_map` is a direct workflow transformation of OpenAI's official [`security-ownership-map` skill](https://github.com/openai/skills/tree/main/skills/.curated/security-ownership-map).

## Workflow Spotlight

`changelog_draft` is adapted from [`@openclaw/openclaw-changelog-update`](https://agentskill.sh/@openclaw/openclaw-changelog-update), an agent skill for generating OpenClaw release changelogs from git history.

Using the reported token counts as `input / output`, the original agentic flow used about `43k input / 176k output` tokens, while this Cori workflow used about `3.6k input / 78 output`. That is a reduction of about `39.4k` input tokens (`91.6%`) and `175,922` output tokens (`99.96%`), or roughly `215,322` fewer tokens overall (`98.3%`).

Using standard API pricing checked on `2026-06-06` from [Anthropic](https://www.anthropic.com/claude/opus), [OpenAI](https://openai.com/api/pricing), and [Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/pricing), the same token profile works out to approximately:

| Model | Input / output price per 1M | Agentic flow | Cori workflow | Savings |
|---|---:|---:|---:|---:|
| `Claude Opus 4.8` | `$5 / $25` | `$4.6150` | `$0.0200` | `$4.5951` (`99.57%`) |
| `Claude Sonnet 4.6` | `$3 / $15` | `$2.7690` | `$0.0120` | `$2.7570` (`99.57%`) |
| `GPT-5.4` | `$2.50 / $15` | `$2.7475` | `$0.0102` | `$2.7373` (`99.63%`) |
| `GPT-5.5` | `$5 / $30` | `$5.4950` | `$0.0203` | `$5.4747` (`99.63%`) |
| `Gemini 3.5 Flash` | `$1.50 / $9` | `$1.6485` | `$0.0061` | `$1.6424` (`99.63%`) |

These examples use standard pricing only, not cached-input, batch, flex, or priority rates. The Gemini figure uses the official `Gemini 3.5 Flash` global standard tier for requests with `<= 200K` input tokens.
