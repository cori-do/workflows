import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  doc_title: z.string(),
});

const Output = z.object({
  document_id: z.string(),
  document_url: z.string(),
});

export default step.cli({
  description: "Create the summary Google Doc",
  input: Input,
  output: Output,
  command: ({ doc_title }) => [
    "gws",
    "docs",
    "documents",
    "create",
    "--json",
    JSON.stringify({ title: doc_title }),
    "--format",
    "json",
  ],
  parse: (stdout) => {
    const raw = JSON.parse(stdout) as { documentId?: string };
    if (!raw.documentId) {
      throw new Error("Docs create response did not include documentId");
    }
    return {
      document_id: raw.documentId,
      document_url: `https://docs.google.com/document/d/${raw.documentId}/edit`,
    };
  },
});