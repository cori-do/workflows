import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  repo: z.string(),
  issue_limit: z.number(),
});

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

const Output = z.object({
  open_issues: z.array(Issue),
});

export default step.cli({
  description: "List open GitHub issues",
  input: Input,
  output: Output,
  command: ({ repo, issue_limit }) => [
    "gh",
    "issue",
    "list",
    "--repo",
    repo,
    "--state",
    "open",
    "--limit",
    String(issue_limit),
    "--json",
    "number,title,url,author,createdAt,updatedAt,labels,assignees",
  ],
  parse: (stdout) => {
    const issues = JSON.parse(stdout) as Array<{
      number: number;
      title: string;
      url: string;
      author?: { login?: string } | null;
      createdAt: string;
      updatedAt: string;
      labels?: Array<{ name?: string }>;
      assignees?: Array<{ login?: string }>;
    }>;

    return {
      open_issues: issues.map((issue) => Issue.parse({
        number: issue.number,
        title: issue.title,
        url: issue.url,
        author_login: issue.author?.login ?? "unknown",
        created_at: issue.createdAt,
        updated_at: issue.updatedAt,
        labels: issue.labels?.map((label) => label.name ?? "").filter(Boolean) ?? [],
        assignees: issue.assignees?.map((assignee) => assignee.login ?? "").filter(Boolean) ?? [],
      })),
    };
  },
});