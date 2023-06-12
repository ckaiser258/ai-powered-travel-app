import { MutationCreateLanguageToLearnArgs } from "@/generated/graphql";
import { AppContext } from "@/lib/types";

const createLanguageToLearn = async (
  parent,
  args: MutationCreateLanguageToLearnArgs,
  context: AppContext
) => {
  await context.prisma.user.update({
    where: {
      id: args.userId,
    },
    data: {
      languagesToLearn: {
        push: args.language,
      },
    },
  });

  return args.language;
};

export default createLanguageToLearn;
