import { step } from "@cori-do/sdk";
import { z } from "zod";

const Input = z.object({
  recipient: z.string(),
  from_email: z.string().optional(),
  subject: z.string(),
  brief_text: z.string(),
  event_count: z.number(),
});

const Output = z.object({
  raw_message: z.string(),
  event_count: z.number(),
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
  description: "Build the Gmail RFC822 message",
  input: Input,
  output: Output,
  run: ({ recipient, from_email, subject, brief_text, event_count }) => {
    const headers = [
      ...(from_email?.trim() ? [`From: ${from_email.trim()}`] : []),
      `To: ${recipient}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
    ];
    const message = `${headers.join("\r\n")}\r\n\r\n${brief_text}`;
    return {
      raw_message: encodeBase64Url(message),
      event_count,
    };
  },
});