import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  repo: z.string(),
  since_date: z.string().optional(),
});

const Output = z.object({
  latest_release_tag: z.string().nullable(),
  latest_release_published_at: z.string().nullable(),
  latest_release_url: z.string().nullable(),
});

export default step.cli({
  description: "Read the latest GitHub release",
  input: Input,
  output: Output,
  command: ({ repo, since_date }) => {
    if (since_date?.trim()) {
      return [
        "gh",
        "api",
        "rate_limit",
        "--jq",
        '{"tagName":null,"publishedAt":null,"url":null}',
      ];
    }

    return [
      "gh",
      "release",
      "list",
      "--repo",
      repo,
      "--limit",
      "1",
      "--json",
      "tagName,publishedAt,url",
      "--jq",
      '.[0] // {"tagName":null,"publishedAt":null,"url":null}',
    ];
  },
  parse: (stdout) => {
    const release = JSON.parse(stdout) as {
      tagName?: string | null;
      publishedAt?: string | null;
      url?: string | null;
    };
    return {
      latest_release_tag: release.tagName ?? null,
      latest_release_published_at: release.publishedAt ?? null,
      latest_release_url: release.url ?? null,
    };
  },
});