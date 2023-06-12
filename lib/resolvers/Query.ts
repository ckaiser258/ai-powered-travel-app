import { QueryResolvers } from "@/generated/graphql";
import getLanguagesToLearn from "@/db/languageToLearn/queries/getLanguagesToLearn";

const Query: QueryResolvers = {
  info: () => "This is the API of AI Powered Travel App",
  getLanguagesToLearn,
};

export default Query;
