import { QueryGetLanguagesToLearnArgs } from "@/generated/graphql";
import { AppContext } from "@/lib/types";

const getLanguagesToLearn = async (
  parent,
  args: QueryGetLanguagesToLearnArgs,
  context: AppContext
) => {
  const user = await context.prisma.user.findUnique({
    where: {
      id: args.userId,
    },
  });
  return user.languagesToLearn;
};

export default getLanguagesToLearn;
