import { useState } from "react";
import styles from "@/styles/styles.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import ISO6391 from "iso-639-1";
import RHFAutocompleteField from "../RHFAutocompleteField";
import TranslationResult from "./TranslationResult";

interface FormValues {
  textToTranslate: string;
  language: string;
}

const options = ISO6391.getAllNames().map((language) => ({
  label: language,
  value: language,
}));

const TranslateForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generateTranslation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: formData.textToTranslate,
          language: formData.language,
        }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="center" mb={8}>
          <Typography variant="h3" textAlign="center">
            Translation Generator
          </Typography>
          <Typography variant="h6">Translate:</Typography>
          <TextField
            {...register("textToTranslate", { required: true })}
            label="Enter text to translate"
            multiline
            rows={4}
            fullWidth
            error={!!errors.textToTranslate}
            helperText={errors.textToTranslate && "This field is required"}
          />
          <Typography variant="h6">To:</Typography>
          <RHFAutocompleteField
            control={control}
            name="language"
            options={options}
            label="Select a Language"
            requiredMessage="Please select a language"
            freeSolo
          />
          <Button type="submit" variant="contained">
            Generate Translation
          </Button>
        </Stack>
      </form>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: {
            xs: 6,
            sm: 0,
          },
        }}
      >
        <TranslationResult
          loading={loading}
          result={result}
          textToTranslate={getValues("textToTranslate")}
        />
      </Paper>
    </>
  );
};

export default TranslateForm;
