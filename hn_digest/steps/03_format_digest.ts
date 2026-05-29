import { step } from "@cori/sdk";
import { z } from "zod";

const Story = z.object({
  id: z.number(),
  title: z.string(),
  by: z.string().optional(),
  score: z.number().optional(),
  descendants: z.number().optional(),
  url: z.string().optional(),
  time: z.number().optional(),
});

const Input = z.object({
  stories: z.array(Story),
});

const Output = z.object({
  digest: z.string(),
  story_count: z.number(),
});

export default step.code({
  description: "Format the Hacker News digest",
  input: Input,
  output: Output,
  run: ({ stories }) => {
    const lines = ["# Hacker News Digest", ""];

    stories.forEach((story, index) => {
      const storyUrl = story.url ?? `https://news.ycombinator.com/item?id=${story.id}`;
      const commentsUrl = `https://news.ycombinator.com/item?id=${story.id}`;
      const score = story.score ?? 0;
      const comments = story.descendants ?? 0;
      const author = story.by ? ` by ${story.by}` : "";

      lines.push(`${index + 1}. [${story.title}](${storyUrl})`);
      lines.push(`   ${score} points, ${comments} comments${author}`);
      lines.push(`   Comments: ${commentsUrl}`);
      lines.push("");
    });

    return {
      digest: lines.join("\n").trim(),
      story_count: stories.length,
    };
  },
});