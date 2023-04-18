import googleTranslateCredentials from "@/lib/googleTranslateCredentials";
import { DetectResult, Translate } from "@google-cloud/translate/build/src/v2";
import { NextApiRequest, NextApiResponse } from "next";

const CREDENTIALS = googleTranslateCredentials;

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

interface DetectLanguageData {
  DetectResult?: [DetectResult, any];
  error?: {
    message: string;
  };
}

interface TranslateTextData {
  response?: string;
  error?: {
    message: string;
  };
}

const detectLanguage = async (
  req: NextApiRequest,
  res: NextApiResponse<DetectLanguageData>
) => {
  if (!CREDENTIALS.private_key) {
    res.status(500).json({
      error: {
        message: "Google Translate API key not configured",
      },
    });
    return;
  }

  const text = req.body.text || "";

  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }

  try {
    const response = await translate.detect(text);
    return response[0].language;
  } catch (error) {
    console.log(error);
  }
};

const translateText = async (
  req: NextApiRequest,
  res: NextApiResponse<TranslateTextData>
) => {
  if (!CREDENTIALS.private_key) {
    res.status(500).json({
      error: {
        message: "Google Translate API key not configured",
      },
    });
    return;
  }

  const text = req.body.text || "";
  const targetLanguage = req.body.targetLanguage || "";

  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }

  if (targetLanguage.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid target language",
      },
    });
    return;
  }

  try {
    const [response] = await translate.translate(text, targetLanguage);
    res.status(200).json({ response });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: { message: "An error occurred during your request." } });
  }
};

export default translateText;
