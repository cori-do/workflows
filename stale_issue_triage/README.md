# Stale Issue Triage

Finds inactive GitHub issues and optionally creates a single triage report issue.

## Requirements

- `gh` installed and authenticated
- Read access to the target repository
- Write access only when running with `dry_run=false`

## Run

Start safely with the default dry run:

```sh
cori check ./stale_issue_triage
cori run ./stale_issue_triage repo=OWNER/REPO dry_run=true
```

Create a report issue when the output looks right:

```sh
cori run ./stale_issue_triage repo=OWNER/REPO dry_run=false stale_days=90
```

## Parameters

| Name | Default | Description |
|---|---:|---|
| `repo` | `cori-do/cori` | GitHub repository in `owner/name` form |
| `stale_days` | `60` | Minimum days since last update |
| `issue_limit` | `100` | Maximum open issues to inspect |
| `dry_run` | `true` | Return the report without mutating GitHub |

## Output

The final step returns the report body and, when created, the report issue URL:

```json
{
  "dry_run": true,
  "stale_count": 7,
  "report_created": false,
  "report_issue_url": null,
  "report_body": "# Stale issue triage for OWNER/REPO\n..."
}
```

This workflow creates one report issue instead of editing many issues, which keeps it runnable without fan-out builtins.