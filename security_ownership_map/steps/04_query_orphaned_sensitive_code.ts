import { step } from "@cori-do/sdk";
import { WorkflowParams, OrphanedSensitiveCode } from "../types";
import { z } from "zod";

const Input = WorkflowParams.extend({
  venv_python: z.string(),
  analysis_ready: z.literal(true),
});

const Output = z.object({
  orphaned_sensitive_code: z.array(OrphanedSensitiveCode),
});

export default step.cli({
  description: "Query orphaned sensitive code from the ownership summary",
  input: Input,
  output: Output,
  command: ({ ownership_skill_root, out_dir, venv_python }) => [
    "python3",
    "-c",
    "import subprocess, sys; subprocess.run([sys.argv[1], *sys.argv[2:]], check=True)",
    venv_python,
    `${ownership_skill_root}/scripts/query_ownership.py`,
    "--data-dir",
    out_dir,
    "summary",
    "--section",
    "orphaned_sensitive_code",
  ],
  parse: (stdout) => ({
    orphaned_sensitive_code: z.array(OrphanedSensitiveCode).parse(JSON.parse(stdout)),
  }),
});
