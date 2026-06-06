import { step } from "@cori-do/sdk";

import { DraftChangelogInput, DraftSections } from "../types";

const Output = DraftSections;

export default step.llm({
  description: "Rewrite release history into changelog sections",
  input: DraftChangelogInput,
  output: Output,
  model: "gpt-4o-mini",
  prompt: ({
    workspace_status,
    primary_history,
    pr_linked_commits,
    diff_stat,
    release_version,
  }) => `
You are drafting a user-facing release changelog section.

Write the release notes for ${release_version} only. Return JSON matching the schema with arrays for highlights, changes, and fixes.

Rules:
- Keep bullets single-line.
- Preserve every PR ref, issue ref, "Fixes #...", and "Thanks @..." that belongs with a change.
- Group related commits when they clearly describe the same user-facing change.
- Sort by user interest: security/data-loss and content-boundary fixes first, then transcript/replay/reply correctness, then integrations, then provider/model reliability, then install/update/release-path reliability, then performance/observability, then docs/internal details last or omit.
- Use the workspace status only as context; do not turn unrelated local changes into release notes.
- Do not invent refs, thanks, or issue links.

Workspace status:
${workspace_status || "(clean)"}

First-parent history:
${primary_history || "(none)"}

PR-linked commits:
${pr_linked_commits || "(none)"}

Diff stat:
${diff_stat || "(none)"}
`.trim(),
});
