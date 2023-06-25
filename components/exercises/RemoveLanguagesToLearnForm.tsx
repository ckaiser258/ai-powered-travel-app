import {
  Button,
  DialogActions,
  DialogContent,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  ApolloQueryResult,
  gql,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Query } from "@/generated/graphql";
import { LoadingButton } from "@mui/lab";

interface RemoveLanguagesToLearnFormProps {
  currentLanguagesToLearn: string[];
  setShowRemoveLanguagesForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: (
    variables?: Partial<OperationVariables>
  ) => Promise<ApolloQueryResult<Query>>;
}

interface FormValues {
  languages: { label: string; value: string }[];
}

const DELETE_LANGUAGES_TO_LEARN_MUTATION = gql`
  mutation deleteLanguagesToLearn($userId: ID!, $languages: [String]!) {
    deleteLanguagesToLearn(userId: $userId, languages: $languages)
  }
`;

const RemoveLanguagesToLearnForm: React.FC<RemoveLanguagesToLearnFormProps> = ({
  currentLanguagesToLearn,
  setShowRemoveLanguagesForm,
  setSuccessMessage,
  setErrorMessage,
  setSuccessSnackbarOpen,
  setErrorSnackbarOpen,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);

  let router = useRouter();

  const { handleSubmit, control } = useForm<FormValues>();

  const { data: session } = useSession();

  const [deleteLanguagesToLearn] = useMutation(
    DELETE_LANGUAGES_TO_LEARN_MUTATION
  );

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await deleteLanguagesToLearn({
        variables: {
          userId: session?.userId,
          languages: data.languages.map((language) => language.value),
        },
      });
      router.push("/exercises");
      setSuccessMessage("Successfully Removed Languages To Learn!");
      setSuccessSnackbarOpen(true);
      await refetch();
      setShowRemoveLanguagesForm(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setErrorSnackbarOpen(true);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Controller
          name="languages"
          control={control}
          rules={{
            required: "Please select languages to delete.",
          }}
          render={({ field, fieldState: { error } }) => {
            const { onChange, value, ref } = field;
            return (
              <Autocomplete
                {...field}
                multiple
                limitTags={3}
                options={currentLanguagesToLearn.map((language) => ({
                  label: language,
                  value: language,
                }))}
                // https://stackoverflow.com/questions/61947941/material-ui-autocomplete-warning-the-value-provided-to-autocomplete-is-invalid
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                disableCloseOnSelect
                value={value}
                onChange={(event, newValue) => {
                  // Type guard to make Typescript happy
                  if (typeof newValue === "string") {
                    onChange([...value, newValue]);
                  } else {
                    onChange(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Remove Languages To Learn"
                    error={!!error}
                    helperText={error?.message}
                    inputRef={ref}
                  />
                )}
              />
            );
          }}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 2, flexWrap: "wrap-reverse" }}>
        <Button
          onClick={() => {
            setShowRemoveLanguagesForm(false);
          }}
          color="secondary"
          sx={{ mr: 1, mt: { xs: 2, sm: 0 } }}
        >
          Add Languages
        </Button>
        <LoadingButton loading={loading} type="submit" variant="contained">
          Remove Languages
        </LoadingButton>
        <Button
          onClick={() => router.push("/exercises")}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
      </DialogActions>
    </form>
  );
};

export default RemoveLanguagesToLearnForm;
