import { NextPage } from "next";
import { useState } from "react";
import styles from "@/styles/styles.module.css";

const ChatBotPage: NextPage = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Make sure the previous result is cleared when loading a new one.
    setResult("");
    setLoading(true);
    try {
      const response = await fetch("/api/chatBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
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
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h3 className={styles.title}>
          Ask Our AI Travel Chat Bot Any Travel Question
        </h3>
        <textarea
          name="prompt"
          rows={5}
          cols={50}
          placeholder="Enter question"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={styles.textarea}
        />
        <br />
        <br />
        <input type="submit" value="Ask Chat Bot" className={styles.button} />
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
