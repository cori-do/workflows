# GitHub Release Notes

Drafts release notes from merged pull requests in a GitHub repository.

## Requirements

- `gh` installed and authenticated
- `cori login openai` for the LLM drafting step
- Read access to the target repository

## Run

```sh
cori check ./github_release_notes
cori run ./github_release_notes repo=OWNER/REPO
```

Use a fixed lower bound when preparing a specific release:

```sh
cori run ./github_release_notes repo=OWNER/REPO since_date=2026-05-01 pr_limit=75
```

## Parameters

| Name | Default | Description |
|---|---:|---|
| `repo` | `cori-do/cori` | GitHub repository in `owner/name` form |
| `since_date` | empty | Optional `YYYY-MM-DD` lower bound; latest release date is used when empty |
| `pr_limit` | `50` | Maximum merged pull requests to inspect |

## Output

The final step returns markdown release notes and the number of pull requests used:

```json
{
  "release_notes": "## Highlights\n...",
  "pr_count": 12
}
```

The workflow drafts notes only; it does not create or publish a GitHub release.