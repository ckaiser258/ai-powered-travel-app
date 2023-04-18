const checkAnswer = async (input: string, language: string) => {
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
    console.log(data.response);
    return data.response;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

export default checkAnswer;
