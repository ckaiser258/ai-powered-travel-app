import TranslateForm from "@/components/languageTranslations/TranslateForm";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI Travel App</title>
      </Head>

      <TranslateForm />
    </div>
  );
}
