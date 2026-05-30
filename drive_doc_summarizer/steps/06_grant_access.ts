import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  document_id: z.string(),
  recipient: z.string(),
  access_role: z.enum(["reader", "commenter", "writer"]).default("reader"),
});

const Output = z.object({
  permission_id: z.string().nullable(),
  granted_role: z.string(),
});

export default step.cli({
  description: "Grant the recipient access to the summary doc",
  input: Input,
  output: Output,
  command: ({ document_id, recipient, access_role = "reader" }) => [
    "gws",
    "drive",
    "permissions",
    "create",
    "--params",
    JSON.stringify({
      fileId: document_id,
      sendNotificationEmail: false,
    }),
    "--json",
    JSON.stringify({
      role: access_role,
      type: "user",
      emailAddress: recipient,
    }),
    "--format",
    "json",
  ],
  parse: (stdout) => {
    const raw = JSON.parse(stdout) as { id?: string; role?: string };
    return {
      permission_id: raw.id ?? null,
      granted_role: raw.role ?? "reader",
    };
  },
});
