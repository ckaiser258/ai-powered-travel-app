import { LanguageSelector } from "@/components/languageTranslations/LanguageSelector";
import { useState } from "react";
import styles from "@/styles/styles.module.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

interface FormValues {
  textToTranslate: string;
  language: { label: string; value: string };
}
const TranslateForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    getValues,
  } = useForm();

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
          language: formData.language.value,
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
        <Input
          {...register("textToTranslate", { required: true })}
          placeholder="Enter text to translate"
        />
        {errors.textToTranslate && (
          <span style={{ color: "red" }}>This field is required</span>
        )}
        <br />
        <h3>To:</h3>
        <Controller
          name="language"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <LanguageSelector {...field} />}
        />
        {errors.language && (
          <span style={{ color: "red" }}>This field is required</span>
        )}
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
