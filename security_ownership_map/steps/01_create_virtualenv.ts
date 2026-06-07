import { step } from "@cori-do/sdk";
import { WorkflowParams } from "../types";
import { z } from "zod";

const Output = z.object({
  venv_python: z.string(),
});

export default step.cli({
  description: "Create a repo-local virtualenv for ownership analysis",
  input: WorkflowParams,
  output: Output,
  command: ({ venv_dir }) => [
    "python3",
    "-c",
    [
      "import json, subprocess, sys",
      "venv_dir = sys.argv[1]",
      "subprocess.run([sys.executable, '-m', 'venv', venv_dir], check=True)",
      "print(json.dumps({'venv_python': f'{venv_dir}/bin/python'}))",
    ].join("\n"),
    venv_dir,
  ],
  parse: (stdout) => Output.parse(JSON.parse(stdout)),
});
