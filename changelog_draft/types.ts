import { z } from "zod";

export const ReleaseContext = z.object({
  workspace_status: z.string(),
  primary_history: z.string(),
  pr_linked_commits: z.string(),
  diff_stat: z.string(),
});

export type ReleaseContext = z.infer<typeof ReleaseContext>;

export const DraftSections = z.object({
  highlights: z.array(z.string()),
  changes: z.array(z.string()),
  fixes: z.array(z.string()),
});

export type DraftSections = z.infer<typeof DraftSections>;

export const DraftChangelogInput = ReleaseContext.extend({
  release_version: z.string(),
});

export type DraftChangelogInput = z.infer<typeof DraftChangelogInput>;

export const RenderChangelogInput = DraftSections.extend({
  release_version: z.string(),
});

export type RenderChangelogInput = z.infer<typeof RenderChangelogInput>;
