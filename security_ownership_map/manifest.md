---
id: security_ownership_map
name: Security Ownership Map
description: Build a security-oriented git ownership map for a repository and extract orphaned sensitive code, hidden owners, and low-bus-factor hotspots.
created: 2026-06-06
version: 1
parameters:
  - name: repo_path
    type: path
    default: .
    description: Git repository to analyze
  - name: out_dir
    type: path
    default: ownership-map-out
    description: Directory where ownership artifacts and summary outputs are written
  - name: venv_dir
    type: path
    default: .tmp-security-ownership-venv
    description: Repo-local Python virtualenv used for the analysis dependency
  - name: ownership_skill_root
    type: path
    default: /Users/adrien/.codex/skills/security-ownership-map
    description: Local path to the installed security-ownership-map skill
  - name: since
    type: string
    default: ""
    description: Optional git date expression for narrowing history, such as 12 months ago
    required: false
tools_required: [python3]
mcp_servers: []
tags: [security, ownership, bus-factor, git, analysis]
---

# Security Ownership Map

## Goal
Build a reusable ownership analysis for a git repository that highlights
security-sensitive files, maintainer concentration, and bus-factor risk using
git history.

The workflow recreates the graph artifacts and high-signal summary slices from
this conversation so the analysis can be rerun after new commits land.

## Preconditions
- `python3` is installed on the worker
- `ownership_skill_root` points at a local `security-ownership-map` skill checkout
- `repo_path` points to a valid git repository
- The worker can create a repo-local virtualenv and download `networkx`

## Steps
1. **create_virtualenv** (cli) — Create an isolated Python virtualenv for the workflow's dependency.
2. **install_networkx** (cli) — Install the required graph-analysis library into that virtualenv.
3. **run_ownership_map** (cli) — Generate the ownership graph, communities, commits log, and summary artifacts.
4. **query_orphaned_sensitive_code** (cli) — Extract the stale sensitive-code slice from the generated summary data.
5. **query_hidden_owners** (cli) — Extract dominant owners of sensitive code paths.
6. **query_bus_factor_hotspots** (cli) — Extract sensitive files with low bus factor.

## Verification
- `out_dir/summary.json` exists and is valid JSON
- `out_dir/people.csv`, `out_dir/files.csv`, and `out_dir/edges.csv` were generated
- The three query steps each return valid JSON
- Re-running the workflow refreshes the same output directory without manual cleanup

## Notes
- This workflow uses a repo-local virtualenv instead of the system Python to avoid PEP 668 managed-environment conflicts.
- Every CLI step starts with the declared `python3` executable; it does not use a generic launcher such as `env` to dispatch a generated virtualenv path.
- The skill's default sensitive-path heuristics are used unless you edit the workflow to add a custom sensitivity config.
- The source skill scripts live outside the repo, so `ownership_skill_root` is an explicit parameter rather than a hidden machine assumption.
