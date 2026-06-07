import { step } from "@cori-do/sdk";
import { WorkflowParams } from "../types";
import { z } from "zod";

const Input = WorkflowParams.extend({
  venv_python: z.string(),
});

const Output = z.object({
  networkx_installed: z.literal(true),
});

export default step.cli({
  description: "Install networkx into the workflow virtualenv",
  input: Input,
  output: Output,
  command: ({ venv_python }) => [
    "python3",
    "-c",
    "import subprocess, sys; subprocess.run([sys.argv[1], *sys.argv[2:]], check=True)",
    venv_python,
    "-m",
    "pip",
    "install",
    "networkx",
  ],
  parse: () => ({
    networkx_installed: true,
  }),
});
