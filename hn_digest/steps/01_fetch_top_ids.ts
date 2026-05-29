import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({}).passthrough();
const Output = z.object({
  top_story_ids: z.array(z.number()),
});

export default step.cli({
  description: "Fetch Hacker News top story ids",
  input: Input,
  output: Output,
  command: () => [
    "curl",
    "--silent",
    "--show-error",
    "--fail",
    "--max-time",
    "10",
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  ],
  parse: (stdout) => {
    const ids = JSON.parse(stdout) as unknown;
    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "number")) {
      throw new Error("Hacker News topstories response was not a number array");
    }
    return { top_story_ids: ids };
  },
});