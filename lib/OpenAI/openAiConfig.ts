import { Configuration } from "openai";

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openAiConfig;
