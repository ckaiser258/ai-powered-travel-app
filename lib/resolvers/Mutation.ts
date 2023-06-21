import { MutationResolvers } from "@/generated/graphql";
import createLanguageToLearn from "@/db/languageToLearn/mutations/createLanuageToLearn";
import deleteLanguageToLearn from "@/db/languageToLearn/mutations/deleteLanguageToLearn";

const Mutation: MutationResolvers = {
  createLanguageToLearn,
  deleteLanguageToLearn,
};

export default Mutation;
