import openAiConfig from "@/lib/OpenAI/openAiConfig";
import { OpenAIStream } from "@/lib/OpenAI/openAiStream";

export const config = {
  runtime: "edge",
};

/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default async function POST(req: Request): Promise<Response> {
  if (!openAiConfig.apiKey) {
    return new Response("No OpenAI API key found", { status: 500 });
  }

  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt || !prompt.trim().length) {
    return new Response("No prompt in the request", { status: 400 });
  }

  try {
    const stream = await OpenAIStream({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. You are a travel expert. The user is going to ask you a question about traveling to a location. Answer concisely. If the question is not about travel, let the user know that you can't answer anything not related to travel.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      frequency_penalty: 1.0,
      presence_penalty: 1.0,
    });
    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return new Response(error.response.data, {
        status: error.response.status,
      });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return new Response("An error occurred during your request.", {
        status: 500,
      });
    }
  }
}
