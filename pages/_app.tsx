import "@/styles/global.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import Layout from "@/components/Layout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "@/lib/theme";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
