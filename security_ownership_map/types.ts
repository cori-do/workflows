import { z } from "zod";

export const WorkflowParams = z.object({
  repo_path: z.string(),
  out_dir: z.string(),
  venv_dir: z.string(),
  ownership_skill_root: z.string(),
  since: z.string().optional(),
});
export type WorkflowParams = z.infer<typeof WorkflowParams>;

export const RuntimeState = WorkflowParams.extend({
  venv_python: z.string(),
});
export type RuntimeState = z.infer<typeof RuntimeState>;

export const OrphanedSensitiveCode = z
  .object({
    path: z.string(),
    last_security_touch: z.string().optional(),
    bus_factor: z.number().optional(),
  })
  .passthrough();
export type OrphanedSensitiveCode = z.infer<typeof OrphanedSensitiveCode>;

export const HiddenOwner = z
  .object({
    person: z.string(),
    name: z.string().optional(),
    controls: z.string().optional(),
    category: z.string().optional(),
    share: z.number().optional(),
  })
  .passthrough();
export type HiddenOwner = z.infer<typeof HiddenOwner>;

export const BusFactorHotspot = z
  .object({
    path: z.string(),
    bus_factor: z.number(),
    last_touch: z.string().optional(),
    sensitivity_tags: z.array(z.string()).optional(),
    top_owner: z.string().optional(),
  })
  .passthrough();
export type BusFactorHotspot = z.infer<typeof BusFactorHotspot>;

export const OwnershipAnalysis = RuntimeState.extend({
  orphaned_sensitive_code: z.array(OrphanedSensitiveCode),
  hidden_owners: z.array(HiddenOwner),
  bus_factor_hotspots: z.array(BusFactorHotspot),
});
export type OwnershipAnalysis = z.infer<typeof OwnershipAnalysis>;
