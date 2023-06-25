import { MutationDeleteLanguagesToLearnArgs } from "@/generated/graphql";
import { AppContext } from "@/lib/types";

const deleteLanguagesToLearn = async (
  parent,
  args: MutationDeleteLanguagesToLearnArgs,
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

  let { languagesToLearn } = user;

  let languagesToLearnThatDoNotExist: string[] = [];

  args.languages.forEach((language) => {
    if (!languagesToLearn.includes(language)) {
      languagesToLearnThatDoNotExist.push(language);
    }
  });

  if (languagesToLearnThatDoNotExist.length) {
    throw new Error(
      `User does not have ${languagesToLearnThatDoNotExist.join(
        ", "
      )} in their languages to learn`
    );
  }

  await context.prisma.user.update({
    where: {
      id: args.userId,
    },
    data: {
      languagesToLearn: {
        set: languagesToLearn.filter(
          (language) => !args.languages.includes(language)
        ),
      },
    },
  });

  return args.languages;
};

export default deleteLanguagesToLearn;
