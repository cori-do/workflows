import { describe, expect, it } from "vitest";

import renderChangelogMarkdown from "../steps/06_render_changelog_markdown";
import sections from "./fixtures/changelog_sections.json";

describe("render_changelog_markdown", () => {
  it("formats release notes as stable markdown", async () => {
    const result = await renderChangelogMarkdown.run({
      release_version: "v0.2.11",
      sections,
    });

    expect(result.markdown).toBe(`## v0.2.11

### Highlights
- Refreshed the README with clearer positioning, install/try-it flow, and a shorter value proposition.
- Added version and license badges to the project landing page.

### Changes
- Simplified the Why Cori copy to be more direct.
- Moved source-build instructions into a collapsible section and made the quickstart run \`cori run cori-do/workflows/hello_world\` immediately after install.

### Fixes
- Pending local change: Google Workspace CLI auth now checks \`gws auth status\` instead of listing accounts, and only considers the CLI authenticated when a refresh token is available and encryption is valid.
`);
  });
});
