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
        const response = await fetch("/api/generateExercises", {
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
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Russian">Russian</option>
          <option value="Japanese">Japanese</option>
          <option value="Chinese">Chinese</option>
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
      <ExerciseList exercises={exercises || []} />
    </>
  );
};

export default ExercisesPage;
