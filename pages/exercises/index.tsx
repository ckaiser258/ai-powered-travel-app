import RHFAutocompleteField from "@/components/RHFAutocompleteField";
import ExerciseList from "@/components/exercises/ExerciseList";
import getExercises from "@/db/exercise/queries/getExercises";
import { ExerciseLevel } from "@/lib/types";
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
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { gql, useMutation, useQuery } from "@apollo/client";
import { signIn, useSession } from "next-auth/react";
import { Query } from "@/generated/graphql";
import ISO6391 from "iso-639-1";
import { useRouter } from "next/router";

const GET_LANGUAGES_TO_LEARN_QUERY = gql`
  query getLanguagesToLearn($userId: ID!) {
    getLanguagesToLearn(userId: $userId)
  }
`;

const CREATE_DEMO_LANGUAGES_TO_LEARN_MUTATION = gql`
  mutation createDemoLanguagesToLearn($userId: ID!, $languages: [String]!) {
    createLanguagesToLearn(userId: $userId, languages: $languages)
  }
`;

interface FormValues {
  difficultyLevel: ExerciseLevel;
  language: string;
}

const difficulties: ExerciseLevel[] = ["beginner", "intermediate", "advanced"];

const demoLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Japanese",
  "Chinese",
];

const ExercisesPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const {
    data,
    loading: loadingLanguages,
    refetch,
  } = useQuery<Query>(GET_LANGUAGES_TO_LEARN_QUERY, {
    variables: {
      userId: session?.userId,
    },
  });
  const [createDemoLanguagesToLearn] = useMutation(
    CREATE_DEMO_LANGUAGES_TO_LEARN_MUTATION
  );

  const languagesToLearnOptions = data?.getLanguagesToLearn?.map(
    (language) => ({
      label: language,
      value: ISO6391.getCode(language),
    })
  );

  useEffect(() => {
    const createDemoLanguagesIfNewUser = async () => {
      if (status === "authenticated" && session?.isNewUser) {
        await createDemoLanguagesToLearn({
          variables: {
            userId: session.userId,
            languages: demoLanguages,
          },
        });

        // Need to make sure isNewUser is now false, otherwise the call above will run any time the user refreshes the page
        await update();

        // Refetch the languagesToLearn so that the demo languages show up
        await refetch();
      }
    };

    createDemoLanguagesIfNewUser();
  }, [status, session, update, createDemoLanguagesToLearn, refetch]);

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
      <Typography variant="h3" mb={3} textAlign="center">
        Language Exercises
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="center"
          mb={(exercises.length || loading) && 4}
          mt={2}
        >
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <RHFAutocompleteField
              control={control}
              name="language"
              options={languagesToLearnOptions || []}
              label="Select a Language"
              requiredMessage="Please select a language"
              loading={loadingLanguages}
            />
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <Controller
              name="difficultyLevel"
              control={control}
              rules={{ required: "Please select a difficulty level." }}
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
                      {errors.difficultyLevel.message}
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
          minHeight={{
            xs: "35vh",
            sm: "50vh",
          }}
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
