import { step } from "@cori/sdk";
import { z } from "zod";

const Issue = z.object({
  number: z.number(),
  title: z.string(),
  url: z.string(),
  author_login: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  labels: z.array(z.string()),
  assignees: z.array(z.string()),
});

const StaleIssue = Issue.extend({
  days_since_update: z.number(),
});

const Input = z.object({
  repo: z.string(),
  stale_days: z.number(),
  open_issues: z.array(Issue),
});

const Output = z.object({
  stale_issues: z.array(StaleIssue),
  stale_count: z.number(),
  report_title: z.string(),
  report_body: z.string(),
});

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export default step.code({
  description: "Find stale issues and build the report",
  input: Input,
  output: Output,
  run: ({ repo, stale_days, open_issues }) => {
    const now = new Date();
    const stale_issues = open_issues
      .filter((issue) => !issue.labels.some((label) => label.toLowerCase() === "stale"))
      .map((issue) => ({
        ...issue,
        days_since_update: Math.floor((now.getTime() - new Date(issue.updated_at).getTime()) / millisecondsPerDay),
      }))
      .filter((issue) => issue.days_since_update >= stale_days)
      .sort((left, right) => right.days_since_update - left.days_since_update);

    const report_title = `Stale issue triage for ${repo}`;
    const lines = [
      `# Stale issue triage for ${repo}`,
      "",
      `Threshold: ${stale_days} days without an update`,
      `Stale issues found: ${stale_issues.length}`,
      "",
    ];

    if (stale_issues.length === 0) {
      lines.push("No stale issues were found.");
    } else {
      stale_issues.forEach((issue) => {
        const assignees = issue.assignees.length > 0 ? issue.assignees.join(", ") : "unassigned";
        lines.push(`- #${issue.number} ${issue.title}`);
        lines.push(`  - URL: ${issue.url}`);
        lines.push(`  - Last updated: ${issue.updated_at} (${issue.days_since_update} days ago)`);
        lines.push(`  - Author: ${issue.author_login}`);
        lines.push(`  - Assignees: ${assignees}`);
      });
    }

    return {
      stale_issues,
      stale_count: stale_issues.length,
      report_title,
      report_body: lines.join("\n"),
    };
  },
});