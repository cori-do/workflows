# Drive Doc Summarizer

Exports a Google Drive document, summarizes it, writes the summary into a new Google Doc, and emails the generated link.

## Requirements

- `gws` installed and authenticated
- `cori login gws` with Drive read, Docs create/update, and Gmail send access
- `cori login openai` for the summarization step

## Run

```sh
cori check ./drive_doc_summarizer
cori run ./drive_doc_summarizer source_file_id=DRIVE_FILE_ID recipient=you@example.com doc_title="Weekly Summary"
```

## Parameters

| Name | Default | Description |
|---|---:|---|
| `source_file_id` | `replace-with-drive-file-id` | Google Drive file ID to export |
| `doc_title` | `Cori Summary` | Title for the generated Google Doc |
| `recipient` | `you@example.com` | Email recipient for the generated document link |
| `access_role` | `reader` | Drive role granted to the recipient (`reader`, `commenter`, `writer`) |
| `max_input_chars` | `24000` | Maximum source characters to send to the LLM |
| `from_email` | empty | Optional `From` header |

## Output

The final step returns the created document URL and Gmail IDs:

```json
{
  "document_url": "https://docs.google.com/document/d/.../edit",
  "doc_updated": true,
  "message_id": "...",
  "thread_id": "..."
}
```

Before emailing the link, the workflow shares the generated doc with `recipient` so they can open it. Adjust the granted role with `access_role`.

This is the advanced reference example because it crosses Drive, Docs, Gmail, and LLM extraction in one deterministic sequence.

## Notes

`gws drive files export` writes exported bytes to a local output file, so this workflow uses `.cori-drive-doc-summarizer-source.txt` as a scratch file in the current working directory and reads it during the parse step.