const getExercises = async (difficultyLevel: string, language: string) => {
  try {
    const response = await fetch("/api/exercises/generateExercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficultyLevel, language }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }
    // OpenAI returns a string that is a numbered list of exercises separated by newlines.
    // This code splits the string into an array of exercises and removes the numbers.
    const lines = data.exercises.split("\n");
    const formattedExercises = lines.map((line) => line.replace(/^\d+\. /, ""));
    return formattedExercises;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

export default getExercises;
