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
import ISO6391 from "iso-639-1";
import React, { useState } from "react";
import { Query } from "@/generated/graphql";
import { LoadingButton } from "@mui/lab";

interface AddLanguagesToLearnFormProps {
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

const CREATE_LANGUAGES_TO_LEARN_MUTATION = gql`
  mutation createLanguagesToLearn($userId: ID!, $languages: [String]!) {
    createLanguagesToLearn(userId: $userId, languages: $languages)
  }
`;

const options = ISO6391.getAllNames().map((language) => ({
  label: language,
  value: language,
}));

const AddLanguagesToLearnForm: React.FC<AddLanguagesToLearnFormProps> = ({
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

  const [createLanguagesToLearn] = useMutation(
    CREATE_LANGUAGES_TO_LEARN_MUTATION
  );

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await createLanguagesToLearn({
        variables: {
          userId: session?.userId,
          languages: data.languages.map((language) => language.value),
        },
      });
      router.push("/exercises");
      setSuccessMessage("Successfully Added Languages To Learn!");
      setSuccessSnackbarOpen(true);
      await refetch();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setErrorSnackbarOpen(true);
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="languages"
            control={control}
            rules={{
              required: "Please add at least one language to learn.",
            }}
            render={({ field, fieldState: { error } }) => {
              const { onChange, value, ref } = field;
              return (
                <Autocomplete
                  {...field}
                  multiple
                  limitTags={3}
                  options={options}
                  disableCloseOnSelect
                  freeSolo
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
                      label="Add Languages To Learn"
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
              setShowRemoveLanguagesForm(true);
            }}
            color="secondary"
            sx={{ mr: 1, mt: { xs: 2, sm: 0 } }}
          >
            Remove Languages
          </Button>
          <LoadingButton type="submit" loading={loading} variant="contained">
            {/* Wrapping the contents of this loading button in a span prevents a known current bug in MUI:
  https://mui.com/material-ui/react-button/#loading-button */}
            <span> Add Languages</span>
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
    </>
  );
};

export default AddLanguagesToLearnForm;
