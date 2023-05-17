import openAiConfig from "@/lib/openAiConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIApi } from "openai";

const openai = new OpenAIApi(openAiConfig);

const generateExercises = async (req: NextApiRequest, res: NextApiResponse) => {
  const difficultyLevel = req.body.difficultyLevel || "beginner";
  const language = req.body.language || "English";

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are ChatGPT, a large language model trained by OpenAI. You are an expert in all languages. Generate a list of 10 ${language} phrases that you would consider ${difficultyLevel} level. Respond using markdown. The user is going to guess what they mean. Do not say anything else.`,
        },
      ],
      temperature: 0.1,
      max_tokens: 100,
    });

    const exercises = completion.data.choices[0].message.content;
    res.status(200).json({ exercises });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
};

export default generateExercises;
