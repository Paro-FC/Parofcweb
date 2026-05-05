import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "parofc-studio",
  title: "Paro FC",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9jkrup0j",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio",

  plugins: [structureTool({ structure })],

  schema: {
    types: schemaTypes,
  },
});
