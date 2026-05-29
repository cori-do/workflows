import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  dry_run: z.boolean(),
  stale_count: z.number(),
  report_body: z.string(),
  report_created: z.boolean(),
  report_issue_url: z.string().nullable(),
});

const Output = z.object({
  dry_run: z.boolean(),
  stale_count: z.number(),
  report_created: z.boolean(),
  report_issue_url: z.string().nullable(),
  report_body: z.string(),
});

export default step.code({
  description: "Summarize the stale issue triage result",
  input: Input,
  output: Output,
  run: ({ dry_run, stale_count, report_body, report_created, report_issue_url }) => ({
    dry_run,
    stale_count,
    report_created,
    report_issue_url,
    report_body,
  }),
});