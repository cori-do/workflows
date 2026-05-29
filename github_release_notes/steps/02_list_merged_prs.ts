import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  repo: z.string(),
  since_date: z.string().optional(),
  pr_limit: z.number(),
  latest_release_published_at: z.string().nullable(),
});

const PullRequest = z.object({
  number: z.number(),
  title: z.string(),
  url: z.string(),
  author_login: z.string(),
  merged_at: z.string().nullable(),
  labels: z.array(z.string()),
});

const Output = z.object({
  merged_prs: z.array(PullRequest),
  release_window_start: z.string().nullable(),
});

export default step.cli({
  description: "List merged pull requests for the release window",
  input: Input,
  output: Output,
  command: ({ repo, since_date, pr_limit, latest_release_published_at }) => {
    const releaseWindowStart = since_date?.trim() || latest_release_published_at?.slice(0, 10) || "";
    return [
      "gh",
      "pr",
      "list",
      "--repo",
      repo,
      "--state",
      "merged",
      "--limit",
      String(pr_limit),
      "--json",
      "number,title,url,author,mergedAt,labels",
      ...(releaseWindowStart ? ["--search", `merged:>=${releaseWindowStart}`] : []),
    ];
  },
  parse: (stdout) => {
    const prs = JSON.parse(stdout) as Array<{
      number: number;
      title: string;
      url: string;
      author?: { login?: string } | null;
      mergedAt?: string | null;
      labels?: Array<{ name?: string }>;
    }>;

    return {
      merged_prs: prs.map((pr) => PullRequest.parse({
        number: pr.number,
        title: pr.title,
        url: pr.url,
        author_login: pr.author?.login ?? "unknown",
        merged_at: pr.mergedAt ?? null,
        labels: pr.labels?.map((label) => label.name ?? "").filter(Boolean) ?? [],
      })),
      release_window_start: null,
    };
  },
});