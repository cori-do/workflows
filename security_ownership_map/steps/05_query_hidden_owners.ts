import { step } from "@cori-do/sdk";
import { HiddenOwner, OrphanedSensitiveCode, WorkflowParams } from "../types";
import { z } from "zod";

const Input = WorkflowParams.extend({
  venv_python: z.string(),
  analysis_ready: z.literal(true),
  orphaned_sensitive_code: z.array(OrphanedSensitiveCode),
});

const Output = z.object({
  hidden_owners: z.array(HiddenOwner),
});

export default step.cli({
  description: "Query hidden owners of sensitive code paths",
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
    "hidden_owners",
  ],
  parse: (stdout) => ({
    hidden_owners: z.array(HiddenOwner).parse(JSON.parse(stdout)),
  }),
});
