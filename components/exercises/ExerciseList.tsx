import ExerciseForm from "./ExerciseForm";

interface ExerciseListProps {
  exercises: any[];
  language: string;
  checkAnswer: (input: string, language: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  language,
  checkAnswer,
}) => {
  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <p>{exercise}</p>
          <ExerciseForm checkAnswer={checkAnswer} language={language} />
        </li>
      ))}
    </ul>
  );
};

export default ExerciseList;
