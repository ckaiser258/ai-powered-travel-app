import { NextPage } from "next";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  location: string;
}

const CommonPhrasesPage: NextPage = () => {
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
      const response = await fetch("/api/commonPhrases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: formData.location }),
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

  function renderBulletPoints() {
    if (!result) {
      return null;
    }

    const bulletPoints = result.split("\n");
    return (
      <ul>
        {bulletPoints.map((bulletPoint, index) =>
          bulletPoint ? <li key={index}>{bulletPoint}</li> : <br key={index} />
        )}
      </ul>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Phrases to know:</h3>
        <input
          {...register("location", { required: true })}
          type="text"
          placeholder="Enter location"
        />
        {errors.location && (
          <span style={{ color: "red" }}>Please enter location.</span>
        )}
        <br />
        <br />
        <input type="submit" value="Generate Common Phrases" />
      </form>
      <br />
      {loading && <div>Loading...</div>}
      {renderBulletPoints()}
    </div>
  );
};

export default CommonPhrasesPage;
