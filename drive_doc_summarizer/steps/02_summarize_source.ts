import { step } from "@cori/sdk";
import { z } from "zod";
import { DocumentSummary } from "../types";

const Input = z.object({
  doc_title: z.string(),
  source_text: z.string(),
  source_char_count: z.number(),
  max_input_chars: z.number(),
});

export default step.llm({
  description: "Summarize the exported Drive document",
  input: Input,
  output: DocumentSummary,
  model: "gpt-4o-mini",
  prompt: ({ doc_title, source_text, source_char_count, max_input_chars }) => `
You are summarizing a document titled "${doc_title}" for a busy teammate.

Return JSON matching this schema:
{
  "summary_title": string,
  "summary": string,
  "key_points": string[],
  "action_items": [{ "owner": string | null, "task": string, "due_date": string | null }],
  "risks": string[]
}

Rules:
- Be specific and concise.
- Do not invent facts, owners, dates, or risks.
- If an action item has no owner or due date, use null.
- The source has ${source_char_count} characters; the prompt includes the first ${max_input_chars} characters.

Source:
${source_text.slice(0, max_input_chars)}
`.trim(),
});