import { readFileSync } from "node:fs";
import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  source_file_id: z.string(),
});

const Output = z.object({
  source_text: z.string(),
  source_char_count: z.number(),
});

export default step.cli({
  description: "Export the Drive source as text",
  input: Input,
  output: Output,
  command: ({ source_file_id }) => [
    "gws",
    "drive",
    "files",
    "export",
    "--params",
    JSON.stringify({
      fileId: source_file_id,
      mimeType: "text/plain",
    }),
    "--output",
    ".cori-drive-doc-summarizer-source.txt",
  ],
  parse: (stdout) => {
    const metadata = JSON.parse(stdout) as { saved_file?: string };
    if (!metadata.saved_file) {
      throw new Error("Drive export response did not include saved_file");
    }
    const source_text = readFileSync(metadata.saved_file, "utf8").trim();
    return {
      source_text,
      source_char_count: source_text.length,
    };
  },
});