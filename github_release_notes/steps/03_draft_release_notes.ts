import { step } from "@cori-do/sdk";
import { z } from "zod";

const PullRequest = z.object({
  number: z.number(),
  title: z.string(),
  url: z.string(),
  author_login: z.string(),
  merged_at: z.string().nullable(),
  labels: z.array(z.string()),
});

const Input = z.object({
  repo: z.string(),
  since_date: z.string().optional(),
  latest_release_tag: z.string().nullable(),
  latest_release_published_at: z.string().nullable(),
  merged_prs: z.array(PullRequest),
});

const Output = z.object({
  release_notes: z.string(),
  pr_count: z.number(),
});

export default step.llm({
  description: "Draft release notes from merged pull requests",
  input: Input,
  output: Output,
  model: "gpt-4o-mini",
  prompt: ({ repo, since_date, latest_release_tag, latest_release_published_at, merged_prs }) => `
You are drafting release notes for ${repo}.

Use the merged pull requests below to write concise, useful release notes for humans.
Group changes under these headings when applicable:
- Highlights
- Features
- Fixes
- Maintenance

Rules:
- Do not invent changes that are not represented by the pull requests.
- Prefer user-facing language over implementation details.
- Include pull request numbers as markdown links.
- If there are no pull requests, return a short note that no merged PRs were found.
- Return JSON matching this schema: { "release_notes": string, "pr_count": number }.

Release window:
${since_date?.trim() ? `Since ${since_date}` : latest_release_published_at ? `Since ${latest_release_tag ?? "latest release"} (${latest_release_published_at})` : "No previous release detected"}

Pull requests:
${JSON.stringify(merged_prs, null, 2)}
`.trim(),
});