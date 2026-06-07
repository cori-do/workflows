import { step } from "@cori-do/sdk";
import {
  BusFactorHotspot,
  HiddenOwner,
  OrphanedSensitiveCode,
  WorkflowParams,
} from "../types";
import { z } from "zod";

const Input = WorkflowParams.extend({
  venv_python: z.string(),
  analysis_ready: z.literal(true),
  orphaned_sensitive_code: z.array(OrphanedSensitiveCode),
  hidden_owners: z.array(HiddenOwner),
});

export default step.cli({
  description: "Query low-bus-factor sensitive hotspots",
  input: Input,
  output: z.object({
    bus_factor_hotspots: z.array(BusFactorHotspot),
  }),
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
    "bus_factor_hotspots",
  ],
  parse: (stdout) => ({
    bus_factor_hotspots: z.array(BusFactorHotspot).parse(JSON.parse(stdout)),
  }),
});
