import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
          <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  );
}
