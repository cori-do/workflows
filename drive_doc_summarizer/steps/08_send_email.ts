import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  raw_message: z.string(),
});

const Output = z.object({
  message_id: z.string().nullable(),
  thread_id: z.string().nullable(),
});

export default step.cli({
  description: "Email the generated summary document",
  input: Input,
  output: Output,
  command: ({ raw_message }) => [
    "gws",
    "gmail",
    "users",
    "messages",
    "send",
    "--params",
    JSON.stringify({
      userId: "me",
    }),
    "--json",
    JSON.stringify({ raw: raw_message }),
    "--format",
    "json",
  ],
  parse: (stdout) => {
    const raw = JSON.parse(stdout) as { id?: string; threadId?: string };
    return {
      message_id: raw.id ?? null,
      thread_id: raw.threadId ?? null,
    };
  },
});