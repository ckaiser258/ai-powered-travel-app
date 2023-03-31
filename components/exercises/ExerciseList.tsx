interface ExerciseListProps {
  exercises: any[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <p>{exercise}</p>
          <input type="text" placeholder="Your answer" />
        </li>
      ))}
    </ul>
  );
};

export default ExerciseList;
