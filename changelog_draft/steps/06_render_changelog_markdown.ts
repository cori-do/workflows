import { step } from "@cori-do/sdk";
import { z } from "zod";

import {
  RenderChangelogInput,
  type RenderChangelogInput as RenderChangelogInputData,
} from "../types";

const Output = z.object({
  markdown: z.string(),
});

function renderSection(title: string, items: string[]): string[] {
  const lines = [`### ${title}`];
  for (const item of items) {
    lines.push(`- ${item}`);
  }
  return lines;
}

export default step.code({
  description: "Format changelog sections as markdown",
  input: RenderChangelogInput,
  output: Output,
  run: ({
    release_version,
    highlights,
    changes,
    fixes,
  }: RenderChangelogInputData) => {
    const lines = [`## ${release_version}`, ""];
    lines.push(...renderSection("Highlights", highlights), "");
    lines.push(...renderSection("Changes", changes), "");
    lines.push(...renderSection("Fixes", fixes));
    return { markdown: `${lines.join("\n")}\n` };
  },
});
