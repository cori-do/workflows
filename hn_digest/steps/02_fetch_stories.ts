import { step } from "@cori/sdk";
import { z } from "zod";

const Input = z.object({
  story_count: z.number(),
  top_story_ids: z.array(z.number()),
});

const Story = z.object({
  id: z.number(),
  title: z.string(),
  by: z.string().optional(),
  score: z.number().optional(),
  descendants: z.number().optional(),
  url: z.string().optional(),
  time: z.number().optional(),
});

const Output = z.object({
  stories: z.array(Story),
});

export default step.cli({
  description: "Fetch Hacker News story details",
  input: Input,
  output: Output,
  command: ({ story_count, top_story_ids }) => {
    const ids = top_story_ids.slice(0, Math.max(1, Math.floor(story_count)));
    return [
      "curl",
      "--silent",
      "--show-error",
      "--fail",
      "--max-time",
      "20",
      "--write-out",
      "\n",
      ...ids.map((id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`),
    ];
  },
  parse: (stdout) => {
    const stories = stdout
      .trim()
      .split(/\n+/)
      .filter(Boolean)
      .map((line) => Story.parse(JSON.parse(line)))
      .filter((story) => story.title.length > 0);

    return { stories };
  },
});