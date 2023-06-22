import { MutationCreateLanguagesToLearnArgs } from "@/generated/graphql";
import { AppContext } from "@/lib/types";

const createLanguagesToLearn = async (
  parent,
  args: MutationCreateLanguagesToLearnArgs,
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

  let languagesToLearnThatAlreadyExist: string[] = [];

  args.languages.forEach((language) => {
    if (languagesToLearn.includes(language)) {
      languagesToLearnThatAlreadyExist.push(language);
    }
  });

  if (languagesToLearnThatAlreadyExist.length) {
    throw new Error(
      `User already has ${languagesToLearnThatAlreadyExist.join(
        ", "
      )} in their languagesToLearn`
    );
  }

  await context.prisma.user.update({
    where: {
      id: args.userId,
    },
    data: {
      languagesToLearn: {
        set: [...languagesToLearn, ...args.languages],
      },
    },
  });

  return args.languages;
};

export default createLanguagesToLearn;
