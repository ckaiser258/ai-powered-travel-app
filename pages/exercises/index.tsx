import ExerciseList from "@/components/exercises/ExerciseList";
import getExercises from "@/db/exercise/queries/getExercises";
import { ExerciseLevel, Query } from "@/generated/graphql";
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
  const [language, setLanguage] = useState("en");
  const [exercises, setExercises] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    getExercises(difficultyLevel, language).then((data) => {
      setExercises(data);
      setLoading(false);
    });
  }, [difficultyLevel, language]);

  return (
    <>
      <h1>Exercises</h1>
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ExerciseList exercises={exercises || []} language={language} />
      )}
    </>
  );
};

export default ExercisesPage;
