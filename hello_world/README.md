# Hello World

The bundled demo workflow. Fetches a random quote, counts its words, and formats a friendly one-liner — three steps, zero credentials, zero cost.

## Requirements

- `curl` available on the worker
- Internet access to `https://zenquotes.io`

## Run

```sh
cori check ./hello_world
cori run ./hello_world
```

Or use the bundled shortcut, which extracts the workflow source to `~/.cori/cache/hello_world/` on first use:

```sh
cori demo
```

## Parameters

This workflow takes no parameters.

## Output

The final step returns the formatted message and the word count:

```json
{
  "message": "\"The best way out is always through.\" — Robert Frost (8 words)",
  "word_count": 8
}
```

This is the recommended first workflow to run because it has no credentials and no LLM cost.
