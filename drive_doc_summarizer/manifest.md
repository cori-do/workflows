---
id: drive_doc_summarizer
name: Drive Doc Summarizer
description: Export a Google Drive document, summarize it, create a structured Google Doc, and email the result.
created: 2026-05-28
version: 1
parameters:
  - name: source_file_id
    type: string
    default: replace-with-drive-file-id
    description: Google Drive file ID to export as plain text
  - name: doc_title
    type: string
    default: Cori Summary
    description: Title for the generated Google Doc
  - name: recipient
    type: string
    default: you@example.com
    description: Email recipient for the generated document link
  - name: access_role
    type: enum
    default: reader
    values: [reader, commenter, writer]
    description: Drive permission role to grant the recipient
  - name: max_input_chars
    type: number
    default: 24000
    description: Maximum source characters to send to the LLM
  - name: from_email
    type: string
    default: ""
    required: false
    description: Optional From header; Gmail may use the authenticated account when empty
tools_required: [gws]
mcp_servers: []
tags: [google-workspace, drive, docs, gmail, summarization]
---

# Drive Doc Summarizer

## Goal
Turn a long Google Drive document or transcript into a structured summary document and email the link to a teammate. This is the advanced reference workflow: Drive export, LLM extraction, Docs creation, Docs update, and Gmail delivery.

## Preconditions
- The worker has the `gws` CLI installed and authenticated for Drive, Docs, and Gmail
- The authenticated Google account can read `source_file_id`
- The authenticated Google account can create Google Docs, share them, and send Gmail messages

## Steps
1. **export_source** (cli) - Export the Drive file as plain text
2. **summarize_source** (llm) - Extract a concise summary, key points, actions, and risks
3. **create_doc** (cli) - Create the destination Google Doc
4. **build_doc_requests** (code) - Build a Docs API batchUpdate request from the summary
5. **populate_doc** (cli) - Insert the summary into the generated document
6. **grant_access** (cli) - Grant the recipient permission to access the generated document
7. **build_email** (code) - Build a Gmail-ready notification email
8. **send_email** (cli) - Email the generated document link
9. **summarize_result** (code) - Return the document URL and Gmail IDs

## Verification
- `cori check drive_doc_summarizer` validates the manifest and all nine steps
- `cori run drive_doc_summarizer source_file_id=... recipient=...` creates one Google Doc, shares it with the recipient, and sends one email
- The final output includes the generated document URL and Gmail message ID

## Notes
- `max_input_chars` keeps the example predictable for long transcripts. Increase it when your model and budget allow.
- This workflow favors simple plain-text document insertion so the API calls stay readable for new users.
- The `grant_access` step shares the doc directly with `recipient` (default `reader`) before emailing the link, so the recipient can actually open it. It uses `sendNotificationEmail: false` to avoid a duplicate share notification, since the workflow sends its own email.