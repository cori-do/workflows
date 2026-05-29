import { step } from "@cori/sdk";
import { z } from "zod";
import { CalendarEvent } from "../types";

const Input = z.object({
  calendar_id: z.string(),
  timezone: z.string(),
  lookahead_hours: z.number(),
});

const Output = z.object({
  events: z.array(CalendarEvent),
  window_start: z.string(),
  window_end: z.string(),
});

const readEventTime = (value: { date?: string; dateTime?: string } | undefined): string => {
  if (!value) {
    return "";
  }
  return value.dateTime ?? value.date ?? "";
};

export default step.cli({
  description: "List upcoming Google Calendar events",
  input: Input,
  output: Output,
  command: ({ calendar_id, timezone, lookahead_hours }) => {
    const windowStart = new Date();
    const windowEnd = new Date(windowStart.getTime() + lookahead_hours * 60 * 60 * 1000);
    return [
      "gws",
      "calendar",
      "events",
      "list",
      "--params",
      JSON.stringify({
        calendarId: calendar_id,
        timeMin: windowStart.toISOString(),
        timeMax: windowEnd.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        timeZone: timezone,
      }),
      "--format",
      "json",
    ];
  },
  parse: (stdout) => {
    const raw = JSON.parse(stdout) as {
      items?: Array<{
        id?: string;
        summary?: string;
        start?: { date?: string; dateTime?: string };
        end?: { date?: string; dateTime?: string };
        location?: string;
        htmlLink?: string;
        attendees?: Array<{ email?: string }>;
      }>;
      timeMin?: string;
      timeMax?: string;
    };

    return {
      events: (raw.items ?? []).map((event) => CalendarEvent.parse({
        id: event.id ?? "",
        summary: event.summary ?? "Untitled event",
        start: readEventTime(event.start),
        end: readEventTime(event.end),
        location: event.location ?? null,
        html_link: event.htmlLink ?? null,
        attendees: event.attendees?.map((attendee) => attendee.email ?? "").filter(Boolean) ?? [],
      })),
      window_start: raw.timeMin ?? "",
      window_end: raw.timeMax ?? "",
    };
  },
});