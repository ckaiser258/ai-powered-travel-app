import TranslateForm from "@/components/languageTranslations/TranslateForm";
import { Box, Typography } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Travel Assistant</title>
      </Head>
      <Typography variant="h2" align="center" my={2}>
        AI Powered Travel Assistant
      </Typography>
      <TranslateForm />
    </>
  );
}
