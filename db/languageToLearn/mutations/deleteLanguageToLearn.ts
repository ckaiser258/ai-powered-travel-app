import { MutationDeleteLanguageToLearnArgs } from "@/generated/graphql";
import { AppContext } from "@/lib/types";

const deleteLanguageToLearn = async (
  parent,
  args: MutationDeleteLanguageToLearnArgs,
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

  if (!languagesToLearn.includes(args.language)) {
    throw new Error(
      `User does not have ${args.language} in their languagesToLearn`
    );
  }

  await context.prisma.user.update({
    where: {
      id: args.userId,
    },
    data: {
      languagesToLearn: {
        set: languagesToLearn.filter((language) => language !== args.language),
      },
    },
  });

  return args.language;
};

export default deleteLanguageToLearn;
