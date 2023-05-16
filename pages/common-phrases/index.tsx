import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
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

const SkeletonList = () => {
  const skeletonArray: JSX.Element[] = [];
  for (let i = 0; i < 10; i++) {
    skeletonArray.push(
      <Box
        my={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        key={i}
      >
        <Skeleton
          variant="circular"
          width={20}
          height={20}
          animation="wave"
          sx={{ mr: 1 }}
        />
        <Skeleton width={500} animation="wave" />
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        mt: 5,
        bgcolor: "primary.light",
      }}
    >
      <List dense>
        {skeletonArray.map((skeleton, index) => (
          <ListItem key={index}>
            <ListItemText primary={skeleton} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

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
      <Paper
        sx={{
          mt: 5,
          bgcolor: "primary.light",
        }}
      >
        <List>
          {bulletPoints.map((bulletPoint, index) =>
            bulletPoint ? (
              <ListItem
                sx={{
                  textAlign: "center",
                }}
                key={index}
              >
                <ListItemText primary={bulletPoint} />
              </ListItem>
            ) : null
          )}
        </List>
      </Paper>
    );
  }

  return (
    <>
      <Head>
        <title>AI Powered Travel Assistant | Common Phrases Generator</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} maxWidth={500} minWidth={300} alignItems="center">
          <Typography variant="h3">Common Phrases</Typography>
          <Typography variant="h5">Enter a Location</Typography>
          <TextField
            label="Location"
            fullWidth
            variant="standard"
            error={!!errors.location}
            helperText="Enter any location in the world..."
            {...register("location", { required: true })}
            InputProps={{
              inputComponent: ({ inputRef, onFocus, onBlur, ...props }) => (
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
              ),
            }}
          />
          <Button type="submit" variant="contained">
            Generate Common Phrases
          </Button>
        </Stack>
      </form>
      {loading && <SkeletonList />}
      {renderBulletPoints()}
    </>
  );
};

export default CommonPhrasesPage;
