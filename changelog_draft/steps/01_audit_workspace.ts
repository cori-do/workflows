import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({});

const Output = z.object({
  workspace_status: z.string(),
});

export default step.cli({
  description: "Capture branch and workspace status",
  input: Input,
  output: Output,
  command: () => ["git", "status", "-sb"],
  parse: (stdout) => ({ workspace_status: stdout.trim() }),
});
