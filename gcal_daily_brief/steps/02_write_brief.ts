import { step } from "@cori/sdk";
import { z } from "zod";
import { AgendaBrief, CalendarEvent } from "../types";

const Input = z.object({
  timezone: z.string(),
  lookahead_hours: z.number(),
  events: z.array(CalendarEvent),
});

export default step.llm({
  description: "Write a concise agenda brief",
  input: Input,
  output: AgendaBrief,
  model: "gpt-4o-mini",
  prompt: ({ timezone, lookahead_hours, events }) => `
You are writing a concise agenda email for the next ${lookahead_hours} hours.
The user's timezone is ${timezone}.

Write a useful brief with:
- a short subject line
- a 1 paragraph overview
- a compact chronological agenda
- any obvious preparation notes inferred only from event titles, locations, or attendees

Rules:
- Do not invent meetings or details.
- If there are no events, write a calm empty-calendar brief.
- Return JSON matching this schema: { "subject": string, "brief_text": string, "event_count": number }.

Events:
${JSON.stringify(events, null, 2)}
`.trim(),
});