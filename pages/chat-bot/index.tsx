import { NextPage } from "next";
import { useRef, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";

interface FormValues {
  prompt: string;
}

const ChatBotPage: NextPage = () => {
  const {
    handleSubmit,
    control,
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
    const { prompt } = formData;
    setResult("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const response = await fetch("/api/chatBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
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

  return (
    <>
      <Head>
        <title>AI Powered Travel Assistant | Chat Bot</title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" textAlign="center">
            Ask Our AI Travel Chat Bot Any Travel Question
          </Typography>
          <Controller
            name="prompt"
            control={control}
            rules={{ required: "Please enter a question" }}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  width: "90%",
                }}
                multiline
                rows={5}
                label="Enter question"
                error={!!errors.prompt}
                helperText={errors.prompt?.message}
              />
            )}
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
            <span>Ask Chat Bot</span>
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
            <Typography variant="body1">{result}</Typography>
          </Paper>
          <div ref={bottomOfMessagesRef} />
        </>
      )}
    </>
  );
};

export default ChatBotPage;
