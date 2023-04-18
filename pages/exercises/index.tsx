import ExerciseList from "@/components/exercises/ExerciseList";
import { ExerciseLevel } from "@/generated/graphql";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const difficulties: ExerciseLevel[] = [
  ExerciseLevel.Beginner,
  ExerciseLevel.Intermediate,
  ExerciseLevel.Advanced,
];

const ExercisesPage: NextPage = () => {
  const [difficultyLevel, setDifficultyLevel] = useState(difficulties[0]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [exercises, setExercises] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
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
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }
        // OpenAI returns a string that is a numbered list of exercises separated by newlines.
        // This code splits the string into an array of exercises and removes the numbers.
        const lines = data.exercises.split("\n");
        const formattedExercises = lines.map((line) =>
          line.replace(/^\d+\. /, "")
        );
        setExercises(formattedExercises);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
      setLoading(false);
    };
    fetchExercises();
  }, [difficultyLevel, language]);

  const checkAnswer = async (
    language: string,
    input: string,
    phrase: string
  ) => {
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
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      return data.response;
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <h1>Exercises</h1>
      {loading && <p>Loading...</p>}
      <form>
        <label htmlFor="language">Language</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {/* Replace these with the user's saved languages */}
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
        </select>
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficultyLevel"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value as ExerciseLevel)}
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </form>
      <ExerciseList
        exercises={exercises || []}
        checkAnswer={checkAnswer}
        language={language}
      />
    </>
  );
};

export default ExercisesPage;
