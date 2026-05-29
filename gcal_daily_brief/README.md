# Google Calendar Daily Brief

Reads upcoming Google Calendar events, writes a concise agenda brief, and sends it by Gmail.

## Requirements

- `gws` installed and authenticated
- `cori login gws` with Calendar read and Gmail send access
- `cori login openai` for the LLM briefing step

## Run

```sh
cori check ./gcal_daily_brief
cori run ./gcal_daily_brief recipient=you@example.com timezone=Europe/Paris
```

## Parameters

| Name | Default | Description |
|---|---:|---|
| `calendar_id` | `primary` | Calendar ID to inspect |
| `recipient` | `you@example.com` | Email recipient for the agenda brief |
| `timezone` | `UTC` | Time zone name to use in the prompt and Calendar API call |
| `lookahead_hours` | `24` | Number of upcoming hours to include |
| `from_email` | empty | Optional `From` header |

## Output

The final step returns the Gmail IDs and number of events summarized:

```json
{
  "event_count": 4,
  "message_id": "...",
  "thread_id": "..."
}
```

The workflow is scheduled for weekday mornings by default, but it can also be run manually.