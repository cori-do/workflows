import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  recipient: z.string(),
  from_email: z.string().optional(),
  doc_title: z.string(),
  document_url: z.string().default("https://docs.google.com/document/d/dry-run/edit"),
  summary: z.string().default("Summary unavailable in Cori dry-run mode."),
});

const Output = z.object({
  raw_message: z.string(),
});

const encodeBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export default step.code({
  description: "Build the summary notification email",
  input: Input,
  output: Output,
  run: ({
    recipient,
    from_email,
    doc_title,
    document_url = "https://docs.google.com/document/d/dry-run/edit",
    summary = "Summary unavailable in Cori dry-run mode.",
  }) => {
    const body = [
      `A new summary document is ready: ${doc_title}`,
      "",
      document_url,
      "",
      "Preview:",
      summary,
    ].join("\n");
    const headers = [
      ...(from_email?.trim() ? [`From: ${from_email.trim()}`] : []),
      `To: ${recipient}`,
      `Subject: ${doc_title}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
    ];
    return { raw_message: encodeBase64Url(`${headers.join("\r\n")}\r\n\r\n${body}`) };
  },
});