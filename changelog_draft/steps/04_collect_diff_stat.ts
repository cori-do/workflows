import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  base_tag: z.string(),
  target_ref: z.string(),
});

const Output = z.object({
  diff_stat: z.string(),
});

export default step.cli({
  description: "Capture release diff stat",
  input: Input,
  output: Output,
  command: ({ base_tag, target_ref }) => [
    "git",
    "diff",
    "--stat",
    `${base_tag}..${target_ref}`,
  ],
  parse: (stdout) => ({ diff_stat: stdout.trim() }),
});
