import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  repo: z.string(),
  dry_run: z.boolean(),
  stale_count: z.number(),
  report_title: z.string(),
  report_body: z.string(),
});

const Output = z.object({
  report_created: z.boolean(),
  report_issue_url: z.string().nullable(),
});

export default step.cli({
  description: "Create the stale issue triage report",
  input: Input,
  output: Output,
  command: ({ repo, dry_run, stale_count, report_title, report_body }) => {
    if (dry_run || stale_count === 0) {
      return [
        "gh",
        "api",
        "rate_limit",
        "--jq",
        '{"created":false,"url":null}',
      ];
    }

    return [
      "gh",
      "api",
      `repos/${repo}/issues`,
      "-f",
      `title=${report_title}`,
      "-f",
      `body=${report_body}`,
      "--jq",
      '{"created":true,"url":.html_url}',
    ];
  },
  parse: (stdout) => {
    const result = JSON.parse(stdout) as { created?: boolean; url?: string | null };
    return {
      report_created: result.created ?? false,
      report_issue_url: result.url ?? null,
    };
  },
});