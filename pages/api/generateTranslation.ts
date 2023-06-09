import openAiConfig from "@/lib/OpenAI/openAiConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIApi } from "openai";

const openai = new OpenAIApi(openAiConfig);

interface Data {
  result?: string;
  error?: {
    message: string;
  };
}

/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!openAiConfig.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  const language = req.body.language || "English";
  const input = req.body.input || "";
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }
  if (language.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid language",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. The user is providing the language and the text to translate. Translate the text to the language they provided. Then put the pronunciation in parentheses. Don't write anything else.",
        },
        {
          role: "user",
          content: `${generatePrompt(language, input)}`,
        },
      ],
      temperature: 0.3,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    res
      .status(200)
      .json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(language: string, input: string) {
  return `Translate ${input} to ${language}:`;
}
