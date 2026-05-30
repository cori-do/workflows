import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  document_url: z.string().default("https://docs.google.com/document/d/dry-run/edit"),
  doc_updated: z.boolean().default(false),
  message_id: z.string().nullable().default(null),
  thread_id: z.string().nullable().default(null),
});

const Output = z.object({
  document_url: z.string(),
  doc_updated: z.boolean(),
  message_id: z.string().nullable(),
  thread_id: z.string().nullable(),
});

export default step.code({
  description: "Summarize the generated document delivery",
  input: Input,
  output: Output,
  run: ({
    document_url = "https://docs.google.com/document/d/dry-run/edit",
    doc_updated = false,
    message_id = null,
    thread_id = null,
  }) => ({
    document_url,
    doc_updated,
    message_id,
    thread_id,
  }),
});