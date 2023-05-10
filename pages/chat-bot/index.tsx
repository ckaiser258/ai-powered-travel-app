import { NextPage } from "next";
import { useState } from "react";
import styles from "@/styles/styles.module.css";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  prompt: string;
}

const ChatBotPage: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();
  const [result, setResult] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    // Make sure the previous result is cleared when loading a new one.
    setResult("");
    setLoading(true);
    try {
      const response = await fetch("/api/chatBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: formData.prompt }),
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
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h3 className={styles.title}>
          Ask Our AI Travel Chat Bot Any Travel Question
        </h3>
        <textarea
          {...register("prompt", { required: true })}
          rows={5}
          cols={50}
          placeholder="Enter question"
          className={styles.textarea}
        />
        {errors.prompt && (
          <span style={{ color: "red" }}>Please enter a question.</span>
        )}
        <br />
        <br />
        <Button variant="contained" type="submit" sx={{ marginBottom: 2 }}>
          Ask Chat Bot
        </Button>
      </form>
      <br />
      {loading && <div className={styles.loading}>Loading...</div>}
      {result && (
        <div className={styles.result}>
          <h4>Answer:</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBotPage;
