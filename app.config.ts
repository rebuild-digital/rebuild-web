import { defineConfig } from "@solidjs/start/config";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  ssr: true,
  server: {
    preset: "static",
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/directory",
        "/insights",
        "/journey",
        "/tools",
        "/people",
        "/about",
        "/get-in-touch",
        "/privacy",
        "/changelog",
        "/open-positions",
        "/apply",
      ],
    },
  },
  vite: {
    plugins: [
      {
        enforce: "pre",
        ...mdx({
          remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
          jsxImportSource: "solid-js",
        }),
      },
      tailwindcss(),
    ],
    publicDir: "src/public",
    resolve: {
      alias: {
        "~": "/src",
      },
    },
  },
});
