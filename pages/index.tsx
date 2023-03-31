import { LanguageSelector } from "@/components/languageTranslations/LanguageSelector";
import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/styles.module.css";

export default function Home() {
  const [textToTranslate, setTextToTranslate] = useState("");
  const [language, setLanguage] = useState("");
  const [result, setResult] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Make sure the previous result is cleared when loading a new one.
    setResult("");
    setLoading(true);
    try {
      const response = await fetch("/api/generateTranslation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: textToTranslate, language }),
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
    <div>
      <Head>
        <title>AI Travel App</title>
      </Head>

      <form onSubmit={onSubmit} className={styles.form}>
        <h3>Translate:</h3>
        <input
          type="text"
          name="textToTranslate"
          placeholder="Enter text to translate"
          value={textToTranslate}
          onChange={(e) => setTextToTranslate(e.target.value)}
          className={styles.input}
        />
        <br />
        <h3>To:</h3>
        <LanguageSelector
          selectedLanguage={language}
          onSelectLanguage={setLanguage}
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
            <p>{textToTranslate}</p> <br />
            <h3>Translation:</h3>
            <p>{result}</p>
          </>
        )}
      </div>
    </div>
  );
}
