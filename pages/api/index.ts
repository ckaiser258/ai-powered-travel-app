import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import path from "path";
import Query from "../../lib/resolvers/Query";
import Mutation from "../../lib/resolvers/Mutation";
import { AppContext } from "@/lib/types";

const prisma = new PrismaClient();

const server = new ApolloServer<AppContext>({
  typeDefs: fs.readFileSync(
    path.join(path.resolve(process.cwd()), "graphql/schema.graphql"),
    "utf8"
  ),
  resolvers: {
    Query,
    Mutation,
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
