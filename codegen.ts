import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "graphql/schema.graphql",
  documents: ["./**/*.tsx"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./generated/graphql.tsx": {
      plugins: ["typescript", "typescript-operations", "typescript-resolvers"],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
