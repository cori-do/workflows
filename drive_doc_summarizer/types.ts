import { z } from "zod";

export const ActionItem = z.object({
  owner: z.string().nullable(),
  task: z.string(),
  due_date: z.string().nullable(),
});
export type ActionItem = z.infer<typeof ActionItem>;

export const DocumentSummary = z.object({
  summary_title: z.string(),
  summary: z.string(),
  key_points: z.array(z.string()),
  action_items: z.array(ActionItem),
  risks: z.array(z.string()),
});
export type DocumentSummary = z.infer<typeof DocumentSummary>;