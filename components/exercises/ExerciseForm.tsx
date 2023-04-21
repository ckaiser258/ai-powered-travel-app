import checkAnswer from "@/db/exercise/queries/checkAnswer";
import { useEffect, useState } from "react";

interface ExerciseFormProps {
  language: string;
  phrase: string;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ language, phrase }) => {
  const [textToTranslate, setTextToTranslate] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    if (isCorrectAnswer === false) {
      setTimeout(() => {
        setIsCorrectAnswer(null);
      }, 1500);
    }
  }, [isCorrectAnswer]);

  return isCorrectAnswer === null ? (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await checkAnswer(textToTranslate, language, phrase).then((data) => {
          setIsCorrectAnswer(data);
        });
        setTextToTranslate("");
      }}
    >
      <input
        type="text"
        name="textToTranslate"
        placeholder="Enter your answer"
        value={textToTranslate}
        onChange={(e) => setTextToTranslate(e.target.value)}
      />
      <button type="submit">Check</button>
    </form>
  ) : (
    <p>{isCorrectAnswer ? "Correct!" : "Incorrect!"}</p>
  );
};

export default ExerciseForm;
