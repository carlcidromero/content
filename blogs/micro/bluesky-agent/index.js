import { AtpAgent } from "@atproto/api";
import "dotenv/config";

const agent = new AtpAgent({
  service: "https://bsky.social",
});

await agent.login({
  identifier: process.env.IDENTIFIER,
  password: process.env.PASSWORD,
});

await agent.post({
  text: "Hello world! I posted this via the API.",
  createdAt: new Date().toISOString(),
});
