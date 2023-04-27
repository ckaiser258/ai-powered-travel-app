import ExerciseList from "@/components/exercises/ExerciseList";
import getExercises from "@/db/exercise/queries/getExercises";
import { ExerciseLevel } from "@/generated/graphql";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  difficultyLevel: ExerciseLevel;
  language: string;
}

const difficulties: ExerciseLevel[] = [
  ExerciseLevel.Beginner,
  ExerciseLevel.Intermediate,
  ExerciseLevel.Advanced,
];

const ExercisesPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setLoading(true);
    getExercises(formData.difficultyLevel, formData.language).then((data) => {
      setExercises(data);
      setLoading(false);
    });
  };

  return (
    <>
      <h1>Exercises</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="language">Language:</label>
        <select
          {...register("language", { required: true })}
          id="language"
          defaultValue=""
        >
          <option value="" disabled>
            Select a language
          </option>
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
        {errors.language && (
          <span style={{ color: "red" }}>Please select a language.</span>
        )}

        <label htmlFor="difficulty">Difficulty:</label>
        <select
          {...register("difficultyLevel", { required: true })}
          id="difficultyLevel"
          defaultValue=""
        >
          <option value="" disabled>
            Select a difficulty
          </option>
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
        {errors.difficultyLevel && (
          <span style={{ color: "red" }}>Please select a language.</span>
        )}

        <input type="submit" value="Generate Exercises" />
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ExerciseList
          exercises={exercises || []}
          language={getValues("language")}
        />
      )}
    </>
  );
};

export default ExercisesPage;
