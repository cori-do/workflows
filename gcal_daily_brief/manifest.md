---
id: gcal_daily_brief
name: Google Calendar Daily Brief
description: Send a concise agenda email from the next Google Calendar events using Calendar, Gmail, and one LLM step.
created: 2026-05-28
version: 1
parameters:
  - name: calendar_id
    type: string
    default: primary
    description: Google Calendar ID to inspect
  - name: recipient
    type: string
    default: you@example.com
    description: Email recipient for the agenda brief
  - name: timezone
    type: string
    default: UTC
    description: Time zone name to use in the brief
  - name: lookahead_hours
    type: number
    default: 24
    description: Number of hours of upcoming events to include
  - name: from_email
    type: string
    default: ""
    required: false
    description: Optional From header; Gmail may use the authenticated account when empty
tools_required: [gws]
mcp_servers: []
tags: [google-workspace, calendar, gmail, briefing]
schedule: "0 8 * * 1-5"
schedule_tz: UTC
---

# Google Calendar Daily Brief

## Goal
Create a practical morning agenda: read upcoming Google Calendar events, ask an LLM to turn them into a concise brief, and send it by Gmail. This demonstrates a realistic multi-service `gws` workflow without turning the LLM into the whole workflow.

## Preconditions
- The worker has the `gws` CLI installed and authenticated for Google Calendar and Gmail
- The authenticated Google account can read `calendar_id`
- Gmail send permission is available for the authenticated account

## Steps
1. **list_events** (cli) - Read upcoming calendar events with `gws calendar events list`
2. **write_brief** (llm) - Turn the event list into a concise agenda email
3. **build_email** (code) - Build a base64url RFC822 message for Gmail
4. **send_email** (cli) - Send the agenda with `gws gmail users messages send`
5. **summarize_result** (code) - Return the Gmail IDs and original event count

## Verification
- `cori check gcal_daily_brief` validates the manifest and all five steps
- `cori run gcal_daily_brief recipient=you@example.com` sends one email with the upcoming agenda
- The final output includes the Gmail message ID and event count

## Notes
- The workflow looks ahead from run time rather than trying to model local-day boundaries, which keeps the example simple and dependable.
- Set `lookahead_hours=12` for a workday brief or `lookahead_hours=48` before a weekend or travel day.