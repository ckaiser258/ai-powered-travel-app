import ExerciseForm from "./ExerciseForm";

interface ExerciseListProps {
  exercises: any[];
  language: string;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, language }) => {
  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <p>{exercise}</p>
          <ExerciseForm language={language} phrase={exercise} />
        </li>
      ))}
    </ul>
  );
};

export default ExerciseList;
