import { MutationResolvers } from "@/generated/graphql";
import createLanguageToLearn from "@/db/languageToLearn/mutations/createLanuageToLearn";

const Mutation: MutationResolvers = {
  createLanguageToLearn,
};

export default Mutation;
