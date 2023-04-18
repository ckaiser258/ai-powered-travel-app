import checkAnswer from "@/db/exercise/queries/checkAnswer";
import { useState } from "react";

interface ExerciseFormProps {
  language: string;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ language }) => {
  const [textToTranslate, setTextToTranslate] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        checkAnswer(textToTranslate, language);
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
  );
};

export default ExerciseForm;
