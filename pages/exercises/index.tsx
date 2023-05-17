import RHFAutocompleteField from "@/components/RHFAutocompleteField";
import ExerciseList from "@/components/exercises/ExerciseList";
import getExercises from "@/db/exercise/queries/getExercises";
import { ExerciseLevel } from "@/generated/graphql";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Button,
  Box,
} from "@mui/material";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface FormValues {
  difficultyLevel: ExerciseLevel;
  language: string;
}

const difficulties: ExerciseLevel[] = [
  ExerciseLevel.Beginner,
  ExerciseLevel.Intermediate,
  ExerciseLevel.Advanced,
];

// TODO: Replace these with the user's saved languages
const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Chinese", value: "zh" },
];

const ExercisesPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const { data: session } = useSession();
  const {
    handleSubmit,
    control,
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
      <Head>
        <title>AI Powered Travel Assistant | Language Learning Exercises</title>
      </Head>
      <Typography variant="h3" mb={3}>
        Language Exercises
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="center"
          mb={2}
        >
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <RHFAutocompleteField
              control={control}
              name="language"
              options={languageOptions}
              label="Select a Language"
              requiredMessage="Please select a language"
            />
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <Controller
              name="difficultyLevel"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl
                  sx={{ width: 300 }}
                  error={!!errors.difficultyLevel}
                >
                  <InputLabel id="difficulty-level-label">
                    Difficulty Level
                  </InputLabel>
                  <Select
                    {...field}
                    error={!!errors.difficultyLevel}
                    label="Difficulty Level"
                    labelId="difficulty-level-label"
                    value={field.value ? field.value : ""}
                  >
                    {difficulties.map((difficulty, i) => (
                      <MenuItem key={i} value={difficulty}>
                        {difficulty}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.difficultyLevel && (
                    <FormHelperText>
                      Please select a difficulty level.
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button type="submit" variant="contained">
              Generate Exercises
            </Button>
          </Grid>
        </Grid>
      </form>
      {!exercises.length && !loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Typography variant="h5" textAlign="center">
            No exercises to display. Please select a language and difficulty
            level and click &quot;Generate Exercises&quot;.
          </Typography>
        </Box>
      )}
      <ExerciseList
        loading={loading}
        exercises={exercises}
        language={getValues("language")}
      />
    </>
  );
};

export default ExercisesPage;
