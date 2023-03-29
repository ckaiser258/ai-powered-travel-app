import openAiConfig from "@/lib/openAiConfig";
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

  const prompt = req.body.prompt;
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
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
            "You are ChatGPT, a large language model trained by OpenAI. You are a travel expert. The user is going to ask you a question about traveling to a location. Answer the question as concisely as possible. If the question is not about travel, let the user know that you can't answer anything not related to travel.",
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
