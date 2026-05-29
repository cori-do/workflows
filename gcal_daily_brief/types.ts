import { z } from "zod";

export const CalendarEvent = z.object({
  id: z.string(),
  summary: z.string(),
  start: z.string(),
  end: z.string(),
  location: z.string().nullable(),
  html_link: z.string().nullable(),
  attendees: z.array(z.string()),
});
export type CalendarEvent = z.infer<typeof CalendarEvent>;

export const AgendaBrief = z.object({
  subject: z.string(),
  brief_text: z.string(),
  event_count: z.number(),
});
export type AgendaBrief = z.infer<typeof AgendaBrief>;