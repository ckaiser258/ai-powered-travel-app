import { MutationCreateLanguageToLearnArgs } from "@/generated/graphql";
import { AppContext } from "@/lib/types";

const createLanguageToLearn = async (
  parent,
  args: MutationCreateLanguageToLearnArgs,
  context: AppContext
) => {
  const user = await context.prisma.user.findUnique({
    where: {
      id: args.userId,
    },
    select: {
      languagesToLearn: true,
    },
  });

  const { languagesToLearn } = user;

  if (languagesToLearn.includes(args.language)) {
    throw new Error(
      `User already has ${args.language} in their languagesToLearn`
    );
  }

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
