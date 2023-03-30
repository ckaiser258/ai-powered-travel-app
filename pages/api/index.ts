import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { getToken, JWT } from "next-auth/jwt";
import fs from "fs";
import path from "path";
import Query from "../../lib/resolvers/Query";
import Mutation from "../../lib/resolvers/Mutation";

const prisma = new PrismaClient();

interface MyContext {
  prisma: PrismaClient;
  token?: JWT;
}

const server = new ApolloServer<MyContext>({
  typeDefs: fs.readFileSync(
    path.join(path.resolve(process.cwd()), "graphql/schema.graphql"),
    "utf8"
  ),
  resolvers: {
    Query,
    Exercise: {
      completions: (parent, args, context) => {
        return context.prisma.exercise
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .completions();
      },
    },
    Completion: {
      exercise: (parent, args, context) => {
        return context.prisma.completion
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .exercise();
      },
      user: (parent, args, context) => {
        return context.prisma.completion
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .user();
      },
    },
    // Mutation,
  },
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({
    req,
    res,
    prisma,
    token: await getToken({
      req,
      secret: process.env.JWT_SECRET,
    }),
  }),
});

console.log("Apollo Server is running on http://localhost:3000/api");
