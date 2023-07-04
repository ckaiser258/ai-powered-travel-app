import { Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  InputBaseComponentProps,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  location: string;
}

// Since the Google Maps API key needs to be exposed on the client side,
// we need to use NEXT_PUBLIC_ prefix to make sure it's exposed.
// Therefore it's important to limit its domain usage on the Google Cloud Console side of things.
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// This seems to be required to prevent a bug after a form error occurs.
const GoogleAutocompleteComponent: React.FC<InputBaseComponentProps> = ({
  setValue,
  inputRef,
  onFocus,
  onBlur,
  ...props
}) => (
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
);

const CommonPhrasesPage: NextPage = () => {
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormValues>();
  const [result, setResult] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const stopConversationRef = useRef(false);
  const bottomOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleStopConversation = () => {
    stopConversationRef.current = true;
    setTimeout(() => {
      stopConversationRef.current = false;
    }, 1000);
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const { location } = formData;
    setResult("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const signal = controller.signal;
      const response = await fetch("/api/commonPhrases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
        signal,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      // Set up a reader to stream the response body, similar to ChatGPT.
      const reader = data.getReader();
      // // Set up a decoder to decode the binary data from the reader into a string.
      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        if (stopConversationRef.current) {
          controller.abort();
          done = true;
          break;
        }
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setResult((prev) => prev + chunkValue);
        bottomOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  };

  const ResultInBulletPoints: React.FC = () => {
    if (!result) {
      return null;
    }

    const bulletPoints = result.split("\n");
    return (
      <Paper
        sx={{
          p: 2,
          my: 4,
          maxWidth: {
            xs: "90%",
            sm: "50%",
          },
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
  };

  return (
    <>
      <Head>
        <title>AI Powered Travel Assistant | Common Phrases Generator</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={4}
          maxWidth={500}
          minWidth={300}
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h3">Common Phrases</Typography>
          <Typography variant="h5">Enter a Location</Typography>
          <TextField
            label="Location"
            variant="standard"
            error={!!errors.location}
            helperText="Enter any location in the world..."
            {...register("location", { required: true })}
            InputProps={{
              inputComponent: GoogleAutocompleteComponent,
            }}
            // Any added custom props for the GoogleAutocompleteComponent
            inputProps={{
              setValue,
            }}
            sx={{
              width: {
                xs: "85%",
                sm: "100%",
              },
            }}
          />
          <LoadingButton
            type="submit"
            endIcon={<Send />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            {/* Wrapping the contents of this loading button in a span prevents a known current bug in MUI:
          https://mui.com/material-ui/react-button/#loading-button */}
            <span>Generate Common Phrases</span>
          </LoadingButton>
          {result && loading && (
            <Button
              disableRipple
              variant="outlined"
              color="secondary"
              onClick={handleStopConversation}
            >
              Stop Generation
            </Button>
          )}
        </Stack>
      </form>
      {result && (
        <>
          <ResultInBulletPoints />
          <div ref={bottomOfMessagesRef} />
        </>
      )}
    </>
  );
};

export default CommonPhrasesPage;
