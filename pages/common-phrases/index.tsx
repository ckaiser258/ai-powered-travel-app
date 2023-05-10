import { Input } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  location: string;
}

// Since the Google Maps API key needs to be exposed on the client side,
// we need to use NEXT_PUBLIC_ prefix to make sure it's exposed.
// Therefore it's important to limit its domain usage on the Google Cloud Console side of things.
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const CommonPhrasesPage: NextPage = () => {
  const {
    handleSubmit,
    setValue,
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
        <Input
          placeholder="Enter Any Location"
          fullWidth
          {...register("location", { required: true })}
          inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
            <ReactGoogleAutocomplete
              apiKey={GOOGLE_MAPS_KEY}
              options={{
                types: ["(regions)"],
              }}
              onPlaceSelected={(selected) =>
                setValue("location", selected.formatted_address)
              }
              {...props}
            />
          )}
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
