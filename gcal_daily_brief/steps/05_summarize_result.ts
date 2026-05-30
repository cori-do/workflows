import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  event_count: z.number(),
  message_id: z.string().nullable(),
  thread_id: z.string().nullable(),
});

const Output = z.object({
  event_count: z.number(),
  message_id: z.string().nullable(),
  thread_id: z.string().nullable(),
});

export default step.code({
  description: "Summarize the sent agenda email",
  input: Input,
  output: Output,
  run: ({ event_count, message_id, thread_id }) => ({
    event_count,
    message_id,
    thread_id,
  }),
});