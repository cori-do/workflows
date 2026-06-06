import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  base_tag: z.string(),
  target_ref: z.string(),
});

const Output = z.object({
  primary_history: z.string(),
});

export default step.cli({
  description: "Gather first-parent release history",
  input: Input,
  output: Output,
  command: ({ base_tag, target_ref }) => [
    "git",
    "log",
    "--first-parent",
    "--date=iso-strict",
    "--pretty=format:%h%x09%ad%x09%s",
    `${base_tag}..${target_ref}`,
  ],
  parse: (stdout) => ({ primary_history: stdout.trim() }),
});
