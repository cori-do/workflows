# Security Ownership Map

Builds a security-oriented ownership map for a git repository and extracts
high-signal findings like orphaned sensitive code, hidden owners, and low
bus-factor hotspots.

## Requirements

- `python3` installed on the worker
- Network access to install `networkx` into the workflow virtualenv
- `repo_path` points to a valid git repository
- `ownership_skill_root` points to a local checkout or install of the OpenAI `security-ownership-map` skill

## Run

Run against the current repository:

```sh
cori check ./security_ownership_map
cori run ./security_ownership_map repo_path=. since="12 months ago"
```

Write artifacts to a custom output directory:

```sh
cori run ./security_ownership_map repo_path=/path/to/repo out_dir=ownership-map-out since="6 months ago"
```

## Parameters

| Name | Default | Description |
|---|---:|---|
| `repo_path` | `.` | Git repository to analyze |
| `out_dir` | `ownership-map-out` | Directory where generated ownership artifacts are written |
| `venv_dir` | `.tmp-security-ownership-venv` | Repo-local virtualenv used for the Python dependency |
| `ownership_skill_root` | `/Users/adrien/.codex/skills/security-ownership-map` | Local path to the source skill scripts |
| `since` | empty | Optional git date expression such as `12 months ago` |

## Output

The workflow writes ownership artifacts to `out_dir/` and returns JSON from the
query steps. Expected generated files include:

- `summary.json`
- `people.csv`
- `files.csv`
- `edges.csv`

The final query steps extract:

- orphaned sensitive code
- hidden owners of sensitive paths
- bus-factor hotspots in sensitive files

## Reference

This workflow is a direct Cori transformation of OpenAI's official
[`security-ownership-map` skill](https://github.com/openai/skills/tree/main/skills/.curated/security-ownership-map),
which builds the underlying ownership graph and query slices.
