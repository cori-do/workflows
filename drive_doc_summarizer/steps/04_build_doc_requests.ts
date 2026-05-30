import { step } from "@cori-do/sdk";
import { z } from "zod";
import { ActionItem } from "../types";

const Input = z.object({
  summary_title: z.string().default("Dry-run summary"),
  summary: z.string().default("Summary unavailable in Cori dry-run mode."),
  key_points: z.array(z.string()).default([]),
  action_items: z.array(ActionItem).default([]),
  risks: z.array(z.string()).default([]),
});

const Output = z.object({
  doc_text: z.string(),
  batch_update_requests: z.array(z.unknown()),
});

export default step.code({
  description: "Build Google Docs insert requests",
  input: Input,
  output: Output,
  run: ({
    summary_title = "Dry-run summary",
    summary = "Summary unavailable in Cori dry-run mode.",
    key_points = [],
    action_items = [],
    risks = [],
  }) => {
    const lines = [
      summary_title,
      "",
      "Summary",
      summary,
      "",
      "Key Points",
      ...key_points.map((point) => `- ${point}`),
      "",
      "Action Items",
      ...(action_items.length > 0
        ? action_items.map((item) => {
            const owner = item.owner ?? "Unassigned";
            const due = item.due_date ? ` due ${item.due_date}` : "";
            return `- ${item.task} (${owner}${due})`;
          })
        : ["- None identified"]),
      "",
      "Risks",
      ...(risks.length > 0 ? risks.map((risk) => `- ${risk}`) : ["- None identified"]),
      "",
    ];
    const doc_text = lines.join("\n");
    return {
      doc_text,
      batch_update_requests: [
        {
          insertText: {
            location: { index: 1 },
            text: doc_text,
          },
        },
      ],
    };
  },
});