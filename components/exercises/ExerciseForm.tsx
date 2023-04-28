import checkAnswer from "@/db/exercise/queries/checkAnswer";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ExerciseFormProps {
  language: string;
  phrase: string;
}

interface FormValues {
  textToTranslate: string;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ language, phrase }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await checkAnswer(data.textToTranslate, language, phrase).then((data) => {
      setIsCorrectAnswer(data);
    });
  };

  useEffect(() => {
    // If the user has answered the question but is incorrect,
    // show the field again after 1.5 seconds.
    if (isCorrectAnswer === false) {
      setTimeout(() => {
        setIsCorrectAnswer(null);
      }, 1500);
    }
  }, [isCorrectAnswer]);

  return isCorrectAnswer === null ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("textToTranslate", { required: true })}
        placeholder="Enter your answer"
      />
      {errors.textToTranslate && (
        <span style={{ color: "red" }}>This field is required</span>
      )}
      <input type="submit" value="Check" />
    </form>
  ) : (
    <p>{isCorrectAnswer ? "Correct!" : "Incorrect!"}</p>
  );
};

export default ExerciseForm;
