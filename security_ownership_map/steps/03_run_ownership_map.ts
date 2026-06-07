import { step } from "@cori-do/sdk";
import { WorkflowParams } from "../types";
import { z } from "zod";

const Input = WorkflowParams.extend({
  venv_python: z.string(),
});

const Output = z.object({
  analysis_ready: z.literal(true),
});

export default step.cli({
  description: "Generate the ownership map artifacts and summary",
  input: Input,
  output: Output,
  command: ({ ownership_skill_root, out_dir, repo_path, since, venv_python }) => [
    "python3",
    "-c",
    [
      "import subprocess, sys",
      "venv_python, skill_root, repo_path, out_dir, since = sys.argv[1:6]",
      "cmd = [venv_python, f'{skill_root}/scripts/run_ownership_map.py', '--repo', repo_path, '--out', out_dir, '--emit-commits']",
      "if since.strip(): cmd.extend(['--since', since])",
      "subprocess.run(cmd, check=True)",
    ].join("\n"),
    venv_python,
    ownership_skill_root,
    repo_path,
    out_dir,
    since ?? "",
  ],
  parse: () => ({
    analysis_ready: true,
  }),
});
