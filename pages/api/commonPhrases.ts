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

  const { location } = (await req.json()) as {
    location?: string;
  };

  const { signal } = req;

  if (!location || !location.trim().length) {
    return new Response("No location in the request", { status: 400 });
  }

  try {
    const stream = await OpenAIStream(
      {
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. The user is providing a location and asking for common phrases. Give them 5-10 common phrases, in bullet point format, that they should know in the location they provided. Tell them what they mean, and how to pronounce them.",
          },
          {
            role: "user",
            content: `${generatePrompt(location)}`,
          },
        ],
        temperature: 0.6,
        frequency_penalty: 1.0,
        presence_penalty: 1.0,
      },
      signal
    );
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

function generatePrompt(location: string) {
  return `Give me 5-10 common phrases, in bullet point format, that I should know in ${location}. Tell me what they mean, and how to pronounce them.`;
}
