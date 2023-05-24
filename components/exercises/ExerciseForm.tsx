import checkAnswer from "@/db/exercise/queries/checkAnswer";
import { Button, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface ExerciseFormProps {
  language: string;
  phrase: string;
}

interface FormValues {
  textToTranslate: string;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ language, phrase }) => {
  const {
    handleSubmit,
    control,
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
      <Stack spacing={1} direction="row">
        <Controller
          name="textToTranslate"
          control={control}
          rules={{ required: "Please enter your answer" }}
          render={({ field }) => (
            <TextField
              autoComplete="off"
              error={!!errors.textToTranslate}
              helperText={errors.textToTranslate?.message}
              size="small"
              label="Enter your answer"
              {...field}
            />
          )}
        />
        <Button
          type="submit"
          variant="outlined"
          size="small"
          color="secondary"
          disableRipple
        >
          Check
        </Button>
      </Stack>
    </form>
  ) : (
    <p>{isCorrectAnswer ? "Correct!" : "Incorrect!"}</p>
  );
};

export default ExerciseForm;
