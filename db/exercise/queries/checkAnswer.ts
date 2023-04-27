import levenshtein from "fast-levenshtein";

const checkAnswer = async (input: string, language: string, phrase: string) => {
  try {
    const response = await fetch("api/googleTranslate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: input, targetLanguage: language }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }

    // Calculate Levenshtein distance
    const distance = levenshtein.get(data.response, phrase);

    // Determine the similarity threshold (20% of the length of the longer string)
    const similarityThreshold =
      Math.max(data.response.length, phrase.length) * 0.2;

    // If the distance is within the threshold, then the user's translation is close enough to the generated phrase.
    return distance <= similarityThreshold;

    // If it's found that the punctuation differences between the ChatGPT API generated phrases and the Google Translate API generated phrases
    // are consistently causing issues in the similarity calculation, then the following code can be used instead of, or in addition to, the above code
    // to strip the punctuation from the ChatGPT API generated phrase and the Google Translate API generated phrase
    // before comparing them.

    // const strippedResponse = data.response.replace(/[^\p{L}\p{N}\s]+/gu, "");
    // const strippedPhrase = phrase.replace(/[^\p{L}\p{N}\s]+/gu, "");

    // const distance = levenshtein.get(strippedResponse, strippedPhrase);
    // const similarityThreshold =
    //   Math.max(strippedResponse.length, strippedPhrase.length) * 0.2;
    // return distance <= similarityThreshold;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

export default checkAnswer;
