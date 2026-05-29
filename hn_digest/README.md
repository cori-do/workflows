# Hacker News Digest

Builds a compact markdown digest from the current Hacker News top stories feed.

## Requirements

- `curl` available on the worker
- Internet access to `https://hacker-news.firebaseio.com`

## Run

```sh
cori check ./hn_digest
cori run ./hn_digest story_count=5
```

## Parameters

| Name | Default | Description |
|---|---:|---|
| `story_count` | `10` | Number of top stories to include |

## Output

The final step returns:

```json
{
  "digest": "# Hacker News Digest\n...",
  "story_count": 5
}
```

This is the recommended first workflow to run because it has no credentials and no LLM cost.