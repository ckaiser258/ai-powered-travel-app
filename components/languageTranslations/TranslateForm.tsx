import { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Typography, Button, Paper, Stack } from "@mui/material";
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
  const resultRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="center" mb={8}>
          <Typography variant="h3" textAlign="center">
            Translation Generator
          </Typography>
          <Typography variant="h6">Translate:</Typography>
          <TextField
            {...register("textToTranslate", {
              required: "Please enter text to translate",
            })}
            label="Enter text to translate"
            multiline
            rows={4}
            fullWidth
            error={!!errors.textToTranslate}
            helperText={errors.textToTranslate?.message}
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
      {(result || loading) && (
        <>
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
          <div ref={resultRef} />
        </>
      )}
    </>
  );
};

export default TranslateForm;
