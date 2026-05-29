import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  document_id: z.string(),
  batch_update_requests: z.array(z.unknown()),
});

const Output = z.object({
  doc_updated: z.boolean(),
  replies_count: z.number(),
});

export default step.cli({
  description: "Populate the summary Google Doc",
  input: Input,
  output: Output,
  command: ({ document_id, batch_update_requests }) => [
    "gws",
    "docs",
    "documents",
    "batchUpdate",
    "--params",
    JSON.stringify({
      documentId: document_id,
    }),
    "--json",
    JSON.stringify({ requests: batch_update_requests }),
    "--format",
    "json",
  ],
  parse: (stdout) => {
    const raw = JSON.parse(stdout) as { replies?: unknown[] };
    return {
      doc_updated: true,
      replies_count: raw.replies?.length ?? 0,
    };
  },
});