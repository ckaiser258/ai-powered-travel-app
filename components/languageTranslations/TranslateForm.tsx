import { useState } from "react";
import styles from "@/styles/styles.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField } from "@mui/material";
import ISO6391 from "iso-639-1";
import RHFAutocompleteField from "../RHFAutocompleteField";

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
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h3>Translate:</h3>
        <TextField
          {...register("textToTranslate", { required: true })}
          label="Enter text to translate"
        />
        {errors.textToTranslate && (
          <span style={{ color: "red" }}>This field is required</span>
        )}
        <br />
        <h3>To:</h3>
        <RHFAutocompleteField
          control={control}
          name="language"
          options={options}
          label="Select a Language"
          requiredMessage="Please select a language"
        />
        <br />
        <br />
        <input
          type="submit"
          value="Generate translation"
          className={styles.button}
        />
      </form>
      <br />
      <div className={loading || result ? styles.result : undefined}>
        {loading && <div>Loading...</div>}
        {result && (
          <>
            <h3>Original:</h3>
            <p>{getValues("textToTranslate")}</p>
            <h3>Translation:</h3>
            <p>{result}</p>
          </>
        )}
      </div>
    </>
  );
};

export default TranslateForm;
