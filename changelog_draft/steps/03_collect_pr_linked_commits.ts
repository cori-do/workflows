import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  base_tag: z.string(),
  target_ref: z.string(),
});

const Output = z.object({
  pr_linked_commits: z.string(),
});

export default step.cli({
  description: "Gather PR-linked commit refs",
  input: Input,
  output: Output,
  command: ({ base_tag, target_ref }) => [
    "git",
    "log",
    "--first-parent",
    "--fixed-strings",
    "--grep",
    "(#",
    "--date=short",
    "--pretty=format:%h%x09%ad%x09%s",
    `${base_tag}..${target_ref}`,
  ],
  parse: (stdout) => ({ pr_linked_commits: stdout.trim() }),
});
