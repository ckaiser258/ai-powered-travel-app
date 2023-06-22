import { MutationResolvers } from "@/generated/graphql";
import createLanguageToLearn from "@/db/languageToLearn/mutations/createLanuageToLearn";
import createLanguagesToLearn from "@/db/languageToLearn/mutations/createLanguagesToLearn";
import deleteLanguageToLearn from "@/db/languageToLearn/mutations/deleteLanguageToLearn";
import deleteLanguagesToLearn from "@/db/languageToLearn/mutations/deleteLanguagesToLearn";

const Mutation: MutationResolvers = {
  createLanguageToLearn,
  createLanguagesToLearn,
  deleteLanguageToLearn,
  deleteLanguagesToLearn,
};

export default Mutation;
